import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock, Calendar, Share2, Check, Sparkles, ArrowRight, Tag, BookOpen } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { getPostBySlug, BLOG_POSTS } from '../data/blogData';

export default function BlogPostPage() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const post = getPostBySlug(slug);
  const currentLang = i18n.language ? i18n.language.slice(0, 2) : 'en';
  const homePrefix = currentLang === 'en' ? '' : `/${currentLang}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold text-white mb-4">
          {t('blog.notFoundTitle') || 'Article Not Found'}
        </h1>
        <p className="text-[#8b87a0] mb-8">
          {t('blog.notFoundDesc') || 'The requested guide or teardown could not be located.'}
        </p>
        <Link
          to={`${homePrefix}/blog`}
          className="px-6 py-3 rounded-full bg-white text-black font-semibold text-sm"
        >
          {t('blog.returnToBlog') || 'Return to Blog & Resources'}
        </Link>
      </div>
    );
  }

  const postTitle = t(`blogPosts.${slug}.title`) || post.title;
  const postExcerpt = t(`blogPosts.${slug}.excerpt`) || post.excerpt;
  const postCategory = t(`blogPosts.${slug}.category`) || post.category;
  const postDate = t(`blogPosts.${slug}.date`) || post.date;
  const postReadTime = t(`blogPosts.${slug}.readTime`) || post.readTime;
  const postContent = t(`blogPosts.${slug}.content`) || post.content;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  // Article JSON-LD Structured Data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': postTitle,
    'description': postExcerpt,
    'image': post.featuredImage,
    'datePublished': post.isoDate,
    'dateModified': post.isoDate,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://www.thesparkstudio.digital${homePrefix}/blog/${post.slug}`
    },
    'author': {
      '@type': 'Person',
      'name': post.author.name,
      'jobTitle': post.author.role
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'The Spark Studio',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://www.thesparkstudio.digital/logo.png'
      }
    }
  };

  // Basic HTML markdown parser for headers, lists, code, and links
  const renderFormattedContent = (content) => {
    const lines = content.trim().split('\n');
    const elements = [];
    let inList = false;
    let listItems = [];

    const flushList = () => {
      if (inList && listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="my-5 space-y-2.5 pl-6 list-disc text-[#c3bfdb]">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        );
        inList = false;
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="text-2xl sm:text-3xl font-extrabold text-[#f7f6fb] font-heading mt-12 mb-4 tracking-tight">
            {trimmed.replace('## ', '')}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="text-xl sm:text-2xl font-bold text-[#f7f6fb] font-heading mt-8 mb-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        inList = true;
        const text = trimmed.substring(2);
        listItems.push(text);
      } else if (trimmed.startsWith('---')) {
        flushList();
        elements.push(
          <hr key={index} className="my-10 border-white/10" />
        );
      } else if (trimmed.startsWith('1. ') || trimmed.startsWith('2. ') || trimmed.startsWith('3. ') || trimmed.startsWith('4. ')) {
        flushList();
        elements.push(
          <div key={index} className="flex items-start gap-3 my-3">
            <span className="font-mono text-xs font-bold text-[#8e97f7] bg-[#8e97f7]/10 px-2 py-0.5 rounded border border-[#8e97f7]/20 shrink-0 mt-0.5">
              {trimmed.substring(0, 2)}
            </span>
            <p className="text-sm sm:text-base text-[#c3bfdb] leading-relaxed">
              {trimmed.substring(3)}
            </p>
          </div>
        );
      } else if (trimmed.length > 0) {
        flushList();
        elements.push(
          <p key={index} className="text-base sm:text-lg text-[#c3bfdb] leading-relaxed my-4 font-normal">
            {trimmed}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  return (
    <div className="min-h-screen pt-28 pb-24 text-[#8b87a0]">
      <SEOHead
        title={`${postTitle} — The Spark Studio Insights`}
        description={postExcerpt}
        image={post.featuredImage}
        jsonLd={articleSchema}
      />

      <article className="max-w-[1040px] mx-auto px-6 sm:px-10">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#8b87a0] mb-8">
          <Link to={homePrefix || '/'} className="hover:text-white transition-colors">
            {t('blog.breadcrumbHome') || 'Home'}
          </Link>
          <span>/</span>
          <Link to={`${homePrefix}/blog`} className="hover:text-white transition-colors">
            {t('blog.breadcrumbBlog') || 'Blog'}
          </Link>
          <span>/</span>
          <span className="text-white truncate max-w-[240px] sm:max-w-none">{postTitle}</span>
        </div>

        {/* Back Link */}
        <Link
          to={`${homePrefix}/blog`}
          className="inline-flex items-center gap-2 text-xs font-mono text-[#8b87a0] hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('blog.backToArticles') || '← Back to all articles'}</span>
        </Link>

        {/* Article Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono tracking-wider font-semibold bg-[#8e97f7]/10 text-[#8e97f7] border border-[#8e97f7]/25">
              {postCategory}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-[#8b87a0]">
              <Clock className="w-3.5 h-3.5 text-white/40" />
              {postReadTime}
            </span>
            <span className="text-white/20">·</span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-[#8b87a0]">
              <Calendar className="w-3.5 h-3.5 text-white/40" />
              {postDate}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#f7f6fb] tracking-tight leading-[1.1] mb-6 font-heading">
            {postTitle}
          </h1>

          <p className="text-lg sm:text-xl text-[#8b87a0] font-normal leading-relaxed mb-8">
            {postExcerpt}
          </p>

          {/* Author and Share Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-5 border-y border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden bg-[#15131f] flex items-center justify-center shrink-0 shadow-sm">
                <img
                  src={post.author.avatar || '/assets/spark_studio_avatar.jpg'}
                  alt={post.author.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/spark_studio_avatar.jpg';
                  }}
                />
              </div>
              <div>
                <span className="text-sm font-semibold text-[#f7f6fb] block font-heading">
                  {post.author.name}
                </span>
                <span className="text-xs font-mono text-[#8b87a0]">
                  {post.author.role}
                </span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-[#c3bfdb] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{t('blog.linkCopied') || 'Link Copied!'}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{t('blog.shareGuide') || 'Share Guide'}</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Featured Image */}
        <div className="rounded-[24px] overflow-hidden border border-white/10 mb-12 aspect-[16/9] shadow-2xl">
          <img
            src={post.featuredImage}
            alt={postTitle}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-invert max-w-none mb-16">
          {renderFormattedContent(postContent)}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 py-6 border-t border-white/10 mb-12">
          <span className="text-xs font-mono text-[#8b87a0] mr-2">
            {t('blog.topics') || 'Topics:'}
          </span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-[#c3bfdb]"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Related Action Box */}
        <div className="p-8 sm:p-10 rounded-[24px] bg-[#1a1727] border border-white/10 mb-16">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8e97f7] mb-2 font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>{t('blog.articleCtaEyebrow') || 'Built by The Spark Studio'}</span>
          </div>
          <h3 className="text-2xl font-bold text-[#f7f6fb] font-heading mb-3">
            {t('blog.articleCtaTitle') || 'Want us to engineer your next high-performance Framer site?'}
          </h3>
          <p className="text-sm text-[#8b87a0] leading-relaxed mb-6 max-w-2xl">
            {t('blog.articleCtaDesc') || 'Whether you need a custom client platform built from scratch or want an existing Framer template tuned to 90+ Core Web Vitals, we ship production-grade sites in days.'}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`${homePrefix}/#contact`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white shadow-lg"
              style={{
                background: 'linear-gradient(120deg, rgb(108, 79, 232) 0%, rgb(255, 106, 69) 100%)'
              }}
            >
              <span>{t('blog.articleCtaSchedule') || 'Schedule Consultation'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href={`${homePrefix}/#templates`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-[#f7f6fb] bg-white/[0.04] hover:bg-white/[0.08] border border-white/20 transition-colors"
            >
              <span>{t('blog.articleCtaExplore') || 'Explore Templates'}</span>
            </a>
          </div>
        </div>

        {/* Read More Posts */}
        <div className="pt-12 border-t border-white/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-[#f7f6fb] font-heading">
              {t('blog.moreInsights') || 'More Insights & Teardowns'}
            </h3>
            <Link
              to={`${homePrefix}/blog`}
              className="text-xs font-mono text-[#8e97f7] hover:text-[#ff6a45] transition-colors"
            >
              {t('blog.viewAllArticles') || 'View all articles →'}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {otherPosts.map((p) => {
              const otherTitle = t(`blogPosts.${p.slug}.title`) || p.title;
              const otherExcerpt = t(`blogPosts.${p.slug}.excerpt`) || p.excerpt;
              const otherCategory = t(`blogPosts.${p.slug}.category`) || p.category;
              const otherReadTime = t(`blogPosts.${p.slug}.readTime`) || p.readTime;

              return (
                <Link
                  key={p.slug}
                  to={`${homePrefix}/blog/${p.slug}`}
                  className="group p-6 rounded-2xl bg-[#171523] border border-white/10 hover:border-[#8e97f7]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-mono text-[#8e97f7] block mb-2 font-semibold">
                      {otherCategory}
                    </span>
                    <h4 className="text-lg font-bold text-[#f7f6fb] font-heading group-hover:text-[#8e97f7] transition-colors leading-snug mb-2">
                      {otherTitle}
                    </h4>
                    <p className="text-xs text-[#8b87a0] line-clamp-2 leading-relaxed">
                      {otherExcerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5 text-xs font-mono text-[#8b87a0]">
                    <span>{otherReadTime}</span>
                    <span className="text-[#8e97f7] group-hover:translate-x-1 transition-transform">
                      {t('blog.readArticle') || 'Read →'}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </article>
    </div>
  );
}
