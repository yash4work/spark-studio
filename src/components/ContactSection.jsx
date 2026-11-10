import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { LinkedInIcon, TeamsIcon, SlackIcon, MailIcon } from './SocialIcons';
import { saveInquiry } from '../lib/supabase';
import { motion } from 'framer-motion';
import { MagneticButton } from '../lib/framer-effects';

export default function ContactSection() {
  const { t } = useTranslation();

  const contact = t('contact', { returnObjects: true });
  const typeOptions = contact?.typeOptions || [
    'Template Customization ($499+)',
    'Bespoke Website Build ($2,500+)',
    'Figma to Framer ($1,500+)',
    'Speed Optimization ($350+)',
    'Other / Question'
  ];
  const budgetOptions = contact?.budgetOptions || [
    '< $1,000',
    '$1,000 – $3,000',
    '$3,000 – $6,000',
    '$6,000+'
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: typeOptions[0],
    budget: budgetOptions[1] || budgetOptions[0],
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeOptions?.length > 0 && !typeOptions.includes(formData.projectType)) {
      setFormData((prev) => ({ ...prev, projectType: typeOptions[0] }));
    }
    if (budgetOptions?.length > 0 && !budgetOptions.includes(formData.budget)) {
      setFormData((prev) => ({ ...prev, budget: budgetOptions[1] || budgetOptions[0] }));
    }
  }, [typeOptions, budgetOptions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await saveInquiry(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        projectType: typeOptions[0],
        budget: budgetOptions[1] || budgetOptions[0],
        message: '',
      });
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28 relative flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16 border-t border-white/10"
    >
      {/* Left Column (.framer-1qo52ro) */}
      <div className="flex-1 flex flex-col items-start gap-5">
        <p className="font-mono text-xs uppercase tracking-[0.05em] text-[#8e97f7]">
          {t('contact.tag') || 'START A CONVERSATION'}
        </p>
        
        <h2 className="text-3xl sm:text-4xl md:text-[44px] font-extrabold text-[#f7f6fb] font-heading tracking-[-0.03em] leading-[1.1]">
          {t('contact.title') || 'Let’s build something exceptional together.'}
        </h2>

        <p className="text-sm sm:text-base text-[#8b87a0] font-normal leading-relaxed max-w-xl">
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
              className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-[#8e97f7]/15 border border-white/10 hover:border-[#8e97f7]/50 text-[#8b87a0] hover:text-[#8e97f7] flex items-center justify-center transition-all duration-200 group"
            >
              <MailIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>

            <a
              href="https://www.linkedin.com/company/sparkstudio0"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
              className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-[#0A66C2]/15 border border-white/10 hover:border-[#0A66C2]/50 text-[#8b87a0] hover:text-[#0A66C2] flex items-center justify-center transition-all duration-200 group"
            >
              <LinkedInIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>

            <a
              href="https://teams.microsoft.com/l/chat/0/0?users=hello@thesparkstudio.digital"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Microsoft Teams"
              title="Microsoft Teams"
              className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-[#5059C9]/15 border border-white/10 hover:border-[#5059C9]/50 text-[#8b87a0] hover:text-[#7B83EB] flex items-center justify-center transition-all duration-200 group"
            >
              <TeamsIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>

            <a
              href="https://sparkstudio0.slack.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Slack"
              title="Slack"
              className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-[#ECB22E]/15 border border-white/10 hover:border-[#ECB22E]/50 text-[#8b87a0] hover:text-[#ECB22E] flex items-center justify-center transition-all duration-200 group"
            >
              <SlackIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>
          </div>
        </div>
      </div>

      {/* Right Column (Inquiry Card .framer-1u57rmh) */}
      <div className="w-full lg:w-[520px] rounded-2xl bg-[#1b1826] border border-white/10 p-7 sm:p-9 shadow-2xl flex flex-col gap-6">
        <div>
          <h3 className="font-heading font-semibold text-2xl text-[#f7f6fb] mb-1.5">
            {t('contact.cardTitle') || 'Project Inquiry'}
          </h3>
          <p className="text-sm text-[#8b87a0] font-normal">
            {t('contact.cardDesc') || 'Tell us about your brand, scope, and timeline.'}
          </p>
        </div>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#8e97f7]/15 border border-[#8e97f7]/30 flex items-center justify-center text-[#8e97f7]">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-xl text-[#f7f6fb] mb-1">
                {t('contact.successTitle') || 'Inquiry Received'}
              </h4>
              <p className="text-sm text-[#8b87a0] max-w-xs">
                {t('contact.success') || t('contact.successMessage') || 'Thank you! We have received your project details and will reply within 24 hours.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-2 text-xs font-mono text-[#8e97f7] hover:text-[#f7f6fb] transition-colors cursor-pointer"
            >
              {t('contact.sendAnother') || 'Send another message'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8b87a0] mb-2">
                {t('contact.formName') || 'Your Name'}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jane Doe"
                className="w-full px-4 py-3 rounded-xl bg-[#15131f] border border-white/10 text-sm text-[#f7f6fb] placeholder-[#8b87a0]/50 focus:outline-none focus:border-[#8e97f7] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8b87a0] mb-2">
                {t('contact.formEmail') || 'Email Address'}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jane@studio.com"
                className="w-full px-4 py-3 rounded-xl bg-[#15131f] border border-white/10 text-sm text-[#f7f6fb] placeholder-[#8b87a0]/50 focus:outline-none focus:border-[#8e97f7] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8b87a0] mb-2">
                  {t('contact.formType') || 'Service Needed'}
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#15131f] border border-white/10 text-sm text-[#f7f6fb] focus:outline-none focus:border-[#8e97f7] transition-colors"
                >
                  {typeOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#1b1826] text-[#f7f6fb]">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8b87a0] mb-2">
                  {t('contact.formBudget') || 'Budget'}
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#15131f] border border-white/10 text-sm text-[#f7f6fb] focus:outline-none focus:border-[#8e97f7] transition-colors"
                >
                  {budgetOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#1b1826] text-[#f7f6fb]">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8b87a0] mb-2">
                {t('contact.formMessage') || 'Project Overview'}
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={t('contact.formMessagePlaceholder') || 'Tell us about your brand, scope, and timeline goals...'}
                className="w-full px-4 py-3 rounded-xl bg-[#15131f] border border-white/10 text-sm text-[#f7f6fb] placeholder-[#8b87a0]/50 focus:outline-none focus:border-[#8e97f7] transition-colors resize-none"
              />
            </div>

            <MagneticButton className="w-full">
              <button
                type="submit"
                disabled={loading}
                className="framer-btn-primary mt-2 w-full py-3.5 rounded-full text-sm font-semibold text-white shadow-[0_10px_25px_-5px_rgba(108,79,232,0.4)] disabled:opacity-50 cursor-pointer"
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
