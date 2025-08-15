import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  AlertTriangle, 
  Camera, 
  FileOutput,
  FolderOpen 
} from 'lucide-react';
import { cn } from '@/utils/cn';

const navigation = [
  { name: 'ダッシュボード', href: '/', icon: LayoutDashboard },
  { name: '日報作成', href: '/create', icon: FileText },
  { name: '変化・要望記録', href: '/changes', icon: AlertTriangle },
  { name: '写真管理', href: '/photos', icon: Camera },
  { name: 'プロジェクト', href: '/projects', icon: FolderOpen },
  { name: 'レポート出力', href: '/export', icon: FileOutput },
];

export function Navigation() {
  return (
    <nav className="bg-gray-50 border-r border-gray-200 w-64 min-h-screen p-4">
      <div className="space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}