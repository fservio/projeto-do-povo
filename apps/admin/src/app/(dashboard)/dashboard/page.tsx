'use client'

import { useSession } from 'next-auth/react'
import { FileText, Users, MessageSquare, Eye } from 'lucide-react'

export default function DashboardPage() {
  const { data: session } = useSession()

  const stats = [
    { name: 'Total de Artigos', value: '248', icon: FileText, change: '+12%' },
    { name: 'Usuários Ativos', value: '12', icon: Users, change: '+3%' },
    { name: 'Comentários Pendentes', value: '34', icon: MessageSquare, change: '-8%' },
    { name: 'Visualizações (Hoje)', value: '12.4k', icon: Eye, change: '+23%' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bem-vindo, {session?.user?.name || session?.user?.email}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Aqui está um resumo do seu portal de notícias
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Artigos Recentes
            </h3>
            <div className="mt-5">
              <p className="text-sm text-gray-500">
                Nenhum artigo encontrado. Crie seu primeiro artigo!
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Atividade Recente
            </h3>
            <div className="mt-5">
              <p className="text-sm text-gray-500">
                Nenhuma atividade recente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
