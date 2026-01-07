'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Tags,
  Image,
  Home,
  MessageSquare,
  DollarSign,
  Users,
  FileCheck,
  Settings,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Artigos', href: '/dashboard/articles', icon: FileText },
  { name: 'Categorias', href: '/dashboard/categories', icon: FolderTree },
  { name: 'Tags', href: '/dashboard/tags', icon: Tags },
  { name: 'Mídia', href: '/dashboard/media', icon: Image },
  { name: 'Home Page', href: '/dashboard/home', icon: Home },
  { name: 'Comentários', href: '/dashboard/comments', icon: MessageSquare },
  { name: 'Publicidade', href: '/dashboard/ads', icon: DollarSign },
  { name: 'Edições PDF', href: '/dashboard/pdf-editions', icon: FileCheck },
  { name: 'Usuários', href: '/dashboard/users', icon: Users },
  { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-4">
            <h1 className="text-xl font-bold text-gray-900">
              CMS Portal do Povo
            </h1>
          </div>
          <nav className="mt-5 flex-1 space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
