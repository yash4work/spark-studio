import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, CheckCircle2 } from 'lucide-react';
import { LinkedInIcon, TeamsIcon, SlackIcon, MailIcon } from './SocialIcons';
import { saveInquiry } from '../lib/supabase';
import { trackEvent } from '../lib/analytics';
import { MagneticButton } from '../lib/framer-effects';
import { isLikelySpam } from '../lib/formGuard';

export default function ContactSection() {
  const { t, i18n } = useTranslation();

  const contact = t('contact', { returnObjects: true });
  const typeOptions = contact?.typeOptions || [
    'Template Customization',
    'Bespoke Website Build',
    'Figma to Framer',
    'Speed Optimization',
    'Other / Question'
  ];
  // No prices anywhere in the form: visitors who see cost ranges often don't get in touch.
  // "Timeline" tells us how ready a lead is instead.
  const timelineOptions = contact?.timelineOptions || [
    'As soon as possible',
    'Within a month',
    'In 1–3 months',
    'Just exploring'
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: typeOptions[0],
    timeline: timelineOptions[1] || timelineOptions[0],
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [deliveryError, setDeliveryError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Spam protection: hidden honeypot field + time the form was first shown
  const honeypotRef = useRef(null);
  const startedAtRef = useRef(null);
  useEffect(() => { startedAtRef.current = Date.now(); }, [submitted]);

  useEffect(() => {
    setFormData((prev) => {
      const newProjectType = typeOptions.includes(prev.projectType) ? prev.projectType : typeOptions[0];
      const newTimeline = timelineOptions.includes(prev.timeline) ? prev.timeline : (timelineOptions[1] || timelineOptions[0]);
      if (newProjectType === prev.projectType && newTimeline === prev.timeline) return prev;
      return { ...prev, projectType: newProjectType, timeline: newTimeline };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDeliveryError(false);

    // Bots: pretend it worked, but send nothing
    if (isLikelySpam({ honeypot: honeypotRef.current?.value, startedAt: startedAtRef.current })) {
      setSubmitted(true);
      return;
    }

    setLoading(true);

    try {
      // 1. Send inquiry email directly to hello@thesparkstudio.digital via FormSubmit
      const emailPromise = fetch('https://formsubmit.co/ajax/hello@thesparkstudio.digital', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          projectType: formData.projectType,
          timeline: formData.timeline,
          message: formData.message,
          _subject: `New Lead: ${formData.name} - ${formData.projectType}`,
          _template: 'table',
          _captcha: 'false',
          _honey: honeypotRef.current?.value || ''
        })
      });

      // 2. Concurrently persist in Supabase
      const [mail, database] = await Promise.allSettled([
        emailPromise.then(async response => response.ok && String((await response.json()).success) === 'true'),
        saveInquiry(formData)
      ]);
      if (mail.value !== true && database.value?.mode !== 'cloud') throw new Error('Delivery failed');

      trackEvent('generate_lead', {
        project_type: formData.projectType,
        timeline: formData.timeline,
      });
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        projectType: typeOptions[0],
        timeline: timelineOptions[1] || timelineOptions[0],
        message: '',
      });
    } catch (err) {
      console.error('Submission error:', err);
      setDeliveryError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-20 sm:py-28 relative flex flex-col xl:flex-row items-start justify-between gap-12 lg:gap-16 xl:gap-20 section-glow"
    >
      {/* Left Column: Full-width stacked on mobile & tablet (up to 1024px), fixed width on desktop xl+ */}
      <div className="w-full xl:w-[460px] flex-shrink-0 flex flex-col items-start gap-6">
        <p className="font-mono text-xs uppercase tracking-[0.05em] text-[#8e97f7]">
          {t('contact.tag') || 'START A CONVERSATION'}
        </p>
        
        <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-[#f7f6fb] font-heading tracking-[-0.03em] leading-[1.12]">
          {t('contact.title') || 'Let’s build something exceptional together.'}
        </h2>

        <p className="text-sm md:text-base text-[#8b87a0] font-normal leading-relaxed">
          {t('contact.subtitle') || 'Questions about a template, a custom integration, or ready to hire us for a custom website? We reply within 24 hours.'}
        </p>

        <div className="pt-2 flex flex-col gap-4">
          <a
            href="mailto:hello@thesparkstudio.digital"
            className="font-mono text-base sm:text-lg text-[#8e97f7] hover:text-[#ff6a45] transition-colors inline-block"
          >
            hello@thesparkstudio.digital →
          </a>

          <div className="flex items-center gap-3 pt-1">
            <a
              href="mailto:hello@thesparkstudio.digital"
              aria-label="Direct Email"
              title="hello@thesparkstudio.digital"
              className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-[#8e97f7]/15 border border-white/10 hover:border-[#8e97f7]/50 text-[#8b87a0] hover:text-[#8e97f7] flex items-center justify-center transition-all duration-200 group shadow-sm"
            >
              <MailIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>

            <a
              href="https://www.linkedin.com/company/sparkstudio0"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
              className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-[#0A66C2]/15 border border-white/10 hover:border-[#0A66C2]/50 text-[#8b87a0] hover:text-[#0A66C2] flex items-center justify-center transition-all duration-200 group shadow-sm"
            >
              <LinkedInIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>

            <a
              href="https://teams.microsoft.com/l/chat/0/0?users=hello@thesparkstudio.digital"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Microsoft Teams"
              title="Microsoft Teams"
              className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-[#5059C9]/15 border border-white/10 hover:border-[#5059C9]/50 text-[#8b87a0] hover:text-[#7B83EB] flex items-center justify-center transition-all duration-200 group shadow-sm"
            >
              <TeamsIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>

            <a
              href="https://sparkstudio0.slack.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Slack"
              title="Slack"
              className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-[#ECB22E]/15 border border-white/10 hover:border-[#ECB22E]/50 text-[#8b87a0] hover:text-[#ECB22E] flex items-center justify-center transition-all duration-200 group shadow-sm"
            >
              <SlackIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>
          </div>

          <p className="text-xs font-mono text-[#8b87a0]/80 pt-2">
            Mon – Fri · Global Remote · Replies within 24h
          </p>
        </div>
      </div>

      {/* Right Column: Expanded High-Impact Inquiry Card (100% width on <=1024px, flex-1 on xl+) */}
      <div className="w-full xl:flex-1 rounded-3xl bg-[#1b1826] border border-white/10 p-8 sm:p-10 lg:p-12 shadow-2xl flex flex-col gap-7 relative overflow-hidden">
        <div>
          <h3 className="font-heading font-semibold text-2xl sm:text-3xl text-[#f7f6fb] mb-2">
            {t('contact.cardTitle') || 'Project Inquiry'}
          </h3>
          <p className="text-sm md:text-base text-[#8b87a0] font-normal">
            {t('contact.cardDesc') || 'Tell us about your brand, scope, and timeline.'}
          </p>
        </div>

        {submitted ? (
          <div className="py-16 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#8e97f7]/15 border border-[#8e97f7]/30 flex items-center justify-center text-[#8e97f7]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-2xl text-[#f7f6fb] mb-1.5">
                {t('contact.successTitle') || 'Inquiry Received'}
              </h4>
              <p className="text-sm md:text-base text-[#8b87a0] max-w-sm">
                {t('contact.success') || t('contact.successMessage') || 'Thank you! We have received your project details and will reply within 24 hours.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-4 px-5 py-2 rounded-xl text-xs font-mono text-[#8e97f7] hover:text-[#f7f6fb] bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            >
              {t('contact.sendAnother') || 'Send another message'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Honeypot: hidden from people and screen readers; bots fill it in */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
              <label htmlFor="contact-website">Leave this field empty</label>
              <input id="contact-website" name="_honey" type="text" tabIndex={-1} autoComplete="off" ref={honeypotRef} defaultValue="" />
            </div>
            {/* Row 1: Name and Email side-by-side on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-mono uppercase tracking-wider text-[#8b87a0] mb-2">
                  {t('contact.formName') || 'Your Name'}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  aria-label={t('contact.formName') || 'Your Name'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3.5 rounded-xl bg-[#15131f] border border-white/10 text-sm md:text-base text-[#f7f6fb] placeholder-[#8b87a0]/50 focus:outline-none focus:border-[#8e97f7] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-mono uppercase tracking-wider text-[#8b87a0] mb-2">
                  {t('contact.formEmail') || 'Email Address'}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  aria-label={t('contact.formEmail') || 'Email Address'}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jane@studio.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-[#15131f] border border-white/10 text-sm md:text-base text-[#f7f6fb] placeholder-[#8b87a0]/50 focus:outline-none focus:border-[#8e97f7] transition-colors"
                />
              </div>
            </div>

            {/* Row 2: Service Needed and Timeline side-by-side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-project-type" className="block text-xs font-mono uppercase tracking-wider text-[#8b87a0] mb-2">
                  {t('contact.formType') || 'Service Needed'}
                </label>
                <select
                  id="contact-project-type"
                  name="projectType"
                  aria-label={t('contact.formType') || 'Service Needed'}
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#15131f] border border-white/10 text-sm md:text-base text-[#f7f6fb] focus:outline-none focus:border-[#8e97f7] transition-colors cursor-pointer"
                >
                  {typeOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#1b1826] text-[#f7f6fb]">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="contact-timeline" className="block text-xs font-mono uppercase tracking-wider text-[#8b87a0] mb-2">
                  {t('contact.formTimeline') || 'Timeline'}
                </label>
                <select
                  id="contact-timeline"
                  name="timeline"
                  aria-label={t('contact.formTimeline') || 'Timeline'}
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#15131f] border border-white/10 text-sm md:text-base text-[#f7f6fb] focus:outline-none focus:border-[#8e97f7] transition-colors cursor-pointer"
                >
                  {timelineOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#1b1826] text-[#f7f6fb]">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Project Overview textarea */}
            <div>
              <label htmlFor="contact-message" className="block text-xs font-mono uppercase tracking-wider text-[#8b87a0] mb-2">
                {t('contact.formMessage') || 'Project Overview'}
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                aria-label={t('contact.formMessage') || 'Project Overview'}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={t('contact.formMessagePlaceholder') || 'Tell us about your brand, scope, and timeline goals...'}
                className="w-full min-h-[140px] px-4 py-3.5 rounded-xl bg-[#15131f] border border-white/10 text-sm md:text-base text-[#f7f6fb] placeholder-[#8b87a0]/50 focus:outline-none focus:border-[#8e97f7] transition-colors resize-none leading-relaxed"
              />
            </div>

            {deliveryError && <p role="alert">{t("deliveryError")}</p>}
            <MagneticButton className="w-full">
              <button
                type="submit"
                disabled={loading}
                className="framer-btn-primary mt-2 w-full py-4 rounded-full text-base font-semibold text-white shadow-[0_10px_25px_-5px_rgba(108,79,232,0.4)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{t('contact.submitBtn') || 'Send inquiry →'}</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </MagneticButton>
          </form>
        )}
      </div>
    </section>
  );
}
