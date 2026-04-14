"use client";
import React from 'react';
import { ShieldCheck, Eye, Lock, Database, Globe, Mail, FileText } from 'lucide-react';
import Link from 'next/link';

const PrivacyPolicy = () => {
  const lastUpdated = "April 13, 2026";

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* --- SIMPLE HERO SECTION --- */}
      <header className="bg-gray-50 border-b border-gray-100 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-brand-deep text-sm font-bold mb-6">
            <Lock size={16} />
            <span>Data Sovereignty & Protection</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-brand-deep mb-6">
            Privacy <span className="text-brand-orange">Policy</span>
          </h1>
          <p className="text-lg text-brand-muted font-medium">
            Last Updated: {lastUpdated} • Version 2.0
          </p>
        </div>
      </header>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-4xl mx-auto px-6 mt-20">
        
        {/* Introduction Paragraph */}
        <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed mb-16">
          <p>
            At <strong>SoloLife</strong>, we believe that privacy is a fundamental component of independence. 
            Your data sovereignty is as important as your physical sovereignty. This policy outlines 
            how we collect, use, and protect your information when you interact with our platform. 
            We aim for absolute transparency, ensuring you remain the CEO of your own digital footprint.
          </p>
        </div>

        {/* Policy Grid/Sections */}
        <div className="space-y-16">
          
          {/* Section 1: Data Collection */}
          <section className="relative pl-12 border-l-2 border-gray-100">
            <div className="absolute -left-[17px] top-0 bg-white p-1">
                <div className="w-8 h-8 bg-brand-deep rounded-lg flex items-center justify-center text-white">
                    <Database size={18} />
                </div>
            </div>
            <h2 className="text-2xl font-black text-brand-deep mb-6 uppercase tracking-tight">1. Information We Collect</h2>
            <div className="space-y-4 text-gray-600">
              <p>We collect information to provide a better, more personalized experience for our solo community. This includes:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Personal Data:</strong> Email addresses and names provided during newsletter signups or account creation.</li>
                <li><strong>Usage Data:</strong> IP addresses, browser types, and device information collected via automated logs.</li>
                <li><strong>Engagement Data:</strong> Which articles you read and how long you spend on specific "Pillars" to help us improve our content algorithm.</li>
              </ul>
            </div>
          </section>

          {/* Section 2: Use of Data */}
          <section className="relative pl-12 border-l-2 border-gray-100">
            <div className="absolute -left-[17px] top-0 bg-white p-1">
                <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center text-white">
                    <Eye size={18} />
                </div>
            </div>
            <h2 className="text-2xl font-black text-brand-deep mb-6 uppercase tracking-tight">2. How We Use Your Data</h2>
            <p className="text-gray-600 mb-4">SoloLife uses the collected data for the following purposes:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-brand-deep mb-2">Personalization</h4>
                    <p className="text-sm">To tailor the homepage "Discovery Grid" to your interests (e.g., more Sport, less Travel).</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-brand-deep mb-2">Communication</h4>
                    <p className="text-sm">To send "The Solo Edit" weekly newsletter and important platform updates.</p>
                </div>
            </div>
          </section>

          {/* Section 3: The Fortress (Security) */}
          <section className="bg-brand-deep p-10 md:p-16 rounded-[3rem] text-white">
            <div className="flex items-center gap-4 mb-8">
                {/* Change this line here: */}
                <ShieldCheck size={32} className="text-brand-orange" />
                <h2 className="text-3xl font-black">The Security Fortress</h2>
            </div>
            <p className="text-blue-100 text-lg leading-relaxed mb-8">
                We employ <strong>AES-256 Encryption</strong> and secure socket layer (SSL) technology to protect your 
                data. Our backend (Django) is audited regularly for vulnerabilities. While no method of 
                transmission over the internet is 100% secure, we treat your information with the same 
                rigorous standards we recommend in our <em>Solo Safety Audit</em>.
            </p>
            <div className="inline-block px-6 py-3 bg-white/10 rounded-xl border border-white/20 text-sm font-mono">
                Security Protocol: SEC-LEVEL-ALPHA-2026
            </div>
          </section>

          {/* Section 4: Cookies */}
          <section className="relative pl-12 border-l-2 border-gray-100">
            <div className="absolute -left-[17px] top-0 bg-white p-1">
                <div className="w-8 h-8 bg-brand-muted rounded-lg flex items-center justify-center text-white">
                    <Globe size={18} />
                </div>
            </div>
            <h2 className="text-2xl font-black text-brand-deep mb-6 uppercase tracking-tight">4. Cookie Policy</h2>
            <p className="text-gray-600">
                We use cookies to track your preferences and session state. You can instruct your 
                browser to refuse all cookies or to indicate when a cookie is being sent. However, 
                if you do not accept cookies, you may not be able to use some portions of our platform, 
                such as personalized reading lists.
            </p>
          </section>

          {/* Section 5: Your Rights */}
          <section className="relative pl-12 border-l-2 border-gray-100">
            <div className="absolute -left-[17px] top-0 bg-white p-1">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                    <FileText size={18} />
                </div>
            </div>
            <h2 className="text-2xl font-black text-brand-deep mb-6 uppercase tracking-tight">5. Your Rights (GDPR & CCPA)</h2>
            <p className="text-gray-600 mb-6">
                Regardless of where you live, SoloLife grants all users the right to:
            </p>
            <div className="space-y-3">
                {['The right to access your data.', 'The right to rectification.', 'The right to erasure ("Right to be Forgotten").', 'The right to data portability.'].map((right, i) => (
                    <div key={i} className="flex gap-3 items-center text-brand-deep font-bold text-sm">
                        <div className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                        {right}
                    </div>
                ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="pt-16 border-t border-gray-100 text-center">
            <h3 className="text-2xl font-black text-brand-deep mb-4">Questions about your privacy?</h3>
            <p className="text-brand-muted mb-8">Our Data Protection Officer is ready to assist you.</p>
            <a href="mailto:privacy@sololife.com" className="inline-flex items-center gap-2 bg-brand-orange text-white px-10 py-4 rounded-2xl font-black hover:scale-105 transition shadow-lg shadow-orange-200">
                <Mail size={18} />
                Contact Privacy Team
            </a>
          </section>

        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;