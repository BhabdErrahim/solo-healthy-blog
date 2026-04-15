"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Search, Leaf, Plane, Home, Dumbbell, Utensils, Zap } from 'lucide-react';

const Navbar = () => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { name: 'Healthy Habits', slug: 'healthy', icon: <Leaf className="w-5 h-5" />, desc: 'Neuroscience & Longevity.' },
    { name: 'Solo Traveling', slug: 'traveling', icon: <Plane className="w-5 h-5" />, desc: 'Global exploration.' },
    { name: 'Solo Living', slug: 'solo-living', icon: <Home className="w-5 h-5" />, desc: 'Sanctuary engineering.' },
    { name: 'Sport & Fitness', slug: 'sport', icon: <Dumbbell className="w-5 h-5" />, desc: 'Autonomous training.' },
    { name: 'Food Recipes', slug: 'food-recipes', icon: <Utensils className="w-5 h-5" />, desc: 'Gourmet for one.' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 ${
        isScrolled 
          ? 'py-3 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          
          {/* 1. Logo */}
          <Link href="/" className="flex items-center gap-3 group relative z-[1001]">
            <div className="w-10 h-10 bg-[#114AB1] rounded-xl flex items-center justify-center text-white font-black text-xl transition-transform group-hover:rotate-12 shadow-lg shadow-blue-200">
              S
            </div>
            <span className="text-2xl font-black tracking-tighter text-[#114AB1]">
              SOLO<span className="text-[#E4580B]">LIFE</span>
            </span>
          </Link>

          {/* 2. Main Navigation - Pill Style */}
          <div className="hidden md:flex items-center bg-white/40 backdrop-blur-md px-2 py-2 rounded-2xl border border-white/50 shadow-sm">
            <Link 
              href="/" 
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                pathname === '/' ? 'bg-[#114AB1] text-white shadow-md' : 'text-gray-700 hover:text-[#114AB1]'
              }`}
            >
              Home
            </Link>
            
            {/* Mega Menu Trigger */}
            <div 
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button className={`flex items-center gap-1 px-6 py-2.5 text-sm font-bold transition-all ${isMegaMenuOpen ? 'text-[#114AB1]' : 'text-gray-700 hover:text-[#114AB1]'}`}>
                Categories <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* THE MEGA DROPDOWN - Fixed Z-Index and Solid Background */}
              <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 z-[1000] ${
                isMegaMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
              }`}>
                <div className="w-[650px] bg-white shadow-[0_25px_70px_rgba(0,0,0,0.15)] rounded-[3rem] border border-gray-100 p-10 grid grid-cols-2 gap-6">
                  {categories.map((cat) => (
                    <Link 
                      key={cat.slug} 
                      href={`/category/${cat.slug}`}
                      className="flex items-start gap-5 p-5 rounded-[2rem] hover:bg-gray-50 group transition-all border border-transparent hover:border-gray-100"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#E4580B] group-hover:bg-[#E4580B] group-hover:text-white transition-colors shrink-0">
                        {cat.icon}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base text-[#114AB1] mb-1">{cat.name}</h4>
                        <p className="text-[11px] text-gray-500 leading-tight font-medium uppercase tracking-wider">{cat.desc}</p>
                      </div>
                    </Link>
                  ))}
                  <div className="col-span-2 mt-4 pt-6 border-t border-gray-50">
                    <Link href="/about" className="flex items-center justify-center gap-3 text-xs font-black text-[#E4580B] uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all group">
                      Our Solo-Sovereignty Philosophy <Zap size={14} className="group-hover:scale-125 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link 
              href="/about" 
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                pathname === '/about' ? 'bg-[#114AB1] text-white shadow-md' : 'text-gray-700 hover:text-[#114AB1]'
              }`}
            >
              About
            </Link>
          </div>

          {/* 3. Global Search */}
          <div className="flex items-center gap-3">
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-md border border-gray-100 text-[#114AB1] hover:bg-[#E4580B] hover:text-white transition-all group">
              <Search size={22} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;