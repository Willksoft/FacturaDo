import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogPosts } from '../../data/blogPosts';
import { LogoFacturaDo } from '../core/LogoFacturaDo';

const renderTextWithBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const renderContent = (content: string) => {
  return content.trim().split('\n\n').map((paragraph, index) => {
    const trimmed = paragraph.trim();
    if (trimmed.startsWith('### ')) {
      return <h3 key={index} className="text-2xl font-bold text-slate-900 mt-10 mb-4">{trimmed.replace('### ', '')}</h3>;
    }
    if (trimmed.startsWith('> ')) {
      // Manejar blockquotes que pueden tener negritas adentro
      const innerText = trimmed.replace('> ', '');
      return (
        <blockquote key={index} className="border-l-4 border-sky-500 bg-sky-50/80 p-5 my-8 rounded-r-xl shadow-sm">
          <p className="text-sky-900 font-medium italic">{renderTextWithBold(innerText)}</p>
        </blockquote>
      );
    }
    if (trimmed.startsWith('- ')) {
      const items = trimmed.split('\n').map(item => item.replace('- ', '').trim());
      return (
        <ul key={index} className="list-disc pl-5 my-6 space-y-3 text-slate-700 text-lg">
          {items.map((item, i) => <li key={i}>{renderTextWithBold(item)}</li>)}
        </ul>
      );
    }
    return <p key={index} className="text-slate-700 leading-relaxed mb-6 text-lg">{renderTextWithBold(trimmed)}</p>;
  });
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA]">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Artículo no encontrado</h1>
        <button onClick={() => navigate('/blog')} className="text-sky-600 hover:text-sky-700 font-medium">
          ← Volver al blog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#1A2732]/10 selection:text-[#FAFAFA] overflow-x-hidden">
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

      <main className="pt-32 pb-24">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <span className="inline-block px-4 py-1.5 bg-sky-50 text-sky-700 font-semibold rounded-full text-sm mb-6">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-center gap-6 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                {post.author}
              </div>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
              <span>{post.date}</span>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
              <span>{post.readTime}</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-14 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5 aspect-[16/9]"
          >
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
              fetchPriority="high"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="prose prose-lg prose-slate max-w-none"
          >
            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-10 border-l-4 border-slate-200 pl-6 py-2">
              {post.excerpt}
            </p>
            
            <div className="mt-8">
              {renderContent(post.content)}
            </div>
          </motion.div>

          {/* Call to Action CTA at the end of post */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 bg-gradient-to-br from-sky-600 to-sky-800 rounded-3xl p-8 md:p-12 text-center shadow-2xl shadow-sky-600/20"
          >
            <h3 className="text-3xl font-bold text-white mb-4">¿Listo para simplificar tu facturación?</h3>
            <p className="text-sky-100 text-lg mb-8 max-w-2xl mx-auto">
              Únete a miles de negocios en República Dominicana que ya emiten sus comprobantes fiscales sin complicaciones. Es 100% gratis.
            </p>
            <button 
              onClick={() => navigate('/register')}
              className="bg-white text-sky-700 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Comenzar Ahora - Es Gratis
            </button>
          </motion.div>
        </article>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} FacturaDo SRL. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
