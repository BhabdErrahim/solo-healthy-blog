"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, FileText, FolderTree, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    // Flexible check for login path
    const isLoginPage = pathname?.includes('/admin/login');
    if (!token && !isLoginPage) {
      router.push('/admin/login/');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/admin/login/');
  };

  // FIX: Use .includes or check for both versions of the slash
  if (pathname?.includes('/admin/login')) {
    return <div className="min-h-screen bg-brand-deep">{children}</div>;
  }

  const menu = [
    { name: 'Overview', icon: <LayoutDashboard size={20} />, path: '/admin/' },
    { name: 'Articles', icon: <FileText size={20} />, path: '/admin/articles/' },
    { name: 'Categories', icon: <FolderTree size={20} />, path: '/admin/categories/' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-full shadow-xl z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#114AB1] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <ShieldCheck size={24} />
          </div>
          <div>
            <span className="text-xl font-black text-[#114AB1] block leading-none">COMMAND</span>
            <span className="text-[10px] text-[#E4580B] font-bold uppercase tracking-widest">SoloLife OS</span>
          </div>
        </div>

        <nav className="flex-grow overflow-y-auto px-4 py-2 space-y-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 mb-4">Main Menu</p>
          {menu.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all duration-200 ${
                pathname === item.path 
                ? 'bg-[#114AB1] text-white shadow-lg shadow-blue-900/20' 
                : 'text-[#6793AC] hover:bg-gray-50 hover:text-[#114AB1]'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-gray-100 bg-white">
          <Link 
            href="/" 
            className="flex items-center gap-3 p-4 text-[#6793AC] font-bold hover:text-[#114AB1] hover:bg-blue-50 rounded-2xl transition-all mb-2"
          >
            <ExternalLink size={20} /> 
            <span className="text-sm">Public Site</span>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow overflow-y-auto p-10">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}