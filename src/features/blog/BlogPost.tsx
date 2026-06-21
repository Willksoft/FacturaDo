import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogPosts } from '../../data/blogPosts';

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
        <blockquote key={index} className="border-l-4 border-indigo-500 bg-indigo-50/80 p-5 my-8 rounded-r-xl shadow-sm">
          <p className="text-indigo-900 font-medium italic">{renderTextWithBold(innerText)}</p>
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Artículo no encontrado</h1>
        <button onClick={() => navigate('/blog')} className="text-indigo-600 hover:text-indigo-700 font-medium">
          ← Volver al blog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">FacturaDo</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/blog" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors mr-4 hidden sm:block">
              ← Volver al Blog
            </Link>
            <button onClick={() => navigate('/register')} className="text-sm font-medium bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5">
              Crear Cuenta Gratis
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
            <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 font-semibold rounded-full text-sm mb-6">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-center gap-6 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
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
            className="mt-20 bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-3xl p-8 md:p-12 text-center shadow-2xl shadow-indigo-600/20"
          >
            <h3 className="text-3xl font-bold text-white mb-4">¿Listo para simplificar tu facturación?</h3>
            <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
              Únete a miles de negocios en República Dominicana que ya emiten sus comprobantes fiscales sin complicaciones. Es 100% gratis.
            </p>
            <button 
              onClick={() => navigate('/register')}
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
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
