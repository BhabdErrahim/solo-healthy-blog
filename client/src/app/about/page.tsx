"use client";
import React from 'react';
import { Sparkles, Target, ShieldCheck, Zap, Globe, Heart } from 'lucide-react';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* --- HERO SECTION --- */}
      <section className="relative py-24 px-6 bg-brand-deep overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/20 blur-[120px] rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-brand-orange text-sm font-bold mb-8 backdrop-blur-md">
            <Sparkles size={16} />
            <span>The Solo-Living Revolution</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-10">
            Independence, <br />
            <span className="text-brand-orange font-light italic">Refined.</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl leading-relaxed font-light">
            We believe that living alone is not a temporary state of being—it is a 
            <strong> permanent superpower</strong>. SoloLife was built to help you master it.
          </p>
        </div>
      </section>

      {/* --- OUR MISSION (THE "WHY") --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-black text-brand-deep mb-8">
              Why <span className="text-brand-orange">SoloLife</span>?
            </h2>
            <div className="space-y-6 text-lg text-brand-muted leading-relaxed">
                <p>
                  In a world obsessed with constant collaboration and "always-on" connectivity, the art of solitude is being lost. Most lifestyle platforms treat solo living as a transition—a waiting room for something else.
                </p>
                <p>
                  <strong>We see it differently.</strong> Whether you are a solo professional, a digital nomad, or someone reclaiming their space, living alone is an opportunity for radical self-governance and peak performance.
                </p>
                <p>
                  SoloLife is the first <strong>Lifestyle Operating System</strong> designed specifically for the independent resident. We combine neuroscience, ergonomic engineering, and culinary logistics to ensure your solo journey is extraordinary.
                </p>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl rotate-2">
                <img 
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200" 
                  alt="Modern solo sanctuary" 
                  className="w-full h-[500px] object-cover"
                />
            </div>
            {/* Floating Stats Card */}
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 hidden md:block">
                <p className="text-brand-orange font-black text-4xl mb-1">50k+</p>
                <p className="text-brand-deep font-bold uppercase tracking-tighter text-sm">Monthly Readers</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- THE 5 PILLARS --- */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-4xl font-black text-brand-deep mb-4">Our Core Pillars</h2>
          <p className="text-brand-muted text-xl">Every piece of content we publish follows these five foundations.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Healthy Habits", icon: <Heart className="text-emerald-500" />, desc: "Neuroscience-backed rituals for mental and physical peak performance." },
            { title: "Solo Traveling", icon: <Globe className="text-blue-500" />, desc: "Tactical logistics and safety protocols for global exploration." },
            { title: "Solo Living", icon: <ShieldCheck className="text-brand-orange" />, desc: "Home engineering and financial mastery for the single-person household." },
            { title: "Sport & Fitness", icon: <Zap className="text-yellow-500" />, desc: "Autonomous motivation systems for the independent athlete." },
            { title: "Gourmet for One", icon: <Target className="text-red-500" />, desc: "Zero-waste culinary engineering designed for the solo table." },
          ].map((pillar, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                {pillar.icon}
              </div>
              <h3 className="text-2xl font-bold text-brand-deep mb-4">{pillar.title}</h3>
              <p className="text-brand-muted leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-brand-deep p-16 md:p-24 rounded-[4rem] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-brand-orange/5" />
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10">
            Start Your <br /><span className="text-brand-orange">Sovereign</span> Life.
          </h2>
          <p className="text-xl text-blue-100 mb-12 relative z-10 opacity-80">
            Join thousands of independent professionals mastering the art of solitude.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center relative z-10">
            <Link href="/" className="bg-brand-orange text-white px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition shadow-lg shadow-orange-900/20">
                Explore The Blog
            </Link>
            <Link href="#" className="bg-white/10 text-white border border-white/20 backdrop-blur-md px-10 py-5 rounded-2xl font-black text-xl hover:bg-white/20 transition">
                Join Newsletter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;