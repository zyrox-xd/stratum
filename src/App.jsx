import React, { useState } from 'react';
import { Menu, X, Activity, Zap, CheckCircle2, XCircle, FileText, Send, Loader2, Lock, Scale, Clock } from 'lucide-react';
// Import the Dashboard
import Admin from './Dashboard.jsx';
// Import your new Logo
import logo from './assets/logo.png'; 

const Gummyte = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // State for forms
  const [emailInput, setEmailInput] = useState('');
  const [notifyStatus, setNotifyStatus] = useState('idle'); 
  
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState('idle');

  // API Base URL
  const API_URL = 'https://stratum-backend-8hhn.onrender.com/api';

  const navigate = (section) => {
    setActiveSection(section);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleNotifySubmit = async (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setNotifyStatus('loading');
    try {
      const response = await fetch(`${API_URL}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput })
      });
      if (!response.ok) throw new Error('Network response was not ok');
      setNotifyStatus('success');
      setEmailInput('');
    } catch (error) {
      console.error(error);
      setNotifyStatus('error');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.email || !contactForm.message) return;
    setContactStatus('loading');
    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (!response.ok) throw new Error('Network response was not ok');
      setContactStatus('success');
      setContactForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
      setContactStatus('error');
    }
  };

  if (activeSection === 'admin') {
    return <Admin apiUrl={API_URL} onBack={() => navigate('home')} />;
  }

  // Data Content
  const faqs = [
    { question: "Is creatine safe?", answer: "Yes. Creatine is one of the most researched sports supplements in history. Extensive studies confirm its safety profile for long-term use in healthy individuals." },
    { question: "Is this product vegetarian?", answer: "Yes. Our gummies use synthesized Creatine Monohydrate, making them 100% vegetarian and suitable for plant-based diets." },
    { question: "Will it make me bulky?", answer: "Creatine draws water into muscle cells (intracellular), not under the skin (subcutaneous). This hydration supports performance, not fat gain." },
    { question: "Do I need to 'load' it?", answer: "No. Taking a standard daily dose consistently will saturate your muscles effectively over 3-4 weeks without gastric distress." },
    { question: "Who is this not for?", answer: "If you have pre-existing kidney conditions, consult a doctor first. Not recommended for children or pregnant women without medical advice." }
  ];

  const statusItems = [
    { label: "Formula Validation", status: "complete", date: "Q3 2024" },
    { label: "Flavor Profile Optimization", status: "complete", date: "Q4 2024" },
    { label: "Microbial Safety Testing", status: "complete", date: "Jan 2025" },
    { label: "Accelerated Stability Testing", status: "active", date: "In Progress" },
    { label: "FSSAI Compliance Review", status: "pending", date: "Pending" },
    { label: "Commercial Production", status: "pending", date: "TBD" }
  ];

  return (
    // Updated Selection Color to match Logo Blue (Sky-500)
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans selection:bg-sky-900 selection:text-white">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo Section */}
          <button onClick={() => navigate('home')} className="hover:opacity-80 transition-opacity flex items-center gap-3">
            {/* Logo Image */}
            <img src={logo} alt="Gummyte" className="h-8 md:h-10 object-contain" />
            
            {/* Text is hidden on mobile if your logo already has text, otherwise keep it */}
            <span className="text-white font-bold tracking-widest uppercase text-lg hidden sm:block">Gummyte</span>
          </button>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide text-neutral-500">
            {['Rationale', 'Science', 'Approach', 'Status', 'FAQ'].map((item) => (
              <button 
                key={item}
                onClick={() => navigate(item.toLowerCase())}
                className={`hover:text-white transition-colors uppercase text-xs ${activeSection === item.toLowerCase() ? 'text-white' : ''}`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-neutral-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-neutral-950 border-b border-neutral-900 absolute w-full px-6 py-6 flex flex-col gap-6 animate-fade-in">
            {['Rationale', 'Science', 'Approach', 'Status', 'FAQ'].map((item) => (
              <button 
                key={item}
                onClick={() => navigate(item.toLowerCase())}
                className="text-left text-sm font-medium text-neutral-400 hover:text-white uppercase tracking-wider"
              >
                {item}
              </button>
            ))}
            <div className="h-px bg-neutral-900 w-full my-2"></div>
            <button onClick={() => navigate('contact')} className="text-left text-sm font-medium text-neutral-500 uppercase tracking-wider">Contact</button>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="pt-24 pb-20 px-6 max-w-2xl mx-auto min-h-screen flex flex-col justify-center">
        
        {/* VIEW: HOME */}
        {activeSection === 'home' && (
          <div className="animate-fade-in space-y-16">
            
            {/* HERO SECTION */}
            <header className="space-y-8 relative">
              {/* BRAND ELEMENT: Floating "Active Core" Cube Animation */}
              {/* This mimics the blue square in your logo */}
              <div className="absolute -top-10 -right-10 md:-right-20 opacity-40 pointer-events-none">
                 <div className="relative w-32 h-32 md:w-48 md:h-48">
                    {/* Outer Glow */}
                    <div className="absolute inset-0 bg-sky-500/20 blur-3xl rounded-full animate-pulse"></div>
                    {/* The Cube */}
                    <div className="absolute inset-4 border border-sky-500/30 bg-sky-900/10 backdrop-blur-sm transform rotate-12 rounded-xl"></div>
                    <div className="absolute inset-8 bg-sky-500/20 rounded-lg transform -rotate-6"></div>
                 </div>
              </div>
              
              <div className="space-y-6 relative z-10">
                <span className="text-sky-400 text-xs font-bold tracking-[0.2em] uppercase bg-sky-950/30 px-3 py-1 rounded border border-sky-900/50">
                  Phase One: Education
                </span>
                <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-tight leading-tight">
                  Consistency <br/> defines progress. <br />
                  <span className="text-neutral-600">Everything else is noise.</span>
                </h1>
                <p className="text-lg text-neutral-400 leading-relaxed max-w-lg border-l-2 border-neutral-800 pl-4">
                  The Gummyte Standard. 5g Pure Creatine Monohydrate. <br/>
                  Built for the daily routine, not the highlight reel.
                </p>
              </div>
            </header>

            {/* INFO CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-900 pt-8">
              <div className="p-6 bg-neutral-900/40 backdrop-blur-sm rounded-sm border border-neutral-900 hover:border-sky-900/50 transition-colors group">
                <h3 className="text-white font-medium mb-2 group-hover:text-sky-400 transition-colors">What is this?</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  A simplified creatine delivery system. 5g effective serving in a convenient chew. Zero preparation required.
                </p>
              </div>
              <div className="p-6 bg-neutral-900/40 backdrop-blur-sm rounded-sm border border-neutral-900 hover:border-sky-900/50 transition-colors group">
                <h3 className="text-white font-medium mb-2 group-hover:text-sky-400 transition-colors">Current Status</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  We are in the Stability Testing phase. We do not rush formulation for the sake of a launch date.
                </p>
                <button onClick={() => navigate('status')} className="mt-4 text-xs font-bold text-sky-500 hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1">
                  View Timeline <span className="text-lg">→</span>
                </button>
              </div>
            </div>

            <div className="flex gap-6 pt-4">
              <button onClick={() => navigate('rationale')} className="text-sm font-bold text-white border-b border-white pb-1 hover:text-sky-400 hover:border-sky-400 transition-colors">
                Understand the Logic
              </button>
              <button onClick={() => navigate('approach')} className="text-sm font-bold text-neutral-500 border-b border-transparent pb-1 hover:text-white transition-colors">
                Read our Approach
              </button>
            </div>
          </div>
        )}

        {/* VIEW: RATIONALE */}
        {activeSection === 'rationale' && (
          <div className="animate-fade-in space-y-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Friction destroys habits.</h2>
              <p className="text-neutral-400 leading-relaxed">
                Powder is effective, but inconvenient. The ritual of measuring, mixing, and shaking creates micro-friction. On busy days, that friction leads to missed doses.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="flex gap-4 items-start p-4 border border-neutral-900/50 rounded-lg">
                <div className="mt-1 text-sky-500"><Activity size={20} /></div>
                <div>
                  <h3 className="text-white font-medium">The Consistency Problem</h3>
                  <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                    Creatine works by saturation. It requires daily intake to maintain muscle stores. Missing days breaks the saturation curve.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start p-4 border border-neutral-900/50 rounded-lg">
                <div className="mt-1 text-sky-500"><Zap size={20} /></div>
                <div>
                  <h3 className="text-white font-medium">The Practical Solution</h3>
                  <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                    A gummy is a closed system. No water needed. No residue. It turns a "supplement routine" into a seamless action.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-sky-950/20 p-6 border-l-2 border-sky-500">
              <p className="text-sm text-sky-100/80 italic">
                "We aren't claiming gummies are chemically superior to powder. We are claiming they are behaviorally superior for consistency."
              </p>
            </div>
          </div>
        )}

        {/* VIEW: SCIENCE */}
        {activeSection === 'science' && (
          <div className="animate-fade-in space-y-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">How it works.</h2>
              <p className="text-neutral-400">No magic. Just biology.</p>
            </div>

            <div className="space-y-8 relative">
              {/* Connecting Line */}
              <div className="absolute left-[11px] top-4 bottom-4 w-px bg-neutral-900"></div>

              <div className="group relative pl-8">
                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-neutral-950 border border-neutral-800 text-[10px] flex items-center justify-center text-neutral-500 font-mono">1</div>
                <span className="text-xs font-mono text-sky-500 block mb-1">FUEL</span>
                <h3 className="text-lg text-white mb-2">ATP Depletion</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Your muscles use ATP for explosive energy. During lifting or sprinting, ATP stores deplete in seconds.
                </p>
              </div>

              <div className="group relative pl-8">
                 <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-neutral-950 border border-neutral-800 text-[10px] flex items-center justify-center text-neutral-500 font-mono">2</div>
                <span className="text-xs font-mono text-sky-500 block mb-1">RESTORE</span>
                <h3 className="text-lg text-white mb-2">The Phosphocreatine Bridge</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Supplemental creatine increases phosphocreatine stores, donating a phosphate molecule to ADP, turning it back into ATP.
                </p>
              </div>

              <div className="group relative pl-8">
                 <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-neutral-950 border border-neutral-800 text-[10px] flex items-center justify-center text-neutral-500 font-mono">3</div>
                <span className="text-xs font-mono text-sky-500 block mb-1">RESULT</span>
                <h3 className="text-lg text-white mb-2">Capacity & Output</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  More recycled energy means you can perform that one extra rep or sprint for a few seconds longer.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: APPROACH */}
        {activeSection === 'approach' && (
          <div className="animate-fade-in space-y-16">
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-sky-400 text-xs font-bold tracking-[0.2em] uppercase">Operating Manual</span>
                <h2 className="text-2xl font-semibold text-white">Our Approach.</h2>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                We view Gummyte as a system. Our decisions are governed by a strict set of principles designed to protect long-term trust.
              </p>
              
              <div className="grid gap-8 border-l border-neutral-900 pl-6">
                <div>
                  <h3 className="text-white font-medium">1. Education Before Sales</h3>
                  <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                    We will never sell you a product you do not understand. Informed consistency lasts longer than impulse buying.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-medium">2. Behavioral Friction &gt; Chemical Optimization</h3>
                  <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                    The "perfect" supplement is useless if it sits in your cupboard. We optimize for the path of least resistance.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900/30 p-8 border border-neutral-900 space-y-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <FileText size={18} className="text-neutral-400" />
                <h3 className="text-white font-medium text-lg">Decision Logic</h3>
              </div>
              <ul className="space-y-3 text-sm text-neutral-500 font-mono">
                {['Does this increase daily consistency?', 'Is the science unequivocal?', 'Can we transparently source every ingredient?', 'Is the shelf-stability proven?'].map((item, i) => (
                   <li key={i} className="flex gap-3">
                    <span className="text-sky-500">→</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Anti-List */}
            <div className="space-y-6">
              <h3 className="text-white font-medium border-b border-neutral-900 pb-2">The Anti-List</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "No Fake Urgency", desc: "No countdown timers or low stock warnings." },
                  { title: "No Proprietary Blends", desc: "You will know exactly how many milligrams you ingest." },
                  { title: "No Transformation Photos", desc: "Supplements support work; they do not replace it." },
                  { title: "No Rushed Launches", desc: "We delay launch until stability testing is confirmed." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start p-4 bg-neutral-950 border border-neutral-900 rounded">
                    <XCircle size={16} className="text-red-900 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-neutral-300 text-sm font-medium block">{item.title}</span>
                      <p className="text-xs text-neutral-600 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: STATUS */}
        {activeSection === 'status' && (
          <div className="animate-fade-in space-y-12">
            <div className="space-y-4">
              <span className="text-sky-400 text-xs font-bold tracking-[0.2em] uppercase">Transparency Log</span>
              <h2 className="text-2xl font-semibold text-white">Current Status.</h2>
              <p className="text-neutral-400 leading-relaxed">
                Trust is built on visibility. We will not open sales until our stability protocols are satisfied.
              </p>
            </div>

            <div className="bg-neutral-900/30 border border-neutral-900 rounded-sm overflow-hidden">
              <div className="grid grid-cols-1 divide-y divide-neutral-900">
                {statusItems.map((item, index) => (
                  <div key={index} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {item.status === 'complete' && <CheckCircle2 size={16} className="text-emerald-900/80" />}
                      {item.status === 'active' && <Clock size={16} className="text-sky-400 animate-pulse" />}
                      {item.status === 'pending' && <div className="w-4 h-4 rounded-full border border-neutral-800"></div>}
                      <span className={`text-sm ${item.status === 'active' ? 'text-white font-medium' : 'text-neutral-500'}`}>
                        {item.label}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-neutral-600 uppercase tracking-wider">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-sm text-center space-y-4 mt-8">
              <h3 className="text-white font-medium">Notify upon clearance.</h3>
              <p className="text-sm text-neutral-500">We launch only when the product is perfect.</p>
              
              <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
                <input 
                  type="email" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="email@address.com" 
                  required
                  disabled={notifyStatus === 'success'}
                  className="bg-neutral-950 border border-neutral-800 text-white px-4 py-2 text-sm w-full focus:outline-none focus:border-sky-900 transition-colors disabled:opacity-50"
                />
                <button 
                  type="submit" 
                  disabled={notifyStatus === 'loading' || notifyStatus === 'success'}
                  className="bg-neutral-200 text-neutral-900 px-6 py-2 text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                >
                  {notifyStatus === 'loading' ? <Loader2 className="animate-spin" size={16} /> : notifyStatus === 'success' ? 'Saved' : 'Notify'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW: FAQ */}
        {activeSection === 'faq' && (
          <div className="animate-fade-in space-y-8">
            <h2 className="text-2xl font-semibold text-white">Common Questions.</h2>
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <FaqItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
            <div className="pt-8 text-center">
              <a href="#" className="text-sm text-white border-b border-neutral-700 hover:border-white transition-colors">Consult a healthcare professional.</a>
            </div>
          </div>
        )}

        {/* VIEW: CONTACT */}
        {activeSection === 'contact' && (
          <div className="animate-fade-in space-y-8">
            <div className="space-y-4">
              <span className="text-sky-400 text-xs font-bold tracking-[0.2em] uppercase">Communication</span>
              <h2 className="text-2xl font-semibold text-white">Direct Line.</h2>
            </div>

            <div className="bg-neutral-900/30 border border-neutral-900 p-6 rounded-sm">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-neutral-500 uppercase">Name</label>
                    <input 
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      required
                      className="w-full bg-neutral-950 border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-sky-900 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-neutral-500 uppercase">Email</label>
                    <input 
                      type="email" 
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      required
                      className="w-full bg-neutral-950 border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-sky-900 transition-colors"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neutral-500 uppercase">Inquiry</label>
                  <textarea 
                    rows="4"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    required
                    className="w-full bg-neutral-950 border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-sky-900 transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={contactStatus === 'loading' || contactStatus === 'success'}
                    className="flex items-center gap-2 bg-neutral-200 text-neutral-900 px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50"
                  >
                    {contactStatus === 'loading' ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : contactStatus === 'success' ? (
                      <>Sent <CheckCircle2 size={16} /></>
                    ) : (
                      <>Send Message <Send size={16} /></>
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="border-t border-neutral-900 pt-8 mt-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-500">
                 <div className="p-4 border border-neutral-900">
                   <span className="block text-xs font-mono text-neutral-600 mb-1">EMAIL</span>
                   connect@gummyte.lab
                 </div>
                 <div className="p-4 border border-neutral-900">
                   <span className="block text-xs font-mono text-neutral-600 mb-1">LOCATION</span>
                   Bengaluru, KA, India
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* VIEW: PRIVACY */}
        {activeSection === 'privacy' && (
          <div className="animate-fade-in space-y-12">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                 <Lock size={20} className="text-sky-500" />
                 <span className="text-sky-400 text-xs font-bold tracking-[0.2em] uppercase">Legal</span>
               </div>
              <h2 className="text-2xl font-semibold text-white">Privacy Policy.</h2>
              <p className="text-neutral-400 leading-relaxed">
                Effective Date: January 1, 2024. <br/>
                We believe your data is yours. We optimize for privacy, not tracking.
              </p>
            </div>

            <div className="space-y-8">
                <div>
                   <h3 className="text-white font-medium mb-2">1. Information Collection</h3>
                   <p className="text-sm text-neutral-500">We currently collect only the information you voluntarily provide via our forms.</p>
                </div>
                <div>
                   <h3 className="text-white font-medium mb-2">2. Use of Information</h3>
                   <p className="text-sm text-neutral-500">Emails are used solely for product updates. We do not sell data.</p>
                </div>
            </div>
          </div>
        )}

        {/* VIEW: TERMS */}
        {activeSection === 'terms' && (
          <div className="animate-fade-in space-y-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <Scale size={20} className="text-sky-500" />
                 <span className="text-sky-400 text-xs font-bold tracking-[0.2em] uppercase">Legal</span>
               </div>
              <h2 className="text-2xl font-semibold text-white">Terms of Use.</h2>
            </div>
            <div className="space-y-8">
                <div>
                   <h3 className="text-white font-medium mb-2">1. Educational Purpose</h3>
                   <p className="text-sm text-neutral-500">The content on this website is for educational purposes only.</p>
                </div>
                <div>
                   <h3 className="text-white font-medium mb-2">2. Product Status</h3>
                   <p className="text-sm text-neutral-500">Gummyte is currently in a pre-launch phase.</p>
                </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-12 text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <p className="text-xs text-neutral-600 tracking-widest uppercase">
            <span onClick={() => navigate('admin')} className="cursor-default hover:text-neutral-800 transition-colors">
              Gummyte Performance Labs &copy; 2024
            </span>
          </p>
          <div className="flex justify-center gap-6 text-xs text-neutral-500">
            <button onClick={() => navigate('contact')} className="hover:text-white transition-colors">Contact</button>
            <span className="text-neutral-800">|</span>
            <button onClick={() => navigate('privacy')} className="hover:text-white transition-colors">Privacy</button>
            <span className="text-neutral-800">|</span>
            <button onClick={() => navigate('terms')} className="hover:text-white transition-colors">Terms</button>
            <span className="text-neutral-800">|</span>
            <button onClick={() => navigate('status')} className="hover:text-white transition-colors">Transparency</button>
          </div>
          <p className="text-[10px] text-neutral-700 max-w-lg mx-auto leading-relaxed">
            These statements have not been evaluated by the FSSAI. This product is not intended to diagnose, treat, cure, or prevent any disease. Results vary by individual.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Sub-component for FAQ Accordion
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-neutral-900">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left hover:text-white transition-colors"
      >
        <span className={`text-sm font-medium ${isOpen ? 'text-white' : 'text-neutral-400'}`}>{question}</span>
        {isOpen ? <ChevronUp size={16} className="text-neutral-500" /> : <ChevronDown size={16} className="text-neutral-500" />}
      </button>
      {isOpen && (
        <div className="pb-4 text-sm text-neutral-500 leading-relaxed pr-8 animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  );
};

export default Gummyte;