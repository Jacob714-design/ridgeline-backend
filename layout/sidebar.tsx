'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { UserRole } from '@/types';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/app/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Claims',
    href: '/app/claims',
    icon: FileText,
  },
  {
    title: 'Clients',
    href: '/app/clients',
    icon: Users,
  },
  {
    title: 'Settings',
    href: '/app/settings',
    icon: Settings,
    roles: ['ADMIN'],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const filteredNavItems = navItems.filter(
    item => !item.roles || item.roles.includes(session?.user.role as UserRole)
  );

  return (
    <aside
      className={cn(
        'relative flex h-screen flex-col border-r bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href="/app/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="text-xl font-bold">RidgeLine</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(collapsed && 'mx-auto')}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  collapsed && 'justify-center'
                )}
              >
                <Icon className={cn('h-5 w-5', !collapsed && 'mr-3')} />
                {!collapsed && <span>{item.title}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start text-sm',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className={cn('h-5 w-5', !collapsed && 'mr-3')} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}