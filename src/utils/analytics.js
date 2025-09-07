// Simple analytics utility
// Replace with your preferred analytics service (Google Analytics, Plausible, etc.)

export const trackEvent = (eventName, properties = {}) => {
  // Google Analytics 4 example
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, properties);
  }
  
  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, properties);
  }
};

export const trackPageView = (pageName) => {
  trackEvent('page_view', {
    page_title: pageName,
    page_location: window.location.href
  });
};

export const trackFormSubmission = (formName) => {
  trackEvent('form_submit', {
    form_name: formName
  });
};

export const trackLanguageChange = (language) => {
  trackEvent('language_change', {
    language: language
  });
};

export const trackContactClick = (method) => {
  trackEvent('contact_click', {
    contact_method: method
  });
};
