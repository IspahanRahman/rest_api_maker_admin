'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FolderKanban,
  Package,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Bell,
  Search,
  ChevronDown,
  Moon,
  Sun,
  Database
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { logout, getCurrentUser } from '@/lib/auth'
import { toast } from 'react-toastify'

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Packages', href: '/customer-packages', icon: Package },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Project Tables', href: '/project-tables', icon: Database },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()
  const locale = params?.locale || 'en'
  const { theme, setTheme } = useTheme()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar for desktop */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-surface-card border-r border-border-subtle transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-border-subtle">
            <Link href={`/${locale}/dashboard`} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="font-bold text-lg text-text-primary-sem">REST API Maker</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-hover"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === `/${locale}${item.href}`

              return (
                <Link
                  key={item.name}
                  href={`/${locale}${item.href}`}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary-sem'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border-subtle">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-hover cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary-sem truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-surface-card border-b border-border-subtle">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-hover"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search bar */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-input border border-border-subtle w-96">
              <Search className="w-4 h-4 text-text-secondary" />
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary-sem placeholder:text-text-secondary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-surface-hover cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-text-secondary" />
              ) : (
                <Moon className="w-5 h-5 text-text-secondary" />
              )}
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-surface-hover cursor-pointer">
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full"></span>
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-hover cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
                <ChevronDown className="w-4 h-4 text-text-secondary" />
              </button>

              {profileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-surface-card rounded-lg shadow-lg border border-border-subtle z-50">
                    <Link
                      href={`/${locale}/dashboard/settings`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary-sem"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-error-500 hover:bg-surface-hover"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
