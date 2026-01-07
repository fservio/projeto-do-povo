import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const footerNavigation = {
  sections: [
    {
      title: 'Seções',
      links: [
        { name: 'Notícias', href: '/categoria/noticias' },
        { name: 'Política', href: '/categoria/politica' },
        { name: 'Economia', href: '/categoria/economia' },
        { name: 'Esportes', href: '/categoria/esportes' },
        { name: 'Cultura', href: '/categoria/cultura' },
      ],
    },
    {
      title: 'Institucional',
      links: [
        { name: 'Sobre Nós', href: '/sobre' },
        { name: 'Contato', href: '/contato' },
        { name: 'Anuncie', href: '/anuncie' },
        { name: 'Trabalhe Conosco', href: '/trabalhe-conosco' },
      ],
    },
    {
      title: 'Políticas',
      links: [
        { name: 'Termos de Uso', href: '/termos' },
        { name: 'Política de Privacidade', href: '/privacidade' },
        { name: 'Política de Cookies', href: '/cookies' },
      ],
    },
  ],
  social: [
    {
      name: 'Facebook',
      href: '#',
      icon: Facebook,
    },
    {
      name: 'Twitter',
      href: '#',
      icon: Twitter,
    },
    {
      name: 'Instagram',
      href: '#',
      icon: Instagram,
    },
    {
      name: 'YouTube',
      href: '#',
      icon: Youtube,
    },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4">Portal do Povo</h3>
            <p className="text-gray-400 text-sm">
              Seu portal de notícias confiável, trazendo informação de qualidade
              para você.
            </p>
            <div className="flex space-x-4 mt-6">
              {footerNavigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-white"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {footerNavigation.sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Portal do Povo. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
