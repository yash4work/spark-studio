import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, Calendar, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { BLOG_POSTS, BLOG_CATEGORIES } from '../data/blogData';
import { motion } from 'framer-motion';

export default function BlogPage() {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const currentLang = i18n.language ? i18n.language.slice(0, 2) : 'en';

  const filteredPosts = activeCategory === 'all'
    ? BLOG_POSTS
    : BLOG_POSTS.filter((post) => post.categorySlug === activeCategory);

  const homePrefix = currentLang === 'en' ? '' : `/${currentLang}`;
  const getPostUrl = (slug) => `${homePrefix}/blog/${slug}`;

  // Structured Data for Blog
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'Spark Studio Insights & Framer Resources',
    'description': 'Technical teardowns, Core Web Vitals optimization guides, and production Framer web design insights from Spark Studio.',
    'url': `https://www.thesparkstudio.digital${homePrefix}/blog`,
    'publisher': {
      '@type': 'Organization',
      'name': 'Spark Studio',
      'logo': 'https://www.thesparkstudio.digital/logo.png'
    },
    'blogPost': BLOG_POSTS.map((post) => ({
      '@type': 'BlogPosting',
      'headline': post.title,
      'description': post.excerpt,
      'datePublished': post.isoDate,
      'url': `https://www.thesparkstudio.digital${homePrefix}/blog/${post.slug}`,
      'author': {
        '@type': 'Person',
        'name': post.author.name
      }
    }))
  };

  return (
    <div className="min-h-screen pt-28 pb-24 text-[#8b87a0]">
      <SEOHead
        title="Resources, Tutorials & Engineering Teardowns — Spark Studio"
        description="In-depth tutorials, performance teardowns, and design resources on Framer, 90+ PageSpeed optimization, and digital architecture from Spark Studio."
        image="/assets/spark-studio-og-image.jpg"
        jsonLd={blogSchema}
      />

      <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
        
        {/* Header Hero Area */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono uppercase tracking-wider text-[#8e97f7] mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Insights & Resources</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#f7f6fb] tracking-tight leading-[1.08] mb-6 font-heading">
            Engineering teardowns & Framer playbooks.
          </h1>

          <p className="text-base sm:text-xl text-[#8b87a0] font-normal leading-relaxed">
            Practical guides on achieving 90+ Core Web Vitals, migrating from Figma to Framer, and building conversion-driven web architecture for ambitious brands.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-12 pb-6 border-b border-white/10">
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'bg-white/[0.03] text-[#8b87a0] hover:text-[#f7f6fb] hover:bg-white/[0.07] border border-white/[0.08]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filteredPosts.map((post) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="group flex flex-col justify-between rounded-[24px] bg-[#171523] border border-white/10 hover:border-[#8e97f7]/40 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            >
              <div>
                {/* Featured Thumbnail */}
                <Link to={getPostUrl(post.slug)} className="block aspect-[16/10] overflow-hidden relative">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171523] via-transparent to-transparent opacity-80" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider font-semibold bg-[#15131f]/90 text-[#8e97f7] border border-white/10 backdrop-blur-md">
                    {post.category}
                  </span>
                </Link>

                {/* Content Area */}
                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-4 text-xs font-mono text-[#8b87a0] mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-white/40" />
                      {post.date}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-white/40" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-[#f7f6fb] font-heading mb-3 group-hover:text-[#8e97f7] transition-colors leading-snug">
                    <Link to={getPostUrl(post.slug)}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-[#8b87a0] leading-relaxed line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Bottom Footer & CTA */}
              <div className="px-6 sm:px-7 py-4 sm:py-5 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 bg-[#15131f] shrink-0 shadow-sm">
                    <img
                      src={post.author.avatar || '/assets/spark_studio_avatar.jpg'}
                      alt={post.author.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/spark_studio_avatar.jpg';
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-[#c3bfdb]">
                    {post.author.name}
                  </span>
                </div>

                <Link
                  to={getPostUrl(post.slug)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8e97f7] group-hover:text-[#ff6a45] transition-colors"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

            </motion.article>
          ))}
        </div>

        {/* Bottom Studio CTA Box */}
        <div className="mt-20 p-8 sm:p-12 rounded-[28px] bg-gradient-to-r from-[#1f1a33] to-[#171523] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8e97f7] font-semibold block mb-2">
              Ready to Upgrade Your Digital Presence?
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#f7f6fb] font-heading mb-2">
              Need a 90+ PageSpeed site engineered for high conversions?
            </h3>
            <p className="text-sm text-[#8b87a0] leading-relaxed">
              We design custom Framer websites and web applications with guaranteed sub-second load times and rock-solid Core Web Vitals.
            </p>
          </div>
          <a
            href={`${homePrefix}/#contact`}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white transition-all shadow-lg hover:opacity-90 active:scale-[0.99] whitespace-nowrap"
            style={{
              background: 'linear-gradient(120deg, rgb(108, 79, 232) 0%, rgb(255, 106, 69) 100%)'
            }}
          >
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}
