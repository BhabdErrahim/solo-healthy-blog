"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, User, Leaf, Plane, Home, Dumbbell, Utensils, Info } from 'lucide-react';

const Navbar = () => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const categories = [
    { name: 'Healthy Habits', slug: 'healthy', icon: <Leaf className="w-5 h-5" />, desc: 'Nutrition and mental wellness.' },
    { name: 'Solo Traveling', slug: 'traveling', icon: <Plane className="w-5 h-5" />, desc: 'Explore the world on your own.' },
    { name: 'Solo Living', slug: 'solo-living', icon: <Home className="w-5 h-5" />, desc: 'Mastering your personal space.' },
    { name: 'Sport & Fitness', slug: 'sport', icon: <Dumbbell className="w-5 h-5" />, desc: 'Stay active and energized.' },
    { name: 'Food Recipes', slug: 'food-recipes', icon: <Utensils className="w-5 h-5" />, desc: 'Delicious meals for one.' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          {/* 1. Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-orange rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
            <span className="text-2xl font-bold text-brand-deep tracking-tight">SOLO<span className="text-brand-muted font-light">LIFE</span></span>
          </Link>

          {/* 2. Main Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-brand-deep font-medium hover:text-brand-orange transition">Home</Link>
            
            {/* Mega Menu Trigger */}
            <div 
              className="relative group h-20 flex items-center"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button className="flex items-center gap-1 text-brand-deep font-medium group-hover:text-brand-orange transition">
                Explore Categories <ChevronDown className={`w-4 h-4 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* THE MEGA DROPDOWN PANEL */}
              {isMegaMenuOpen && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] bg-white shadow-2xl rounded-b-2xl border-t-4 border-brand-orange p-8 grid grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                  
                  {/* Left Side: Categories List */}
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    {categories.map((cat) => (
                      <Link 
                        key={cat.slug} 
                        href={`/category/${cat.slug}`}
                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100"
                      >
                        <div className="text-brand-orange bg-orange-50 p-2 rounded-lg">
                          {cat.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-deep">{cat.name}</h4>
                          <p className="text-xs text-brand-muted mt-1">{cat.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Right Side: Featured/About Card */}
                  <div className="bg-brand-deep rounded-xl p-6 text-white flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-lg mb-2">New to Solo Living?</h4>
                      <p className="text-sm text-blue-100">Check out our starter guide for living healthy and happy on your own.</p>
                    </div>
                    <Link href="/about" className="mt-4 inline-block bg-brand-orange text-center py-2 rounded-lg font-bold hover:bg-white hover:text-brand-orange transition">
                      Start Here
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/about" className="text-brand-deep font-medium hover:text-brand-orange transition">About Us</Link>
          </div>

          {/* 3. Utility Buttons */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-brand-deep hover:bg-gray-100 rounded-full transition">
              <Search className="w-5 h-5" />
            </button>
            <button className="hidden sm:flex items-center gap-2 bg-brand-deep text-white px-5 py-2.5 rounded-full font-semibold hover:bg-opacity-90 transition">
              <User className="w-4 h-4" />
              Sign In
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;