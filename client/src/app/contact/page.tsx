"use client";
import React, { useState } from 'react';
import { Mail, MessageSquare, Send, Globe, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Integration logic would go here (e.g., sending to Django API or Formspree)
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* --- HERO SECTION --- */}
      <section className="relative py-24 px-6 bg-[#0f172a] overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#114AB1]/10 skew-x-12 translate-x-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E4580B]/10 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-[#E4580B] text-sm font-bold mb-8 backdrop-blur-md border border-white/10">
            <Zap size={16} />
            <span>Sovereign Communications</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            Let’s Engineer <br /> 
            <span className="text-[#E4580B] italic font-light text-4xl md:text-6xl">the Future of Solo Living.</span>
          </h1>
          <p className="text-blue-100/70 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Whether you are interested in a strategic partnership, press inquiries, or have a question about our content pillars, our team is ready to respond.
          </p>
        </div>
      </section>

      {/* --- MAIN INTERFACE --- */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Connection Channels (Col 1-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-10">
              <div>
                <h3 className="text-sm font-black text-[#6793AC] uppercase tracking-[0.2em] mb-6">Support Channels</h3>
                <div className="space-y-8">
                  <div className="flex gap-5 items-start">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#114AB1] shrink-0">
                      <Mail size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-[#114AB1]">General Inquiries</p>
                      <p className="text-sm text-gray-500">hello@sololife.doctoolsai.com</p>
                    </div>
                  </div>

                  <div className="flex gap-5 items-start">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#E4580B] shrink-0">
                      <Globe size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-[#114AB1]">Partnerships & Media</p>
                      <p className="text-sm text-gray-500">partners@sololife.doctoolsai.com</p>
                    </div>
                  </div>

                  <div className="flex gap-5 items-start">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
                      <MessageSquare size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-[#114AB1]">Community Forum</p>
                      <p className="text-sm text-gray-500">Join our Discord community</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-gray-100">
                <h4 className="font-bold text-[#114AB1] mb-4">Response Protocol</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We prioritize inquiries from our verified readers and potential partners. Expect a high-signal response within 24–48 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: The Contact Form (Col 6-12) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-10 md:p-16 rounded-[4rem] border border-gray-100 shadow-2xl">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-[#6793AC] uppercase tracking-widest px-2">Full Name</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="John Doe"
                        className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#114AB1]/10 focus:bg-white transition-all outline-none text-[#114AB1] font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-[#6793AC] uppercase tracking-widest px-2">Email Address</label>
                      <input 
                        required 
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#114AB1]/10 focus:bg-white transition-all outline-none text-[#114AB1] font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#6793AC] uppercase tracking-widest px-2">Area of Interest</label>
                    <select className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#114AB1]/10 focus:bg-white transition-all outline-none text-[#114AB1] font-bold appearance-none">
                      <option>General Question</option>
                      <option>Partnership Proposal</option>
                      <option>Content Suggestion</option>
                      <option>Technical Issue</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#6793AC] uppercase tracking-widest px-2">Message</label>
                    <textarea 
                      required 
                      rows={6}
                      placeholder="How can we help you master the solo life?"
                      className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#114AB1]/10 focus:bg-white transition-all outline-none text-[#114AB1] font-bold resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#114AB1] text-white py-6 rounded-[2rem] font-black text-xl hover:bg-[#E4580B] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 group"
                  >
                    Send Message 
                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              ) : (
                <div className="py-20 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-4xl font-black text-[#114AB1]">Message Intercepted.</h2>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Your transmission has been received. Our team will analyze and respond shortly. Stay sovereign.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-[#E4580B] font-bold border-b-2 border-[#E4580B] pb-1 hover:text-[#114AB1] hover:border-[#114AB1] transition-all"
                  >
                    Send another message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- QUICK HELP TEASER --- */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-black text-[#114AB1] mb-8">Looking for instant answers?</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/about" className="px-6 py-3 bg-gray-50 rounded-xl text-sm font-bold text-[#6793AC] hover:bg-[#114AB1] hover:text-white transition-all">About Our Philosophy</Link>
          <Link href="/privacy" className="px-6 py-3 bg-gray-50 rounded-xl text-sm font-bold text-[#6793AC] hover:bg-[#114AB1] hover:text-white transition-all">Privacy Protocols</Link>
          <Link href="/terms" className="px-6 py-3 bg-gray-50 rounded-xl text-sm font-bold text-[#6793AC] hover:bg-[#114AB1] hover:text-white transition-all">Terms of Usage</Link>
        </div>
      </section>
    </main>
  );
};

import Link from 'next/link';
export default ContactPage;