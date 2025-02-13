import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BookOpen, Layout, BookText, FolderOpen, History, Settings, Globe, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Layout },
  { name: 'Spanish History', href: '/history', icon: Globe },
  { name: 'Study Activities', href: '/study-activities', icon: BookOpen },
  { name: 'Words', href: '/words', icon: BookText },
  { name: 'Word Groups', href: '/groups', icon: FolderOpen },
  { name: 'Sessions', href: '/sessions', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Vocabulary 📚', href: '/vocabulary', icon: BookText },
];

export default function Navigation() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  return (
    <nav className="border-b shadow-sm bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-[#AA151B]" />
              <span className="text-xl font-bold bg-gradient-to-r from-[#AA151B] to-[#F1BF00] bg-clip-text text-transparent">
                ¡Aprende!
              </span>
            </Link>
            <div className="flex space-x-4">
              {navigation.map(({ name, href, icon: Icon }) => {
                return (
                  <Link
                    key={name}
                    to={href}
                    className={cn(
                      'flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-300',
                      location.pathname === href
                        ? 'bg-gradient-to-r from-[#AA151B] to-[#F1BF00] text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-[#AA151B] dark:hover:text-[#F1BF00]'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-[#AA151B] dark:hover:text-[#F1BF00] transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}