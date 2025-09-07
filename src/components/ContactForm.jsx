import { useState } from 'react';
import { Card } from './Card';
import { trackFormSubmission, trackEvent, trackContactClick } from '../utils/analytics';
import { sendContactEmail } from '../services/emailService';

export const ContactForm = ({ t, CONFIG, lang }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formData = new FormData(e.target);
      const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        course: formData.get('course'),
        format: formData.get('format'),
        time: formData.get('time'),
        message: formData.get('message'),
        source: formData.get('source'),
        language: formData.get('language')
      };

      const result = await sendContactEmail(contactData);

      if (result.success) {
        setSubmitStatus('success');
        e.target.reset();
        trackFormSubmission('contact_form');
        trackEvent('form_success', { form_type: 'contact' });
      } else {
        setSubmitStatus('error');
        trackEvent('form_error', { form_type: 'contact', error: result.message });
      }
    } catch (error) {
      setSubmitStatus('error');
      trackEvent('form_error', { form_type: 'contact', error: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="md:col-span-2">
      <form
        onSubmit={handleSubmit}
        className={`grid grid-cols-1 gap-4 rounded-2xl ${CONFIG.color.card} p-6 ring-1 ring-white/10`}
      >
        <input type="hidden" name="source" value="website" />
        <input type="hidden" name="language" value={lang} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-sky-200">{t("enroll.form.name")}</label>
            <input
              name="name"
              required
              className="w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder:text-sky-400 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-sky-500/50 transition-all"
              placeholder={t("enroll.form.placeholders.name")}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-sky-200">{t("enroll.form.email")}</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder:text-sky-400 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-sky-500/50 transition-all"
              placeholder={t("enroll.form.placeholders.email")}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-sm text-sky-200">{t("enroll.form.course")}</label>
            <select 
              name="course" 
              className="w-full rounded-xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-sky-500/50 transition-all"
            >
              {t("enroll.form.courseOptions").map((o, i) => (
                <option key={i} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-sky-200">{t("enroll.form.format")}</label>
            <select 
              name="format" 
              className="w-full rounded-xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-sky-500/50 transition-all"
            >
              {t("enroll.form.formatOptions").map((o, i) => (
                <option key={i} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-sky-200">{t("enroll.form.time")}</label>
            <input 
              name="time" 
              placeholder={t("enroll.form.placeholders.time")} 
              className="w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder:text-sky-400 ring-1 ring-white/10 focus:ring-2 focus:ring-sky-500/50 transition-all" 
            />
          </div>
        </div>
        
        <div>
          <label className="mb-1 block text-sm text-sky-200">{t("enroll.form.message")}</label>
          <textarea
            name="message"
            rows={5}
            required
            className="w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder:text-sky-400 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-sky-500/50 transition-all"
            placeholder={t("enroll.form.placeholderMsg")}
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-indigo-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {isSubmitting ? 'Sending...' : t("enroll.form.submit")}
        </button>
        
        {submitStatus === 'success' && (
          <p className="text-sm text-green-400">✅ Message sent successfully! We'll get back to you soon.</p>
        )}
        {submitStatus === 'error' && (
          <p className="text-sm text-red-400">❌ Error sending message. Please try again or contact us directly.</p>
        )}
        
        <p className="text-xs text-sky-200">By submitting, you agree to be contacted about your request.</p>
      </form>
    </div>
  );
};
