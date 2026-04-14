"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, FileText, FolderTree, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // 1. AUTH PROTECTION: Redirect if no access token exists
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  // 2. LOGOUT LOGIC: Clear tokens and state
  const handleLogout = () => {
    // Clear all auth-related items from storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Optional: Clear any other session data if you add it later
    // localStorage.clear(); 

    // Redirect to login page immediately
    router.push('/admin/login');
  };

  // Skip layout if on login page
  if (pathname === '/admin/login') return <>{children}</>;

  const menu = [
    { name: 'Overview', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Articles', icon: <FileText size={20} />, path: '/admin/articles' },
    { name: 'Categories', icon: <FolderTree size={20} />, path: '/admin/categories' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col p-6 fixed h-full z-50">
        
        {/* Brand Header */}
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-[#114AB1] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <ShieldCheck size={24} />
          </div>
          <div>
            <span className="text-xl font-black text-[#114AB1] block leading-none">COMMAND</span>
            <span className="text-[10px] text-[#E4580B] font-bold uppercase tracking-widest">SoloLife OS</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow space-y-2">
          {menu.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all duration-200 ${
                pathname === item.path 
                ? 'bg-[#114AB1] text-white shadow-xl shadow-blue-900/20' 
                : 'text-[#6793AC] hover:bg-gray-50 hover:text-[#114AB1]'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="pt-6 border-t border-gray-100 space-y-3">
          <Link 
            href="/" 
            className="flex items-center gap-3 p-4 text-[#6793AC] font-bold hover:text-[#E4580B] hover:bg-orange-50 rounded-2xl transition-all duration-200"
          >
            <ExternalLink size={20} /> 
            <span>View Public Site</span>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all duration-200 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            <span>System Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow ml-72 p-10 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}