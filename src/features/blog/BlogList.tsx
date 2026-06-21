import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { blogPosts } from '../../data/blogPosts';
import { LogoFacturaDo } from '../core/LogoFacturaDo';

export default function BlogList() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-[#1A2732]/10 selection:text-[#FAFAFA] overflow-x-hidden">
      {/* Header Navigation (Identical to Landing) */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Desktop Logo */}
            <div className="hidden sm:block cursor-pointer" onClick={() => navigate('/')}>
              <LogoFacturaDo className="h-9 w-auto" />
            </div>
            {/* Mobile Logo using favicon */}
            <div className="block sm:hidden flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <img src="/facturaDonuevologo_favicon.svg" alt="FacturaDo" className="w-8 h-8 shrink-0 object-contain" referrerPolicy="no-referrer" />
              <span className="text-lg font-extrabold tracking-tight text-slate-900 font-sans">FacturaDo</span>
            </div>
          </div>

          {/* Desktop Nav Actions */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8 text-[13px] xl:text-sm font-semibold text-slate-600">
            <button onClick={() => navigate('/blog')} className="text-sky-600 transition-colors cursor-pointer font-semibold bg-transparent border-0 p-0 text-[13px] xl:text-sm whitespace-nowrap">Blog</button>
            <a href="/#funcionalidades" className="hover:text-sky-600 transition-colors whitespace-nowrap">Funcionalidades</a>
            <a href="/#testimonios" className="hover:text-sky-600 transition-colors whitespace-nowrap">Opiniones</a>
            <a href="/#faq" className="hover:text-sky-600 transition-colors whitespace-nowrap">Preguntas Frecuentes</a>
          </nav>

          {/* Desktop CTA actions */}
          <div className="hidden md:flex items-center gap-2 xl:gap-3">
            <button
              onClick={() => navigate('/login')}
              className="whitespace-nowrap px-4 xl:px-5 py-2.5 text-[13px] xl:text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-slate-200"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => navigate('/register')}
              className="whitespace-nowrap px-4 xl:px-6 py-2.5 text-[13px] xl:text-sm font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Comenzar Gratis
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
              Recursos y Novedades
            </h1>
            <p className="text-lg text-slate-600">
              Guías, consejos y actualizaciones sobre facturación electrónica, contabilidad y crecimiento empresarial en República Dominicana.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article 
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col"
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                <div className="aspect-[16/9] relative overflow-hidden bg-slate-100">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-sky-700 text-xs font-semibold rounded-full shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {post.readTime}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <span className="text-sm font-medium text-slate-900">{post.author}</span>
                    <span className="text-sky-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Leer más
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Simple */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} FacturaDo SRL. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
