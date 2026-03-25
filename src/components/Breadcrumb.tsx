import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNames: Record<string, string> = {
  '/admin': 'Quản lý HTX',
  '/admin/land': 'Quản lý Mã vùng trồng',
  '/admin/farmer': 'Quản lý Nông dân',
  '/admin/report': 'Báo cáo tổng hợp',
  '/admin/material': 'Quản lý Vật tư',
  '/admin/process': 'Quản lý Quy trình',
};

export function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Only show breadcrumbs in /admin routes
  if (pathnames[0] !== 'admin') return null;

  return (
    <nav className="flex text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/admin" className="inline-flex items-center hover:text-emerald-600 transition-colors">
            <Home size={16} className="mr-1" />
            Trang chủ
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          
          let name = routeNames[to] || value;
          
          // Handle dynamic routes like /admin/report/log/:id
          if (pathnames[index - 1] === 'log') {
            name = 'Chi tiết Nhật ký';
          } else if (pathnames[index - 1] === 'incident') {
            name = 'Chi tiết Sự cố';
          } else if (value === 'log' || value === 'incident') {
            return null; // Skip the 'log' or 'incident' segment itself
          }

          // Skip the first 'admin' segment since we already have 'Trang chủ' pointing to /admin
          if (index === 0 && value === 'admin') return null;

          return (
            <li key={to}>
              <div className="flex items-center">
                <ChevronRight size={16} className="text-gray-400 mx-1" />
                {isLast ? (
                  <span className="text-gray-800 font-medium" aria-current="page">
                    {name}
                  </span>
                ) : (
                  <Link to={to} className="hover:text-emerald-600 transition-colors">
                    {name}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
