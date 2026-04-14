"use client";
import React from 'react';
import Link from 'next/link';
// We use generic icons: Globe, Mail, MessageCircle, Share instead of Brands
import { Globe, Mail, MessageCircle, Share2, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-12 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 md:p-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-brand-orange rounded flex items-center justify-center text-white font-bold">S</div>
              <span className="text-xl font-bold text-brand-deep">SOLOLIFE</span>
            </Link>
            <p className="text-brand-muted text-sm leading-relaxed max-w-sm mb-8">
              Empowering individuals to master the art of solo living through healthy habits, 
              mindful travel, and curated recipes for one.
            </p>
            
            {/* UPDATED: Using Safe Icons */}
            <div className="flex gap-4">
              {[Globe, Mail, MessageCircle, Share2].map((Icon, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-brand-deep hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-brand-deep mb-6">Explore</h4>
              <ul className="space-y-4 text-sm text-brand-muted">
                <li><Link href="/category/healthy" className="hover:text-brand-orange transition">Healthy Habits</Link></li>
                <li><Link href="/category/traveling" className="hover:text-brand-orange transition">Solo Travel</Link></li>
                <li><Link href="/category/sport" className="hover:text-brand-orange transition">Fitness</Link></li>
                <li><Link href="/category/food-recipes" className="hover:text-brand-orange transition">Recipes for One</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-brand-deep mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-brand-muted">
                <li><Link href="/about" className="hover:text-brand-orange transition">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-brand-orange transition">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-brand-orange transition">Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-gray-100 w-full my-12" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-brand-muted">
          <p>© 2026 SoloLife Platform.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-brand-orange transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-orange transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;