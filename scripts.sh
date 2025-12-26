#!/bin/bash

# Scripts úteis para desenvolvimento do CMS

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

echo_error() {
    echo -e "${RED}✗ $1${NC}"
}

echo_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar pré-requisitos
check_prerequisites() {
    echo_info "Verificando pré-requisitos..."
    
    if ! command_exists node; then
        echo_error "Node.js não está instalado"
        exit 1
    fi
    echo_success "Node.js: $(node --version)"
    
    if ! command_exists pnpm; then
        echo_error "pnpm não está instalado"
        echo_info "Instale com: npm install -g pnpm"
        exit 1
    fi
    echo_success "pnpm: $(pnpm --version)"
    
    if ! command_exists docker; then
        echo_error "Docker não está instalado"
        exit 1
    fi
    echo_success "Docker: $(docker --version)"
    
    if ! command_exists docker-compose; then
        echo_error "Docker Compose não está instalado"
        exit 1
    fi
    echo_success "Docker Compose: $(docker-compose --version)"
}

# Setup completo
setup() {
    echo_info "🚀 Iniciando setup completo..."
    
    check_prerequisites
    
    echo_info "Instalando dependências..."
    pnpm install
    echo_success "Dependências instaladas"
    
    echo_info "Copiando .env..."
    if [ ! -f .env ]; then
        cp .env.example .env
        echo_success ".env criado"
    else
        echo_info ".env já existe"
    fi
    
    echo_info "Iniciando serviços Docker..."
    docker-compose up -d
    echo_success "Serviços iniciados"
    
    echo_info "Aguardando serviços ficarem prontos (30s)..."
    sleep 30
    
    echo_info "Gerando Prisma Client..."
    cd packages/database && npx prisma generate && cd ../..
    echo_success "Prisma Client gerado"
    
    echo_info "Executando migrações..."
    pnpm db:migrate
    echo_success "Migrações executadas"
    
    echo_info "Populando banco com seed..."
    pnpm db:seed
    echo_success "Seed executado"
    
    echo_success "✨ Setup completo!"
    echo ""
    echo_info "Próximos passos:"
    echo "  1. Execute: pnpm dev"
    echo "  2. Acesse: http://localhost:4000/api/docs"
    echo "  3. Login: superadmin@dopovo.com.br / senha123"
}

# Reset completo
reset() {
    echo_info "🔄 Resetando projeto..."
    
    echo_info "Parando containers..."
    docker-compose down -v
    echo_success "Containers parados e volumes removidos"
    
    echo_info "Removendo node_modules..."
    find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
    echo_success "node_modules removidos"
    
    echo_info "Removendo build artifacts..."
    find . -name "dist" -type d -prune -exec rm -rf '{}' +
    find . -name ".next" -type d -prune -exec rm -rf '{}' +
    find . -name ".turbo" -type d -prune -exec rm -rf '{}' +
    echo_success "Build artifacts removidos"
    
    echo_success "✨ Reset completo!"
    echo_info "Execute 'pnpm run setup' para reconfigurar"
}

# Iniciar desenvolvimento
dev() {
    echo_info "🚀 Iniciando modo desenvolvimento..."
    
    # Verificar se serviços estão rodando
    if ! docker-compose ps | grep -q "Up"; then
        echo_info "Iniciando serviços Docker..."
        docker-compose up -d
        sleep 10
    fi
    
    echo_info "Iniciando aplicações..."
    pnpm dev
}

# Verificar saúde dos serviços
health() {
    echo_info "🏥 Verificando saúde dos serviços..."
    
    # PostgreSQL
    if docker-compose exec -T postgres pg_isready -U cms_user -d cms_portal >/dev/null 2>&1; then
        echo_success "PostgreSQL: OK"
    else
        echo_error "PostgreSQL: FALHOU"
    fi
    
    # Redis
    if docker-compose exec -T redis redis-cli ping | grep -q "PONG"; then
        echo_success "Redis: OK"
    else
        echo_error "Redis: FALHOU"
    fi
    
    # Meilisearch
    if curl -s http://localhost:7700/health | grep -q "available"; then
        echo_success "Meilisearch: OK"
    else
        echo_error "Meilisearch: FALHOU"
    fi
    
    # MinIO
    if curl -s http://localhost:9000/minio/health/live >/dev/null 2>&1; then
        echo_success "MinIO: OK"
    else
        echo_error "MinIO: FALHOU"
    fi
}

# Backup do banco
backup() {
    echo_info "💾 Criando backup do banco..."
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="backup_${TIMESTAMP}.sql"
    
    docker-compose exec -T postgres pg_dump -U cms_user cms_portal > "$BACKUP_FILE"
    
    echo_success "Backup criado: $BACKUP_FILE"
}

# Restaurar backup
restore() {
    if [ -z "$1" ]; then
        echo_error "Uso: ./scripts.sh restore <arquivo_backup.sql>"
        exit 1
    fi
    
    if [ ! -f "$1" ]; then
        echo_error "Arquivo não encontrado: $1"
        exit 1
    fi
    
    echo_info "📥 Restaurando backup: $1"
    
    docker-compose exec -T postgres psql -U cms_user -d cms_portal < "$1"
    
    echo_success "Backup restaurado"
}

# Logs dos serviços
logs() {
    SERVICE=${1:-}
    
    if [ -z "$SERVICE" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$SERVICE"
    fi
}

# Executar testes
test() {
    echo_info "🧪 Executando testes..."
    pnpm test
}

# Lint e format
lint() {
    echo_info "🔍 Executando lint..."
    pnpm lint
    
    echo_info "💅 Formatando código..."
    pnpm format
    
    echo_success "Código verificado e formatado"
}

# Build de produção
build() {
    echo_info "🏗️  Buildando para produção..."
    
    echo_info "Limpando builds anteriores..."
    pnpm turbo run clean
    
    echo_info "Executando build..."
    pnpm build
    
    echo_success "Build concluído"
}

# Prisma Studio
studio() {
    echo_info "🎨 Abrindo Prisma Studio..."
    pnpm db:studio
}

# Menu de ajuda
help() {
    cat << EOF
🎯 Scripts do CMS Portal de Notícias

Uso: ./scripts.sh <comando> [opções]

Comandos disponíveis:

  setup           Setup completo do projeto
  reset           Reset completo (remove tudo)
  dev             Inicia modo desenvolvimento
  health          Verifica saúde dos serviços
  backup          Cria backup do banco de dados
  restore <file>  Restaura backup do banco
  logs [service]  Mostra logs dos containers
  test            Executa testes
  lint            Lint e format do código
  build           Build de produção
  studio          Abre Prisma Studio
  help            Mostra esta ajuda

Exemplos:

  ./scripts.sh setup
  ./scripts.sh dev
  ./scripts.sh logs api
  ./scripts.sh backup
  ./scripts.sh restore backup_20240115_103000.sql

Para mais informações, consulte README.md e QUICKSTART.md
EOF
}

# Main
case "${1:-help}" in
    setup)
        setup
        ;;
    reset)
        reset
        ;;
    dev)
        dev
        ;;
    health)
        health
        ;;
    backup)
        backup
        ;;
    restore)
        restore "$2"
        ;;
    logs)
        logs "$2"
        ;;
    test)
        test
        ;;
    lint)
        lint
        ;;
    build)
        build
        ;;
    studio)
        studio
        ;;
    help|*)
        help
        ;;
esac
