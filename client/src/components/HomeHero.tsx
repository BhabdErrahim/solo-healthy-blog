"use client";
import React from 'react';
import { Search, ArrowRight, Sparkles, Heart, Plane, Home, Dumbbell, Utensils } from 'lucide-react';

const HomeHero = () => {
  return (
    <main className="relative min-h-[90vh] flex items-center pt-20 pb-16 overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-deep/5 rounded-l-[100px] -z-10 translate-x-20 hidden lg:block" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl -z-10 animate-pulse" />

      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-brand-orange text-sm font-bold mb-6 animate-bounce">
            <Sparkles size={16} />
            <span>The #1 Solo-Living Platform</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-brand-deep leading-[0.9] mb-8">
            Independent. <br />
            <span className="text-brand-orange">Never</span> Alone.
          </h1>
          
          <p className="text-xl text-brand-muted max-w-lg mb-10 leading-relaxed">
            Master the art of living solo. From nutrition and sport to global adventures, 
            we build the habits that make your independent life extraordinary.
          </p>

          {/* Search Bar - Modern Design */}
          <div className="relative max-w-md group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="text-brand-muted group-focus-within:text-brand-orange transition-colors" size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search recipes, travel tips, workouts..."
              className="w-full pl-14 pr-32 py-5 bg-white border-2 border-gray-100 rounded-3xl shadow-xl focus:border-brand-orange focus:ring-0 transition-all outline-none text-brand-deep"
            />
            <button className="absolute right-3 top-3 bottom-3 bg-brand-deep text-white px-6 rounded-2xl font-bold hover:bg-brand-orange transition-all flex items-center gap-2">
              Find <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Side: The "Extra Feeling" Image Stack */}
        <div className="relative h-[600px] flex items-center justify-center">
          
          {/* Main Large Image (Solo Living/Home) */}
          <div className="relative w-72 h-[450px] rounded-[4rem] overflow-hidden shadow-2xl z-20 border-8 border-white -rotate-6">
            <img 
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover" 
              alt="Solo Living"
            />
          </div>

          {/* Secondary Image (Traveling) */}
          <div className="absolute top-10 right-10 w-64 h-80 rounded-[3rem] overflow-hidden shadow-2xl z-10 border-8 border-white rotate-12">
            <img 
              src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover" 
              alt="Solo Travel"
            />
          </div>

          {/* Floating Category Pills - Animated */}
          <div className="absolute top-20 left-0 bg-white shadow-xl p-4 rounded-2xl flex items-center gap-3 z-30 animate-float-slow">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><Heart size={20} /></div>
            <div>
              <p className="text-[10px] uppercase font-black text-gray-400">Healthy</p>
              <p className="text-sm font-bold text-brand-deep">Daily Mindset</p>
            </div>
          </div>

          <div className="absolute bottom-20 right-0 bg-white shadow-xl p-4 rounded-2xl flex items-center gap-3 z-30 animate-float-fast">
            <div className="bg-orange-100 p-2 rounded-lg text-brand-orange"><Utensils size={20} /></div>
            <div>
              <p className="text-[10px] uppercase font-black text-gray-400">Recipes</p>
              <p className="text-sm font-bold text-brand-deep">Dinner for One</p>
            </div>
          </div>

          <div className="absolute bottom-0 left-1/4 bg-brand-deep shadow-xl p-4 rounded-2xl flex items-center gap-3 z-30 text-white">
            <div className="bg-white/20 p-2 rounded-lg"><Dumbbell size={20} /></div>
            <p className="text-sm font-bold">New Sport Guide Out</p>
          </div>
        </div>
      </section> {/* Added the missing closing section tag here */}
    </main>
  );
};

export default HomeHero;