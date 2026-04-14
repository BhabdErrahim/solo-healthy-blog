"use client";
import React from 'react';
import { Scale, FileCheck, AlertTriangle, Copyright, UserX, MessageSquare, LifeBuoy, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const TermsOfService = () => {
  const lastUpdated = "April 13, 2026";

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* --- HERO SECTION --- */}
      <header className="bg-brand-deep py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-brand-orange/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-brand-orange text-sm font-bold mb-8 backdrop-blur-md">
            <Scale size={16} />
            <span>Legal Framework & Usage Rights</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            Terms of <span className="text-brand-orange">Service</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl font-light max-w-2xl mx-auto opacity-80">
            Please read these terms carefully. By using SoloLife, you are agreeing to the rules of our independent community.
          </p>
        </div>
      </header>

      {/* --- CONTENT LAYOUT --- */}
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 mt-20">
        
        {/* Left Side: Summary / TL;DR (Magazine Style) */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="sticky top-28 bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
            <h3 className="text-xl font-black text-brand-deep mb-4 uppercase tracking-tighter">The Short Version</h3>
            <p className="text-sm text-brand-muted mb-6 leading-relaxed">
              We know legal text is heavy. Here is the gist of what you are agreeing to:
            </p>
            <ul className="space-y-4">
              {[
                { icon: <Copyright size={16}/>, text: "Our content is ours. Don't steal it." },
                { icon: <AlertTriangle size={16}/>, text: "We provide advice, not medical prescriptions." },
                { icon: <UserX size={16}/>, text: "Be respectful or we'll have to restrict access." },
                { icon: <LifeBuoy size={16}/>, text: "You are responsible for your own solo safety." }
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-start text-sm font-bold text-brand-deep">
                  <span className="text-brand-orange mt-0.5">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Right Side: Full Legal Content */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-3xl font-black text-brand-deep mb-6 flex items-center gap-3">
              <span className="text-brand-orange">01.</span> Acceptance of Terms
            </h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed">
              <p>
                By accessing or using the SoloLife platform, you confirm that you can form a binding 
                contract with SoloLife, that you accept these Terms, and that you agree to comply with them. 
                Your access to our service is also subject to our <Link href="/privacy" className="text-brand-deep font-bold border-b-2 border-brand-orange">Privacy Policy</Link>.
              </p>
            </div>
          </section>

          {/* Section 2: THE CRITICAL DISCLAIMER */}
          <section className="bg-orange-50 p-10 rounded-[3rem] border border-orange-100">
            <h2 className="text-3xl font-black text-brand-orange mb-6 flex items-center gap-3">
              <AlertTriangle size={28} /> Professional Disclaimer
            </h2>
            <div className="space-y-4 text-orange-900/80 leading-relaxed font-medium">
              <p>
                <strong>SoloLife is an informational platform.</strong> Our content across Healthy Habits, 
                Sport, and Food is for educational purposes only.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>We are not doctors, nutritionists, or certified financial advisors.</li>
                <li>Before implementing any "Solo Safety Audit" protocols or "Longevity Habits," consult with a professional.</li>
                <li>You assume 100% responsibility for any actions taken based on our "One-Bag Travel" or "Home Engineering" guides.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-3xl font-black text-brand-deep mb-6 flex items-center gap-3">
              <span className="text-brand-orange">02.</span> Intellectual Property Rights
            </h2>
            <p className="text-gray-600 leading-relaxed">
              SoloLife and its original content, features, and functionality are and will remain the 
              exclusive property of SoloLife. Our "Spiderweb" internal linking structures, custom articles, 
              and design components are protected by copyright, trademark, and other laws. 
              <strong> You may not reproduce, distribute, or create derivative works </strong> 
              without express written permission.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-3xl font-black text-brand-deep mb-6 flex items-center gap-3">
              <span className="text-brand-orange">03.</span> User-Generated Content
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you comment on our articles or participate in our forums, you grant SoloLife a 
              perpetual, worldwide, royalty-free license to use that content. We reserve the right 
              to remove any content that we deem harmful, hateful, or disruptive to our solo community.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-3xl font-black text-brand-deep mb-6 flex items-center gap-3">
              <span className="text-brand-orange">04.</span> Limitation of Liability
            </h2>
            <div className="bg-gray-900 text-white p-8 rounded-3xl font-mono text-sm leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SOLOLIFE SHALL NOT BE LIABLE FOR ANY 
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS 
              OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, 
              OR OTHER INTANGIBLE LOSSES.
            </div>
          </section>

          {/* Section 6 */}
          <section className="pt-10 border-t border-gray-100">
            <h2 className="text-3xl font-black text-brand-deep mb-6 flex items-center gap-3">
              <span className="text-brand-orange">05.</span> Changes to Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will try to provide at least 30 days' notice prior to 
              any new terms taking effect.
            </p>
          </section>

          {/* Final Contact Footer */}
          <div className="mt-16 p-12 bg-brand-deep rounded-[3rem] text-center text-white shadow-xl shadow-blue-900/20">
            <MessageSquare className="mx-auto text-brand-orange mb-6" size={48} />
            <h3 className="text-2xl font-black mb-4">Have questions about these terms?</h3>
            <p className="text-blue-100 mb-8 opacity-80">Our legal and community team is here to clarify.</p>
            <Link href="mailto:legal@sololife.com" className="inline-flex items-center gap-2 bg-brand-orange text-white px-10 py-4 rounded-2xl font-black hover:bg-white hover:text-brand-orange transition-all">
              Email Legal Team <ArrowRight size={18} />
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
};

export default TermsOfService;