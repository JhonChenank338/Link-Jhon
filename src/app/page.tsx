"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiExternalLink, FiMoon, FiSun, FiLock, FiUnlock, FiX } from 'react-icons/fi';

// MENGGUNAKAN ENVIRONMENT VARIABLES UNTUK KEAMANAN HOSTING
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mwcbqctlttgwlquwrqbe.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_LqgxeXFkgYs5WEHpQC6CwQ_LmKnRK7l';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [links, setLinks] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isDark, setIsDark] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');

  const PIN_RAHASIA = "030308";

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    const { data } = await supabase.from('links').select('*').order('created_at', { ascending: false });
    if (data) setLinks(data);
  }

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === PIN_RAHASIA) {
      setIsAdmin(true);
      setShowPinModal(false);
      setPinInput('');
    } else {
      alert("PIN SALAH!");
      setPinInput('');
    }
  };

  async function addLink(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !url) return;
    const { error } = await supabase.from('links').insert([{ title, url }]);
    if (!error) {
      setTitle(''); setUrl('');
      fetchLinks();
    }
  }

  async function deleteLink(id: string) {
    if(!confirm("Yakin hapus?")) return;
    await supabase.from('links').delete().eq('id', id);
    fetchLinks();
  }

  return (
    <div className={`${isDark ? 'bg-[#0a0a0c] text-white' : 'bg-[#f8fafc] text-slate-900'} min-h-screen transition-colors duration-700 relative overflow-hidden font-sans`}>
      
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      <nav className="relative z-10 max-w-5xl mx-auto p-8 flex justify-between items-center">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="font-black text-white italic text-xl">JL</span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase">Jhon|link<span className="text-blue-500">.</span></h1>
        </motion.div>

        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-xl">
          <button 
            onClick={() => isAdmin ? setIsAdmin(false) : setShowPinModal(true)}
            className={`p-3 rounded-xl transition-all ${isAdmin ? 'bg-green-500/20 text-green-400' : 'hover:bg-white/10 opacity-50'}`}
          >
            {isAdmin ? <FiUnlock size={22} /> : <FiLock size={22} />}
          </button>
          <div className="w-[1px] h-6 bg-white/10" />
          <button onClick={() => setIsDark(!isDark)} className="p-3 rounded-xl hover:bg-white/10 transition-all text-yellow-400">
            {isDark ? <FiSun size={22} /> : <FiMoon size={22} className="text-slate-600" />}
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-8 pb-20">
        
        {/* Admin Form */}
        <AnimatePresence>
          {isAdmin && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className={`p-8 rounded-[2.5rem] mb-12 border backdrop-blur-2xl shadow-2xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}
            >
              <div className="flex items-center gap-2 mb-6 text-blue-500">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <h2 className="text-xs font-black tracking-[0.3em] uppercase">SIMPAN LINK NYA DISINI</h2>
              </div>
              <form onSubmit={addLink} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                  type="text" placeholder="Judul" value={title} onChange={(e) => setTitle(e.target.value)}
                  className={`p-4 rounded-2xl outline-none focus:ring-2 ring-blue-500 transition-all ${isDark ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-transparent text-slate-900'}`}
                />
                <input 
                  type="url" placeholder="Alamat Link" value={url} onChange={(e) => setUrl(e.target.value)}
                  className={`p-4 rounded-2xl outline-none focus:ring-2 ring-blue-500 transition-all ${isDark ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-transparent text-slate-900'}`}
                />
                <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black p-4 rounded-2xl hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95 transition-all">
                  SIMPAN
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {links.map((link) => (
              <motion.div
                key={link.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -12 }}
                className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 backdrop-blur-md ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 shadow-xl'}`}
              >
                <div className="flex flex-col h-full gap-6">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-500">
                      <FiExternalLink size={28} />
                    </div>
                    {isAdmin && (
                      <button onClick={() => deleteLink(link.id)} className="p-3 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                        <FiTrash2 size={20} />
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-black mb-1 leading-tight">{link.title}</h3>
                    <p className="text-xs opacity-40 font-mono tracking-tighter uppercase">{new URL(link.url).hostname}</p>
                  </div>
                  <a href={link.url} target="_blank" className="mt-auto w-full bg-blue-600/10 text-blue-500 text-center py-4 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all tracking-widest text-xs">
                    BUKA LINK
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Modern PIN Modal */}
      <AnimatePresence>
        {showPinModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              className={`w-full max-w-sm p-10 rounded-[3rem] border shadow-2xl relative ${isDark ? 'bg-[#0f0f11] border-white/10' : 'bg-white border-slate-200'}`}
            >
              <button onClick={() => setShowPinModal(false)} className="absolute top-6 right-6 p-2 opacity-30 hover:opacity-100 transition-opacity"><FiX size={24}/></button>
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-500">
                   <FiLock size={32}/>
                </div>
                <h3 className="text-2xl font-black tracking-tighter">AUTHENTICATION</h3>
              </div>
              <form onSubmit={handleVerifyPin} className="space-y-8">
                <input 
                  type="password" maxLength={6} autoFocus value={pinInput} onChange={(e) => setPinInput(e.target.value)}
                  className="w-full text-center text-5xl tracking-[0.5em] font-black bg-transparent border-b-2 border-blue-500/30 focus:border-blue-500 outline-none pb-4 transition-all"
                  placeholder="000000"
                />
                <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-2xl shadow-blue-500/40 hover:bg-blue-700 active:scale-95 transition-all uppercase tracking-widest text-sm">
                  Unlock Access
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}