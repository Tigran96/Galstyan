import emailjs from '@emailjs/browser';

// EmailJS configuration
const SERVICE_ID = 'service_2e1aiqm'; // Replace with your EmailJS service ID
const TEMPLATE_ID = 'template_4mez5m9'; // Replace with your EmailJS template ID
const PUBLIC_KEY = 'wqqU-EPc69HC3t9U8'; // Replace with your EmailJS public key

export const sendEnrollmentEmail = async (enrollmentData) => {
  try {
    // Initialize EmailJS
    emailjs.init(PUBLIC_KEY);

    // Prepare email data
    const templateParams = {
      to_email: 'maratgalstyan1967@gmail.com', // Your email
      from_name: `${enrollmentData.firstName} ${enrollmentData.lastName}`,
      from_email: enrollmentData.email,
      phone: enrollmentData.phone,
      subject: enrollmentData.subject,
      study_language: enrollmentData.studyLanguage,
      plan_type: enrollmentData.planType,
      lessons_per_week: enrollmentData.lessonsPerWeek,
      lessons_per_month: enrollmentData.lessonsPerMonth,
      price_amd: enrollmentData.priceAMD,
      price_usd: enrollmentData.priceUSD,
      price_rub: enrollmentData.priceRUB,
      formatted_price: enrollmentData.formattedPrice,
      message: enrollmentData.message || 'No additional message',
      enrollment_date: enrollmentData.enrollmentDate,
      enrollment_time: enrollmentData.enrollmentTime,
      page_language: enrollmentData.language,
      
      // Detailed message for email body
      detailed_message: `
ENROLLMENT DETAILS:
==================

STUDENT INFORMATION:
- Name: ${enrollmentData.firstName} ${enrollmentData.lastName}
- Email: ${enrollmentData.email}
- Phone: ${enrollmentData.phone}
- Subject: ${enrollmentData.subject || 'Not selected'}
- Study Language: ${enrollmentData.studyLanguage === 'hy' ? 'Armenian' : enrollmentData.studyLanguage === 'en' ? 'English' : 'Russian'}
- Page Language: ${enrollmentData.language === 'hy' ? 'Armenian' : enrollmentData.language === 'en' ? 'English' : 'Russian'}

SELECTED PLAN:
- Type: ${enrollmentData.planType}
- Frequency: ${enrollmentData.lessonsPerWeek} lessons per week
- Monthly Lessons: ${enrollmentData.lessonsPerMonth} lessons
- Price: ${enrollmentData.formattedPrice} (${enrollmentData.priceAMD} AMD / $${enrollmentData.priceUSD} USD / ₽${enrollmentData.priceRUB} RUB)

ENROLLMENT INFO:
- Date: ${enrollmentData.enrollmentDate}
- Time: ${enrollmentData.enrollmentTime}
- Source: Website Enrollment Page

${enrollmentData.message ? `ADDITIONAL MESSAGE:\n${enrollmentData.message}` : ''}

Please contact the student to confirm the enrollment and schedule the first lesson.
      `.trim()
    };

    // Send email
    const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    
    return {
      success: true,
      message: 'Email sent successfully',
      result
    };
  } catch (error) {
    console.error('EmailJS Error:', error);
    return {
      success: false,
      message: 'Failed to send email',
      error: error.message
    };
  }
};

// Contact form email service
export const sendContactEmail = async (contactData) => {
  try {
    // Initialize EmailJS
    emailjs.init(PUBLIC_KEY);

    // Prepare email data for contact form
    const templateParams = {
      to_email: 'maratgalstyan1967@gmail.com', // Your email
      from_name: contactData.name,
      from_email: contactData.email,
      course: contactData.course || 'Not specified',
      format: contactData.format || 'Not specified',
      time: contactData.time || 'Not specified',
      message: contactData.message,
      source: contactData.source || 'website',
      language: contactData.language || 'en',
      contact_date: new Date().toLocaleDateString(),
      contact_time: new Date().toLocaleTimeString(),
      
      // Detailed message for email body
      detailed_message: `
CONTACT FORM SUBMISSION:
========================

CONTACT INFORMATION:
- Name: ${contactData.name}
- Email: ${contactData.email}
- Course Interest: ${contactData.course || 'Not specified'}
- Format Preference: ${contactData.format || 'Not specified'}
- Preferred Time: ${contactData.time || 'Not specified'}
- Page Language: ${contactData.language === 'hy' ? 'Armenian' : contactData.language === 'en' ? 'English' : 'Russian'}

MESSAGE:
${contactData.message}

SUBMISSION INFO:
- Date: ${new Date().toLocaleDateString()}
- Time: ${new Date().toLocaleTimeString()}
- Source: ${contactData.source || 'Website Contact Form'}

Please respond to this inquiry as soon as possible.
      `.trim()
    };

    // Send email using the same service but different template
    const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    
    return {
      success: true,
      message: 'Contact email sent successfully',
      result
    };
  } catch (error) {
    console.error('EmailJS Contact Error:', error);
    return {
      success: false,
      message: 'Failed to send contact email',
      error: error.message
    };
  }
};

// Test function to verify EmailJS setup
export const testEmailService = async () => {
  const testData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+374 94 123 456',
    subject: 'math',
    studyLanguage: 'en',
    planType: 'Group Lessons',
    lessonsPerWeek: 2,
    lessonsPerMonth: 8,
    priceAMD: 35000,
    priceUSD: 91,
    priceRUB: 9100,
    formattedPrice: '$91',
    message: 'Test enrollment',
    enrollmentDate: new Date().toLocaleDateString(),
    enrollmentTime: new Date().toLocaleTimeString(),
    language: 'en'
  };

  return await sendEnrollmentEmail(testData);
};
