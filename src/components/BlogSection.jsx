import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Clock, Calendar, Sparkles } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogData';

export default function BlogSection() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language ? i18n.language.slice(0, 2) : 'en';
  const homePrefix = currentLang === 'en' ? '' : `/${currentLang}`;

  const featuredPosts = BLOG_POSTS.slice(0, 3);

  return (
    <section id="resources" className="py-24 sm:py-32 border-t border-white/10 bg-[#12101a] relative">
      <div className="max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono uppercase tracking-wider text-[#8e97f7] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('blogSection.tag') || 'INSIGHTS & PLAYBOOKS'}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#f7f6fb] tracking-tight font-heading leading-tight">
              {t('blogSection.title') || 'Engineering standards, teardowns & Framer playbooks.'}
            </h2>
          </div>

          <Link
            to={`${homePrefix}/blog`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono font-semibold text-[#f7f6fb] bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 transition-all group"
          >
            <span>{t('blogSection.exploreAll') || 'Explore all resources'}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-[#8e97f7]" />
          </Link>
        </div>

        {/* 3-Column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post) => {
            const postTitle = t(`blogPosts.${post.slug}.title`) || post.title;
            const postExcerpt = t(`blogPosts.${post.slug}.excerpt`) || post.excerpt;
            const postCategory = t(`blogPosts.${post.slug}.category`) || post.category;
            const postDate = t(`blogPosts.${post.slug}.date`) || post.date;
            const postReadTime = t(`blogPosts.${post.slug}.readTime`) || post.readTime;

            return (
              <article
                key={post.slug}
                className="group flex flex-col justify-between rounded-[24px] bg-[#161423] border border-white/10 hover:border-[#8e97f7]/40 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              >
                <div>
                  {/* Image */}
                  <Link to={`${homePrefix}/blog/${post.slug}`} className="block aspect-[16/10] overflow-hidden relative">
                    <img
                      src={post.featuredImage}
                      alt={postTitle}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161423] via-transparent to-transparent opacity-80" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider font-semibold bg-[#15131f]/90 text-[#8e97f7] border border-white/10 backdrop-blur-md">
                      {postCategory}
                    </span>
                  </Link>

                  {/* Body */}
                  <div className="p-6 sm:p-7">
                    <div className="flex items-center gap-3 text-xs font-mono text-[#8b87a0] mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-white/40" />
                        {postDate}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-white/40" />
                        {postReadTime}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#f7f6fb] font-heading mb-3 group-hover:text-[#8e97f7] transition-colors leading-snug">
                      <Link to={`${homePrefix}/blog/${post.slug}`}>
                        {postTitle}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-[#8b87a0] leading-relaxed line-clamp-3">
                      {postExcerpt}
                    </p>
                  </div>
                </div>

                {/* Bottom Footer */}
                <div className="px-6 sm:px-7 py-4 sm:py-5 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20 bg-[#15131f] shrink-0 shadow-sm">
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
                    to={`${homePrefix}/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#8e97f7] group-hover:text-[#ff6a45] transition-colors"
                  >
                    <span>{t('blog.readGuide') || 'Read Guide'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>

              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
