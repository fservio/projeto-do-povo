import { PrismaClient, ArticleType, ArticleStatus, HomeLayout, BlockType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // ============================================
  // 1. SITES
  // ============================================
  console.log('📍 Criando sites...');
  
  const portalSite = await prisma.site.upsert({
    where: { slug: 'portal' },
    update: {},
    create: {
      slug: 'portal',
      name: 'Portal do Povo',
      domain: 'dopovo.com.br',
      description: 'Portal de notícias, variedades e serviços',
      settings: {
        theme: 'magazine',
        enableComments: true,
        enableAds: true,
      },
      active: true,
    },
  });

  const diarioSite = await prisma.site.upsert({
    where: { slug: 'diario' },
    update: {},
    create: {
      slug: 'diario',
      name: 'Diário do Povo',
      domain: 'diario.dopovo.com.br',
      description: 'Jornal digital com edições em PDF',
      settings: {
        theme: 'newspaper',
        enableComments: false,
        enableAds: true,
        enablePdfEditions: true,
      },
      active: true,
    },
  });

  // ============================================
  // 2. PERMISSÕES
  // ============================================
  console.log('🔐 Criando permissões...');

  const resources = ['articles', 'pages', 'home', 'media', 'categories', 'tags', 'users', 'comments', 'ads', 'newsletters', 'seo', 'integrations'];
  const actions = ['create', 'read', 'update', 'delete', 'publish', 'moderate', 'manage'];

  const permissions = [];
  for (const resource of resources) {
    for (const action of actions) {
      const permission = await prisma.permission.upsert({
        where: { 
          resource_action: { resource, action }
        },
        update: {},
        create: {
          resource,
          action,
          description: `${action} ${resource}`,
        },
      });
      permissions.push(permission);
    }
  }

  // ============================================
  // 3. ROLES
  // ============================================
  console.log('👥 Criando roles...');

  const superAdminRole = await prisma.role.upsert({
    where: { slug: 'super-admin' },
    update: {},
    create: {
      name: 'Super Admin',
      slug: 'super-admin',
      description: 'Acesso total ao sistema',
      level: 100,
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { slug: 'admin' },
    update: {},
    create: {
      name: 'Admin',
      slug: 'admin',
      description: 'Administrador',
      level: 90,
    },
  });

  const editorChiefRole = await prisma.role.upsert({
    where: { slug: 'editor-chief' },
    update: {},
    create: {
      name: 'Editor-Chefe',
      slug: 'editor-chief',
      description: 'Editor-chefe com controle editorial completo',
      level: 80,
    },
  });

  const editorRole = await prisma.role.upsert({
    where: { slug: 'editor' },
    update: {},
    create: {
      name: 'Editor',
      slug: 'editor',
      description: 'Editor de conteúdo',
      level: 70,
    },
  });

  const reporterRole = await prisma.role.upsert({
    where: { slug: 'reporter' },
    update: {},
    create: {
      name: 'Repórter',
      slug: 'reporter',
      description: 'Repórter/Redator',
      level: 60,
    },
  });

  const socialMediaRole = await prisma.role.upsert({
    where: { slug: 'social-media' },
    update: {},
    create: {
      name: 'Social Media',
      slug: 'social-media',
      description: 'Gerenciamento de redes sociais',
      level: 50,
    },
  });

  const copyDeskRole = await prisma.role.upsert({
    where: { slug: 'copy-desk' },
    update: {},
    create: {
      name: 'Revisão/Copydesk',
      slug: 'copy-desk',
      description: 'Revisão e copydesk',
      level: 65,
    },
  });

  const photographerRole = await prisma.role.upsert({
    where: { slug: 'photographer' },
    update: {},
    create: {
      name: 'Fotógrafo/Multimídia',
      slug: 'photographer',
      description: 'Gestão de mídia',
      level: 55,
    },
  });

  const commercialRole = await prisma.role.upsert({
    where: { slug: 'commercial' },
    update: {},
    create: {
      name: 'Comercial',
      slug: 'commercial',
      description: 'Gestão de publicidade',
      level: 40,
    },
  });

  const supportRole = await prisma.role.upsert({
    where: { slug: 'support' },
    update: {},
    create: {
      name: 'Suporte/Atendimento',
      slug: 'support',
      description: 'Suporte e atendimento',
      level: 30,
    },
  });

  // Atribuir todas as permissões ao SuperAdmin
  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // ============================================
  // 4. USUÁRIOS DEMO
  // ============================================
  console.log('👤 Criando usuários demo...');

  const passwordHash = await bcrypt.hash('senha123', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@dopovo.com.br' },
    update: {},
    create: {
      email: 'superadmin@dopovo.com.br',
      username: 'superadmin',
      passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
      active: true,
      emailVerified: new Date(),
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: superAdmin.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: superAdmin.id,
      roleId: superAdminRole.id,
    },
  });

  const editorChief = await prisma.user.upsert({
    where: { email: 'editor@dopovo.com.br' },
    update: {},
    create: {
      email: 'editor@dopovo.com.br',
      username: 'editorchefe',
      passwordHash,
      firstName: 'João',
      lastName: 'Editor',
      active: true,
      emailVerified: new Date(),
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: editorChief.id,
        roleId: editorChiefRole.id,
      },
    },
    update: {},
    create: {
      userId: editorChief.id,
      roleId: editorChiefRole.id,
    },
  });

  const reporter = await prisma.user.upsert({
    where: { email: 'reporter@dopovo.com.br' },
    update: {},
    create: {
      email: 'reporter@dopovo.com.br',
      username: 'reporter',
      passwordHash,
      firstName: 'Maria',
      lastName: 'Silva',
      active: true,
      emailVerified: new Date(),
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: reporter.id,
        roleId: reporterRole.id,
      },
    },
    update: {},
    create: {
      userId: reporter.id,
      roleId: reporterRole.id,
    },
  });

  // ============================================
  // 5. PERFIS DE AUTOR
  // ============================================
  console.log('✍️ Criando perfis de autor...');

  const authorProfile = await prisma.authorProfile.upsert({
    where: { userId: reporter.id },
    update: {},
    create: {
      userId: reporter.id,
      displayName: 'Maria Silva',
      slug: 'maria-silva',
      bio: 'Jornalista especializada em política e economia',
      social: {
        twitter: '@mariasilva',
        instagram: '@mariasilva',
      },
      specialty: 'Política e Economia',
      active: true,
    },
  });

  // ============================================
  // 6. CATEGORIAS
  // ============================================
  console.log('📂 Criando categorias...');

  const categoriesPortal = [
    { name: 'Notícias', slug: 'noticias', color: '#e74c3c' },
    { name: 'Política', slug: 'politica', color: '#3498db' },
    { name: 'Economia', slug: 'economia', color: '#2ecc71' },
    { name: 'Esportes', slug: 'esportes', color: '#f39c12' },
    { name: 'Entretenimento', slug: 'entretenimento', color: '#9b59b6' },
    { name: 'Tecnologia', slug: 'tecnologia', color: '#1abc9c' },
    { name: 'Saúde', slug: 'saude', color: '#e67e22' },
    { name: 'Educação', slug: 'educacao', color: '#34495e' },
  ];

  const portalCategories: any[] = [];
  for (const cat of categoriesPortal) {
    const category = await prisma.category.upsert({
      where: {
        siteId_slug: {
          siteId: portalSite.id,
          slug: cat.slug,
        },
      },
      update: {},
      create: {
        siteId: portalSite.id,
        name: cat.name,
        slug: cat.slug,
        color: cat.color,
        active: true,
      },
    });
    portalCategories.push(category);
  }

  const categoriesDiario = [
    { name: 'Primeira Página', slug: 'primeira-pagina', color: '#c0392b' },
    { name: 'Política', slug: 'politica', color: '#2980b9' },
    { name: 'Economia', slug: 'economia', color: '#27ae60' },
    { name: 'Opinião', slug: 'opiniao', color: '#8e44ad' },
    { name: 'Cultura', slug: 'cultura', color: '#d35400' },
    { name: 'Esportes', slug: 'esportes', color: '#c0392b' },
  ];

  const diarioCategories: any[] = [];
  for (const cat of categoriesDiario) {
    const category = await prisma.category.upsert({
      where: {
        siteId_slug: {
          siteId: diarioSite.id,
          slug: cat.slug,
        },
      },
      update: {},
      create: {
        siteId: diarioSite.id,
        name: cat.name,
        slug: cat.slug,
        color: cat.color,
        active: true,
      },
    });
    diarioCategories.push(category);
  }

  // ============================================
  // 7. TAGS
  // ============================================
  console.log('🏷️ Criando tags...');

  const tagNames = ['urgente', 'destaque', 'exclusivo', 'investigacao', 'local', 'nacional', 'internacional', 'video', 'podcast', 'galeria'];
  const tags: any[] = [];
  for (const tagName of tagNames) {
    const tag = await prisma.tag.upsert({
      where: { slug: tagName },
      update: {},
      create: {
        name: tagName.charAt(0).toUpperCase() + tagName.slice(1),
        slug: tagName,
      },
    });
    tags.push(tag);
  }

  // ============================================
  // 8. ARTIGOS DEMO
  // ============================================
  console.log('📰 Criando artigos demo...');

  const article1 = await prisma.article.create({
    data: {
      siteId: portalSite.id,
      type: ArticleType.NEWS,
      status: ArticleStatus.PUBLISHED,
      title: 'Cidade inaugura novo centro cultural com programação para todas as idades',
      subtitle: 'Espaço conta com teatro, biblioteca e salas de oficinas',
      slug: 'cidade-inaugura-novo-centro-cultural',
      excerpt: 'A prefeitura inaugurou nesta sexta-feira o novo centro cultural da cidade, um espaço moderno que promete movimentar a cena cultural local.',
      content: `<h2>Um novo marco cultural</h2>
<p>A prefeitura inaugurou nesta sexta-feira o novo centro cultural da cidade, um espaço moderno que promete movimentar a cena cultural local. O equipamento conta com teatro para 500 pessoas, biblioteca com acervo de mais de 20 mil títulos e diversas salas para oficinas e cursos.</p>

<p>Durante a cerimônia de inauguração, o prefeito destacou a importância do investimento em cultura. "Este é um dia histórico para nossa cidade. Estamos entregando um espaço de qualidade para que nosso povo possa ter acesso à arte e à cultura", declarou.</p>

<h3>Programação diversificada</h3>
<p>A programação de abertura inclui apresentações teatrais, shows musicais e exposições de arte. Nos próximos meses, o centro cultural oferecerá oficinas gratuitas de teatro, música, dança e artes plásticas.</p>

<p>O equipamento funcionará de terça a domingo, das 9h às 22h, com entrada gratuita. A expectativa é receber mais de 5 mil visitantes por mês.</p>`,
      authorId: authorProfile.id,
      categoryId: portalCategories[0].id,
      publishedAt: new Date(),
      createdBy: reporter.id,
      featured: true,
      seoTitle: 'Cidade inaugura novo centro cultural',
      seoDescription: 'Novo espaço cultural conta com teatro, biblioteca e salas de oficinas',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: 'Cidade inaugura novo centro cultural com programação para todas as idades',
        datePublished: new Date().toISOString(),
      },
    },
  });

  await prisma.articleTag.createMany({
    data: [
      { articleId: article1.id, tagId: tags[1].id }, // destaque
      { articleId: article1.id, tagId: tags[4].id }, // local
    ],
  });

  const article2 = await prisma.article.create({
    data: {
      siteId: portalSite.id,
      type: ArticleType.NEWS,
      status: ArticleStatus.PUBLISHED,
      title: 'Economia brasileira cresce acima do esperado no último trimestre',
      subtitle: 'PIB surpreende analistas e mostra recuperação consistente',
      slug: 'economia-brasileira-cresce-acima-esperado',
      excerpt: 'O PIB brasileiro cresceu 0,8% no último trimestre, superando as expectativas do mercado que previam alta de 0,5%.',
      content: `<h2>Crescimento surpreende</h2>
<p>O PIB brasileiro cresceu 0,8% no último trimestre, superando as expectativas do mercado que previam alta de 0,5%. Os dados divulgados pelo IBGE mostram uma recuperação consistente da economia.</p>

<p>O setor de serviços foi o principal responsável pelo bom desempenho, crescendo 1,2% no período. A indústria também apresentou resultado positivo, com alta de 0,4%.</p>

<h3>Análise de especialistas</h3>
<p>Economistas avaliam que a recuperação está relacionada à estabilidade política e às reformas estruturais implementadas nos últimos anos. "Vemos uma economia mais robusta e preparada para enfrentar desafios", afirma especialista.</p>`,
      authorId: authorProfile.id,
      categoryId: portalCategories[2].id,
      publishedAt: new Date(Date.now() - 86400000), // 1 dia atrás
      createdBy: reporter.id,
      seoTitle: 'PIB brasileiro cresce 0,8% no trimestre',
      seoDescription: 'Economia supera expectativas e mostra recuperação',
    },
  });

  await prisma.articleTag.createMany({
    data: [
      { articleId: article2.id, tagId: tags[5].id }, // nacional
    ],
  });

  // Artigo para o Diário
  const article3 = await prisma.article.create({
    data: {
      siteId: diarioSite.id,
      type: ArticleType.ARTICLE,
      status: ArticleStatus.PUBLISHED,
      title: 'Reforma educacional divide opiniões de especialistas',
      subtitle: 'Proposta prevê mudanças no currículo do ensino médio',
      slug: 'reforma-educacional-divide-opinioes',
      excerpt: 'A proposta de reforma do ensino médio apresentada pelo governo tem gerado intenso debate entre educadores e especialistas.',
      content: `<h2>Pontos controversos</h2>
<p>A proposta de reforma do ensino médio apresentada pelo governo tem gerado intenso debate entre educadores e especialistas. As principais mudanças incluem a flexibilização do currículo e a ampliação da carga horária.</p>

<p>Defensores da reforma argumentam que as mudanças tornarão o ensino mais atraente e adequado às demandas do mercado de trabalho. Críticos, por outro lado, temem que a flexibilização possa prejudicar a formação integral dos estudantes.</p>

<h3>Próximos passos</h3>
<p>O projeto será discutido nas próximas semanas em audiências públicas antes de ser votado no Congresso Nacional.</p>`,
      authorId: authorProfile.id,
      categoryId: diarioCategories[1].id,
      publishedAt: new Date(Date.now() - 172800000), // 2 dias atrás
      createdBy: reporter.id,
    },
  });

  // ============================================
  // 9. HOME PAGE PORTAL
  // ============================================
  console.log('🏠 Criando home page do Portal...');

  const homePortal = await prisma.homePage.create({
    data: {
      siteId: portalSite.id,
      name: 'Home Principal - Portal',
      layout: HomeLayout.MODULAR_GRID,
      active: true,
      createdBy: editorChief.id,
    },
  });

  const sectionDestaque = await prisma.homeSection.create({
    data: {
      homePageId: homePortal.id,
      name: 'Destaque Principal',
      order: 1,
    },
  });

  await prisma.homeBlock.create({
    data: {
      sectionId: sectionDestaque.id,
      type: BlockType.FEATURED_MAIN,
      title: 'Manchete',
      articleId: article1.id,
      contentType: 'manual',
      order: 1,
    },
  });

  const sectionNoticias = await prisma.homeSection.create({
    data: {
      homePageId: homePortal.id,
      name: 'Últimas Notícias',
      order: 2,
    },
  });

  await prisma.homeBlock.create({
    data: {
      sectionId: sectionNoticias.id,
      type: BlockType.EDITORIAL_LIST,
      title: 'Notícias',
      contentType: 'auto',
      contentRules: {
        categoryId: portalCategories[0].id,
        limit: 10,
      },
      order: 1,
    },
  });

  // ============================================
  // 10. HOME PAGE DIÁRIO
  // ============================================
  console.log('📰 Criando home page do Diário...');

  const homeDiario = await prisma.homePage.create({
    data: {
      siteId: diarioSite.id,
      name: 'Home Principal - Diário',
      layout: HomeLayout.MINIMALIST,
      active: true,
      createdBy: editorChief.id,
    },
  });

  const sectionDiario = await prisma.homeSection.create({
    data: {
      homePageId: homeDiario.id,
      name: 'Primeira Página',
      order: 1,
    },
  });

  await prisma.homeBlock.create({
    data: {
      sectionId: sectionDiario.id,
      type: BlockType.FEATURED_MAIN,
      title: 'Destaque do Dia',
      articleId: article3.id,
      contentType: 'manual',
      order: 1,
    },
  });

  // ============================================
  // 11. EDIÇÃO PDF (ISSUU)
  // ============================================
  console.log('📄 Criando edição PDF demo...');

  await prisma.pdfEdition.create({
    data: {
      siteId: diarioSite.id,
      title: 'Edição de Hoje - ' + new Date().toLocaleDateString('pt-BR'),
      description: 'Edição digital completa do Diário do Povo',
      editionDate: new Date(),
      issuuEmbedUrl: 'https://issuu.com/example/docs/diario-do-povo',
      active: true,
      publishedAt: new Date(),
    },
  });

  // ============================================
  // 12. AD SLOTS
  // ============================================
  console.log('📊 Criando slots de publicidade...');

  const adSlotHeader = await prisma.adSlot.create({
    data: {
      siteId: portalSite.id,
      name: 'Banner Topo',
      slug: 'header-banner',
      position: 'header',
      dimensions: '728x90',
      active: true,
    },
  });

  await prisma.adCampaign.create({
    data: {
      adSlotId: adSlotHeader.id,
      name: 'Campanha Demo',
      type: 'html',
      content: '<div style="background: #f0f0f0; padding: 20px; text-align: center;">Espaço publicitário 728x90</div>',
      active: true,
    },
  });

  console.log('✅ Seed concluído com sucesso!');
  console.log('\n📧 Usuários criados:');
  console.log('  - superadmin@dopovo.com.br (senha: senha123)');
  console.log('  - editor@dopovo.com.br (senha: senha123)');
  console.log('  - reporter@dopovo.com.br (senha: senha123)');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
