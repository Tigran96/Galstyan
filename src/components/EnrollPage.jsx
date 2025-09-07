import { useState, useEffect } from 'react';
import { Card } from './Card';
import { trackFormSubmission, trackEvent } from '../utils/analytics';
import { sendEnrollmentEmail } from '../services/emailService';

export const EnrollPage = ({ selectedPlan, CONFIG, lang, t, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    subject: '',
    studyLanguage: lang, // Default to current page language
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Get plan details
  const getPlanDetails = () => {
    if (!selectedPlan) return null;
    
    const pathParts = selectedPlan.split('.');
    const planData = pathParts.reduce((obj, key) => obj[key], CONFIG.pricing);
    
    const planType = pathParts[0]; // 'group' or 'private'
    const frequency = pathParts[1]; // 'weekly1', 'weekly2', 'weekly3'
    
    const lessonsPerWeek = frequency === 'weekly1' ? 1 : frequency === 'weekly2' ? 2 : 3;
    const lessonsPerMonth = lessonsPerWeek * 4;
    
    return {
      type: planType,
      frequency,
      lessonsPerWeek,
      lessonsPerMonth,
      price: planData,
      typeName: planType === 'group' 
        ? (lang === "hy" ? "Խմբակային" : lang === "en" ? "Group" : "Группа")
        : (lang === "hy" ? "Անհատական" : lang === "en" ? "Private" : "Индивидуальные")
    };
  };

  const planDetails = getPlanDetails();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Create detailed enrollment data
      const enrollmentData = {
        // Student Information
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        subject: formData.subject,
        studyLanguage: formData.studyLanguage,
        message: formData.message,
        
        // Plan Details
        selectedPlan: selectedPlan,
        planType: planDetails?.typeName,
        lessonsPerWeek: planDetails?.lessonsPerWeek,
        lessonsPerMonth: planDetails?.lessonsPerMonth,
        
        // Pricing Information
        priceAMD: planDetails?.price.amd,
        priceUSD: planDetails?.price.usd,
        priceRUB: planDetails?.price.rub,
        formattedPrice: formatPrice(selectedPlan, lang),
        
        // Additional Details
        language: lang,
        source: 'enroll_page',
        enrollmentDate: new Date().toLocaleDateString(),
        enrollmentTime: new Date().toLocaleTimeString(),
      };

      // Create detailed email message
      const detailedMessage = `
ENROLLMENT DETAILS:
==================

STUDENT INFORMATION:
- Name: ${formData.firstName} ${formData.lastName}
- Email: ${formData.email}
- Phone: ${formData.phone}
- Subject: ${formData.subject || 'Not selected'}
- Study Language: ${formData.studyLanguage === 'hy' ? 'Armenian' : formData.studyLanguage === 'en' ? 'English' : 'Russian'}
- Page Language: ${lang === 'hy' ? 'Armenian' : lang === 'en' ? 'English' : 'Russian'}

SELECTED PLAN:
- Type: ${planDetails?.typeName}
- Frequency: ${planDetails?.lessonsPerWeek} lessons per week
- Monthly Lessons: ${planDetails?.lessonsPerMonth} lessons
- Price: ${formatPrice(selectedPlan, lang)} (${planDetails?.price.amd} AMD / $${planDetails?.price.usd} USD / ₽${planDetails?.price.rub} RUB)

ENROLLMENT INFO:
- Date: ${new Date().toLocaleDateString()}
- Time: ${new Date().toLocaleTimeString()}
- Source: Website Enrollment Page

${formData.message ? `ADDITIONAL MESSAGE:\n${formData.message}` : ''}

Please contact the student to confirm the enrollment and schedule the first lesson.
      `.trim();

      // Send email using EmailJS
      console.log('Sending enrollment email...', enrollmentData);
      
      const emailResult = await sendEnrollmentEmail(enrollmentData);
      
      if (emailResult.success) {
        setSubmitStatus('success');
        trackFormSubmission('enroll_form');
        trackEvent('form_success', { 
          form_type: 'enroll', 
          plan_type: planDetails?.type,
          plan_frequency: planDetails?.frequency 
        });
        setFormData({ firstName: '', lastName: '', phone: '', email: '', subject: '', studyLanguage: lang, message: '' });
        console.log('Email sent successfully!', emailResult.result);
      } else {
        setSubmitStatus('error');
        trackEvent('form_error', { form_type: 'enroll', error: emailResult.message });
        console.error('Email failed:', emailResult.error);
      }
      
      // TODO: Uncomment when Formspree is set up
      /*
      const formDataToSend = new FormData();
      Object.keys(enrollmentData).forEach(key => {
        formDataToSend.append(key, enrollmentData[key]);
      });
      formDataToSend.append('_subject', `New Enrollment: ${formData.firstName} ${formData.lastName} - ${planDetails?.typeName} ${planDetails?.lessonsPerWeek} lessons/week`);
      formDataToSend.append('_replyto', formData.email);
      formDataToSend.append('_cc', CONFIG.email);
      formDataToSend.append('detailedMessage', detailedMessage);

      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitStatus('success');
        trackFormSubmission('enroll_form');
        trackEvent('form_success', { 
          form_type: 'enroll', 
          plan_type: planDetails?.type,
          plan_frequency: planDetails?.frequency 
        });
        setFormData({ firstName: '', lastName: '', phone: '', email: '', subject: '', studyLanguage: lang, message: '' });
      } else {
        setSubmitStatus('error');
        trackEvent('form_error', { form_type: 'enroll', error: 'submission_failed' });
      }
      */
      
    } catch (error) {
      setSubmitStatus('error');
      trackEvent('form_error', { form_type: 'enroll', error: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (pricePath, lang) => {
    const pathParts = pricePath.split('.');
    const prices = pathParts.reduce((obj, key) => obj[key], CONFIG.pricing);
    
    switch(lang) {
      case 'hy': return `֏${prices.amd.toLocaleString()}`;
      case 'en': return `$${prices.usd}`;
      case 'ru': return `₽${prices.rub.toLocaleString()}`;
      default: return `֏${prices.amd.toLocaleString()}`;
    }
  };

  if (!planDetails) {
    return (
      <div className="min-h-screen bg-sky-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">No plan selected</div>
          <button 
            onClick={onBack}
            className="px-6 py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors"
          >
            {lang === "hy" ? "Վերադառնալ" : lang === "en" ? "Go Back" : "Назад"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600/10 to-indigo-500/10 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-sky-200 hover:text-white transition-colors"
            >
              <span>←</span>
              <span>{lang === "hy" ? "Վերադառնալ" : lang === "en" ? "Back to Plans" : "Назад к планам"}</span>
            </button>
            <div className="text-sm text-sky-200">
              {lang === "hy" ? "Գրանցում" : lang === "en" ? "Enrollment" : "Запись"}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Selected Plan Summary */}
        <Card CONFIG={CONFIG} className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">
              {lang === "hy" ? "Ընտրված պլան" : lang === "en" ? "Selected Plan" : "Выбранный план"}
            </h1>
            <div className="bg-white/5 rounded-xl p-6">
              {/* Plan Type Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500/20 to-indigo-400/20 border border-sky-500/30 mb-4">
                <span className="text-2xl">
                  {planDetails.type === 'group' ? '👥' : '👤'}
                </span>
                <span className="text-lg font-semibold text-sky-200">
                  {planDetails.typeName}
                </span>
              </div>
              
              {/* Plan Details */}
              <div className="text-2xl font-semibold text-white mb-2">
                {planDetails.lessonsPerWeek} {lang === "hy" ? "դաս/շաբաթ" : lang === "en" ? "lesson/week" : "урок/неделя"}
              </div>
              <div className="text-4xl font-bold text-sky-400 mb-2">
                {formatPrice(selectedPlan, lang)}
              </div>
              <div className="text-sky-200">
                {lang === "hy" ? "ամսական" : lang === "en" ? "monthly" : "месячно"} • {planDetails.lessonsPerMonth} {lang === "hy" ? "դաս" : lang === "en" ? "lessons" : "уроков"}
              </div>
              
              {/* Plan Type Description */}
              <div className="mt-4 text-sm text-sky-300">
                {planDetails.type === 'group' ? (
                  lang === "hy" ? "Փոքր խմբեր մինչև 8 ուսանող" :
                  lang === "en" ? "Small groups up to 8 students" :
                  "Малые группы до 8 учеников"
                ) : (
                  lang === "hy" ? "Անհատական պլան և ճկուն գրաֆիկ" :
                  lang === "en" ? "Personal plan and flexible schedule" :
                  "Личный план и гибкий график"
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Enrollment Form */}
        <Card CONFIG={CONFIG}>
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            {lang === "hy" ? "Գրանցման ձև" : lang === "en" ? "Enrollment Form" : "Форма записи"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-sky-200 mb-2">
                  {lang === "hy" ? "Անուն" : lang === "en" ? "First Name" : "Имя"} *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder:text-sky-400 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-sky-500/50 transition-all"
                  placeholder={lang === "hy" ? "Արթուր" : lang === "en" ? "Arthur" : "Артур"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sky-200 mb-2">
                  {lang === "hy" ? "Ազգանուն" : lang === "en" ? "Last Name" : "Фамилия"} *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder:text-sky-400 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-sky-500/50 transition-all"
                  placeholder={lang === "hy" ? "Ավագյան" : lang === "en" ? "Avagyan" : "Авагян"}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-sky-200 mb-2">
                  {lang === "hy" ? "Հեռախոս" : lang === "en" ? "Phone Number" : "Телефон"} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder:text-sky-400 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-sky-500/50 transition-all"
                  placeholder="+374 94 123 456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sky-200 mb-2">
                  {lang === "hy" ? "Էլ-փոստ" : lang === "en" ? "Email" : "Email"} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder:text-sky-400 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-sky-500/50 transition-all"
                  placeholder="arthur.avagyan@gmail.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-sky-200 mb-2">
                  {lang === "hy" ? "Առարկա" : lang === "en" ? "Subject" : "Предмет"} *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-sky-500/50 transition-all [&>option]:bg-sky-900 [&>option]:text-white"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" className="bg-sky-900 text-white">{lang === "hy" ? "Ընտրեք առարկա" : lang === "en" ? "Select subject" : "Выберите предмет"}</option>
                  <option value="math" className="bg-sky-900 text-white">{lang === "hy" ? "Մաթեմատիկա" : lang === "en" ? "Mathematics" : "Математика"}</option>
                  <option value="physics" className="bg-sky-900 text-white">{lang === "hy" ? "Ֆիզիկա" : lang === "en" ? "Physics" : "Физика"}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-sky-200 mb-2">
                  {lang === "hy" ? "Ուսուցման լեզու" : lang === "en" ? "Study Language" : "Язык обучения"} *
                </label>
                <select
                  name="studyLanguage"
                  value={formData.studyLanguage}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-sky-500/50 transition-all [&>option]:bg-sky-900 [&>option]:text-white"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="hy" className="bg-sky-900 text-white">🇦🇲 Հայերեն (Armenian)</option>
                  <option value="en" className="bg-sky-900 text-white">🇬🇧 English</option>
                  <option value="ru" className="bg-sky-900 text-white">🇷🇺 Русский (Russian)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-sky-200 mb-2">
                {lang === "hy" ? "Հաղորդագրություն (ընտրովի)" : lang === "en" ? "Message (Optional)" : "Сообщение (необязательно)"}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder:text-sky-400 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-sky-500/50 transition-all"
                placeholder={lang === "hy" ? "Գրեք ձեր հարցերը կամ նախընտրությունները..." : 
                          lang === "en" ? "Write your questions or preferences..." : 
                          "Напишите ваши вопросы или предпочтения..."}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-indigo-400 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-sky-500/20 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isSubmitting ? (
                <>
                  <div className="spinner mr-3"></div>
                  {lang === "hy" ? "Ուղարկվում է..." : lang === "en" ? "Submitting..." : "Отправляется..."}
                </>
              ) : (
                lang === "hy" ? "Գրանցվել" : lang === "en" ? "Enroll Now" : "Записаться"
              )}
            </button>

            {submitStatus === 'success' && (
              <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-green-400 mb-2">
                  ✅ {lang === "hy" ? "Գրանցումը հաջողությամբ ավարտվեց!" : 
                     lang === "en" ? "Enrollment successful!" : 
                     "Запись успешна!"}
                </p>
                <p className="text-green-300 text-sm">
                  {lang === "hy" ? "Մենք կկապվենք ձեզ հետ շուտով:" : 
                   lang === "en" ? "We'll contact you soon to confirm your enrollment." : 
                   "Мы свяжемся с вами в ближайшее время для подтверждения записи."}
                </p>
                <p className="text-green-200 text-xs mt-2">
                  {lang === "hy" ? "Գրանցման մանրամասները տպվել են կոնսոլում:" : 
                   lang === "en" ? "Enrollment details logged to console for testing." : 
                   "Детали записи записаны в консоль для тестирования."}
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400">
                  ❌ {lang === "hy" ? "Սխալ գրանցման ժամանակ: Խնդրում ենք փորձել կրկին:" : 
                     lang === "en" ? "Error during enrollment. Please try again." : 
                     "Ошибка при записи. Пожалуйста, попробуйте снова."}
                </p>
              </div>
            )}

            <div className="text-xs text-sky-200 text-center space-y-2">
              <p>
                {lang === "hy" ? "Գրանցվելով, դուք համաձայնվում եք կապվել ձեզ հետ ձեր հարցման մասին:" : 
                 lang === "en" ? "By enrolling, you agree to be contacted about your request." : 
                 "Записываясь, вы соглашаетесь на связь с вами по вашему запросу."}
              </p>
              <p className="text-sky-300">
                {lang === "hy" ? "Մենք կստանանք ձեր գրանցման մանրամասները էլ.փոստով և կկապվենք ձեզ հետ:" : 
                 lang === "en" ? "We will receive your enrollment details via email and contact you." : 
                 "Мы получим детали вашей записи по электронной почте и свяжемся с вами."}
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
