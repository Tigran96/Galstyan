// GalstyanSchool Landing Page — React + Tailwind with i18n (HY • EN • RU)
// Improved version with better component structure, SEO, and UX

import { useState, useEffect, Fragment } from "react";
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Section } from './components/Section';
import { Feature } from './components/Feature';
import { PricingCard } from './components/PricingCard';
import { PricingAccordion } from './components/PricingAccordion';
import { EnrollPage } from './components/EnrollPage';
import { FAQItem } from './components/FAQItem';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { Card } from './components/Card';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Chat } from './components/Chat';
import { ChatButton } from './components/ChatButton';
import { LoginPage } from './page/LoginPage';
import { SignUpPage } from './page/SignUpPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { ProfilePage } from './components/ProfilePage';
import { MessagesPage } from './components/MessagesPage';
import { NotificationsPage } from './components/NotificationsPage';
import { ForumPage } from './page/ForumPage';
import { ForumThreadPage } from './components/ForumThreadPage';
import { NewThreadPage } from './components/NewThreadPage';
import { TeachersPage } from './page/TeachersPage';
import { PrivacyPolicyPage } from './page/PrivacyPolicyPage';
import AdminMembersPage from './components/AdminMembersPage';
import { trackContactClick, trackPageView } from './utils/analytics';
import { detectUserLanguage, isLocationDetectionSupported } from './utils/locationService';
import { Helmet } from "react-helmet-async";
import { getMe } from './services/authService';
import { getMyNotifications } from './services/notificationService';
import { getSupportUnreadCount } from './services/supportService';
import { ContactSection } from "./components/ContactSection";

const CONFIG = {
  businessName: {
    hy: "Գալստյան Ակադեմիա",
    en: "Galstyan Academy",
    ru: "Академия Галстяна",
  },
  owner: {
    name: {
      hy: "Մարատ Գալստյան",
      en: "Marat Galstyan",
      ru: "Марат Галստян",
    },
    photo: "./owner.jpg",
  },
  teachers: [
    {
      id: "marat",
      name: {
        hy: "Մարատ Գալստյան",
        en: "Marat Galstyan",
        ru: "Марат Галстян",
      },
      photo: "./owner.jpg",
      role: {
        hy: "Հիմնադիր",
        en: "Founder",
        ru: "Основатель",
      },
      specialties: {
        hy: ["Մաթեմատիկա", "Ֆիզիկա"],
        en: ["Mathematics", "Physics"],
        ru: ["Математика", "Физика"],
      },
      experience: {
        hy: "30+ տարի փորձ",
        en: "30+ years experience",
        ru: "30+ лет опыта",
      },
      bio: {
        hy: "30+ տարվա փորձ ուսանողների պատրաստման և ակադեմիական հաջողության ապահովման բնագավառում։ Մարատ Գալստյանը կրթության մեջ տեսնում է ապագայի հիմքը և հավատում, որ ամեն ուսանող կարող է հասնել բարձունքների՝ ճիշտ ղեկավարության և աջակցության դեպքում։ Նրա աշխատանքը հիմնված է անհատական մոտեցման վրա՝ ամեն ուսանողի հետ աշխատելիս նրա ուժեղ և թույլ կողմերը բացահայտելու և դրանց հիման վրա կառուցել հետագա աշխատանքի անհատական պլանը։ Նպատակը պարզ է՝ ոչ միայն գիտելիքներ փոխանցել, այլև ներշնչել սովորելու արվեստը և ինքնավստահությունը։",
        en: "30+ years of experience in student preparation and ensuring academic success. Marat Galstyan sees education as the foundation of the future and believes that every student can reach great heights with the right guidance and support. His approach is based on individual attention to each student, working to discover their strengths and weaknesses and building upon them. The goal is clear: not just to transfer knowledge, but to inspire a love of learning and confidence.",
        ru: "30+ лет опыта в подготовке студентов и обеспечении академических успехов. Марат Галстян видит в образовании основу будущего и верит, что каждый студент может достичь больших высот при правильном руководстве и поддержке. Его подход основан на индивидуальном внимании к каждому ученику, работе по выявлению их сильных и слабых сторон и опоре на них. Цель ясна: не просто передать знания, а вдохновить на любовь к учебе и уверенность в себе.",
      },
    },
    {
      id: "armen",
      name: {
        hy: "Արմեն Սարդարյան",
        en: "Armen Sardaryan",
        ru: "Армен Сардарян",
      },
      photo: "./armen-sardaryan.jpg",
      role: {
        hy: "Մաթեմատիկայի ուսուցիչ",
        en: "Mathematics Teacher",
        ru: "Преподаватель математики",
      },
      specialties: {
        hy: ["Մաթեմատիկա", "SAT", "GRE", "GMAT", "Անգլերեն"],
        en: ["Mathematics", "SAT", "GRE", "GMAT", "English"],
        ru: ["Математика", "SAT", "GRE", "GMAT", "Английский"],
      },
      experience: {
        hy: "15+ տարի փորձ",
        en: "15+ years experience",
        ru: "15+ лет опыта",
      },
      bio: {
        hy: "Արմեն Սարդարյանը ունի դասավանդման ավելի քան 15 տարվա փորձառություն։ Հիմնականում դասավանդել է մաթեմատիկա՝ անգլերեն լեզվով։ Ունեցել է մեծ փորձ SAT թեսթերին պատրաստելու, ինչպես նաև GRE և GMAT ստանդարտ ամերիկյան թեսթերի պատրաստման պարապմունքների։ Ունի բազային մաթեմատիկական կրթություն և անգլերենին տիրապետում է գերազանց։ Ուսանել է ԱՄՆ-ում (CMU համալսարան, Միչիգանի նահանգ) տնտեսագիտություն և պաշտպանել մագիստրոսի թեզ։ Ուսանելու տարիների աշխատել է որպես ինստրուկտոր և բակալավրիատի ուսանողներին ուսուցանել է տնտեսագիտության մաթեմատիկական մոդելներ։ Ներկայումս դասավանդում է մաթեմատիկա՝ Բրիտանական Միջազգային Դպրոցում և ղեկավարում է Հայաստանում եզակի իր բնույթով գիտական հիմնադրամ (CSIE)։ Արմեն Սարդարյանը հետաքրքրված է Գալստյան Ակադեմիայում պարապմունքներով։ Նախընտրելի է SAT, GRE և այլ թեսթերի պարապմունեքներ, որտեղ նա ունի հաջողված պատմություն։",
        en: "Armen Sardaryan has over 15 years of teaching experience. He has mainly taught mathematics in English. He has extensive experience preparing students for SAT tests, as well as GRE and GMAT standardized American tests. He has a solid mathematical education and excellent proficiency in English. He studied economics in the USA (CMU University, Michigan) and has a master's degree. During his studies, he worked as an instructor and taught undergraduate students mathematical models in economics. Currently, he teaches mathematics at the British International School and heads a unique scientific foundation (CSIE) in Armenia. Armen Sardaryan is interested in conducting courses at Galstyan Academy. He prefers SAT, GRE and other test preparation courses where he has a successful track record.",
        ru: "Армен Сардарян имеет более 15 лет преподавательского опыта. В основном он преподавал математику на английском языке. Он имеет большой опыт подготовки к тестам SAT, а также GRE и GMAT - стандартизированным американским тестам. Он имеет базовое математическое образование и отлично владеет английским языком. Он изучал экономику в США (университет CMU, штат Мичиган) и имеет степень магистра. Во время учебы он работал преподавателем и преподавал студентам бакалавриата математические модели в экономике. В настоящее время он преподает математику в Британской международной школе и возглавляет уникальный научный фонд (CSIE) в Армении. Армен Сардарян заинтересован в проведении курсов в Академии Галстяна. Он предпочитает курсы по подготовке к SAT, GRE и другим тестам, где у него успешный опыт.",
      },
    },
  ],
  logo: "./logo.png",
  phone: "+374 (94) 766-409",
  email: "maratgalstyan1967@gmail.com",
  address: {
    hy: "Երևան, Հայաստան",
    en: "Yerevan, Armenia",
    ru: "Ереван, Армения",
  },
  social: {
    facebook: "https://www.facebook.com/galstyanacademy",
    instagram: "https://www.instagram.com/galstyanacademy/",
  },
  color: {
    bg: "bg-sky-950",
    card: "bg-sky-900",
    text: "text-white",
    subtext: "text-sky-200",
    accent: "from-sky-500 to-indigo-400",
    ring: "ring-sky-500/30",
  },
  pricing: {
    group: {
      weekly1: {
        amd: 25000,
        rub: 6500, // ~1 AMD = 0.26 RUB
        usd: 65,   // ~1 AMD = 0.0026 USD
        lessons: 1,
      },
      weekly2: {
        amd: 45000,
        rub: 11700, // ~1 AMD = 0.26 RUB
        usd: 117,   // ~1 AMD = 0.0026 USD
        lessons: 2,
      },
      weekly3: {
        amd: 65000,
        rub: 16900, // ~1 AMD = 0.26 RUB
        usd: 169,   // ~1 AMD = 0.0026 USD
        lessons: 3,
      },
    },
    popular: {
      daily: {
        amd: 9000,
        rub: 2340, // ~1 AMD = 0.26 RUB
        usd: 23,   // ~1 AMD = 0.0026 USD
        tasks: 5,
        popular: true,
      },
    },
    private: {
      weekly1: {
        amd: 40000,
        rub: 10400, // ~1 AMD = 0.26 RUB
        usd: 104,   // ~1 AMD = 0.0026 USD
        lessons: 1,
      },
      weekly2: {
        amd: 70000,
        rub: 18200, // ~1 AMD = 0.26 RUB
        usd: 182,   // ~1 AMD = 0.0026 USD
        lessons: 2,
      },
      weekly3: {
        amd: 100000,
        rub: 26000, // ~1 AMD = 0.26 RUB
        usd: 260,   // ~1 AMD = 0.0026 USD
        lessons: 3,
      },
    },
  },
};

// --- Translations ---
const I18N = {
  hy: {
    banner: "✨ Անվճար փորձնական դաս նոր ուսանողների համար — գրանցվեք այսօր",
    admin: {
      members: {
        title: "Անդամներ",
        search: "Որոնել…",
        count: "Քանակ",
        username: "Օգտանուն",
        email: "Էլ. փոստ",
        role: "Դեր",
        actions: "Գործողություններ",
        message: "Գրել",
        sendTo: "Ուղարկել՝",
        cancel: "Չեղարկել",
        save: "Պահպանել",
        saving: "Պահպանվում է…",
        name: "Անուն",
        age: "Տարիք",
        phone: "Հեռախոս",
        grade: "Դասարան",
        created: "Ստեղծվել է",
        empty: "Օգտատերեր չեն գտնվել։",
      },
      roles: {
        admin: "Ադմին",
        moderator: "Մոդերատոր",
        pro: "Pro",
        user: "Օգտատեր",
      },
    },
    nav: {
      courses: "Դասընթացներ",
      teachers: "Ուսուցիչներ",
      pricing: "Գնացուցակ",
      faq: "ՀՏՀ",
      contact: "Կապ",
      forum: "Ֆորում",
    },
    hero: {
      badge: "",
      tagline: "Սովորի՛ր, Զարգացի՛ր, Հաջողի՛ր",
      subtitle:
        "Բարձրորակ դասեր մաթեմատիկա և ֆիզիկա բոլոր մակարդակների համար։",
      subtitleLink: "Իմացեք ավելին",
      primary: "Միացիր դասընթացներին",
      secondary: "Դասընթացներ",
      teachers: "Ուսուցիչներ",
      or: "կամ",
      smalls: [
        "🎯 Փոքր խմբեր և անհատական",
        "📐 Մաթեմատիկա բոլոր մակարդակների համար",
        "⚗️ Ֆիզիկա՝ տեսություն և պրակտիկա",
      ],
    },
    courses: {
      title: "Մեր դասընթացները",
      subtitle: "Հիմնական առարկաներ՝ ամուր հիմք ստեղծելու համար։",
      comingSoon: "Շուտով",
      cta: "Պատրա՞ստ եք սկսել ձեր ուսուցման ճանապարհը:",
      ctaLink1: "Դիտեք մեր գնացուցակը",
      ctaLink2: "իմացեք մեր հիմնադրի մասին",
      items: [
        {
          icon: "➗",
          title: "Մաթեմատիկա",
          desc:
            "Հանրահաշիվ, երկրաչափություն, եռանկյունաչափություն, թվաբանություն, խնդիրների լուծում, օլիմպիադա։",
        },
        {
          icon: "🧲",
          title: "Ֆիզիկա",
          desc:
            "Մեխանիկա, էլեկտրամագնիսականություն, օպտիկա, փորձեր և գործնական մտածողություն։",
        },
        {
          icon: "⚗️",
          title: "Քիմիա",
          desc: "Շուտով - օրգանական և անօրգանական քիմիա, լաբորատորիա։",
          disabled: true,
        },
        {
          icon: "🧬",
          title: "Կենսաբանություն",
          desc: "Շուտով - բջջային կենսաբանություն, գենետիկա, էկոլոգիա։",
          disabled: true,
        },
        {
          icon: "🇬🇧",
          title: "Անգլերեն",
          desc: "Շուտով - քերականություն, խոսակցություն, գրավոր արտահայտություն։",
          disabled: true,
        },
        {
          icon: "📝",
          title: "SAT/GRE/GMAT",
          desc: "Ամերիկյան ստանդարտ թեսթերի պատրաստում - մաթեմատիկա անգլերենով։",
          disabled: false,
        },
      ],
    },
    teachers: {
      title: "Մեր ուսուցիչները",
      subtitle: "Փորձառու ուսուցիչներ՝ հստակության, պրակտիկայի և արդյունքների վրա կենտրոնացած։",
      cta: "Պատրա՞ստ եք սովորել մեր ուսուցիչների հետ:",
      ctaLink1: "Դիտեք մեր դասընթացները",
      ctaLink2: "կապվեք մեզ հետ",
    },
    results: {
      title: "Արդյունքներ, որոնք կարող եք սպասել",
      subtitle: "Շոշափելի առաջընթաց՝ մի քանի շաբաթում",
      cta: "Ցանկանու՞մ եք հասնել նման արդյունքների:",
      ctaLink1: "Ստուգեք մեր գնացուցակը",
      ctaLink2: "կապվեք մեզ հետ",
      ctaEnd: "ավելի մանրամասն տեղեկությունների համար:",
      kpis: [
        { kpi: "+2x", label: "Տնայինների կատարում և վստահություն" },
        { kpi: "−30%", label: "Սխալների նվազում թեստերում" },
        { kpi: "+1–2", label: "Գնահատականի աճ մեկ քառորդ ուսումնական տարվա ընթացքում" },
      ],
    },
    pricing: {
      title: "Ամսական գնացուցակ",
      subtitle: "Պարզ և թափանցիկ ամսական պլաններ",
      groupTiers: [
        {
          name: "Խմբակային - 1 դաս/շաբաթ",
          price: "group.weekly1",
          period: "ամսական",
          features: ["Մինչև 5 ուսանող", "4 դաս ամսական", "Վարժություններ", "Շաբաթական արձագանք"],
          cta: "Ընտրել պլան",
        },
        {
          name: "Խմբակային - 2 դաս/շաբաթ",
          price: "group.weekly2",
          period: "ամսական",
          features: ["Մինչև 5 ուսանող", "8 դաս ամսական", "Վարժություններ", "Շաբաթական արձագանք"],
          cta: "Ընտրել պլան",
        },
        {
          name: "Խմբակային - 3 դաս/շաբաթ",
          price: "group.weekly3",
          period: "ամսական",
          features: ["Մինչև 5 ուսանող", "12 դաս ամսական", "Վարժություններ", "Շաբաթական արձագանք"],
          cta: "Ընտրել պլան",
        },
      ],
      popularTiers: [
        {
          name: "⭐ Ծնողների պլան",
          price: "popular.daily",
          period: "ամսական",
          features: ["5 խնդիր օրական", "Առցանց աջակցություն"],
          cta: "Ընտրել պլան",
          popular: true,
        },
      ],
      privateTiers: [
        {
          name: "Անհատական - 1 դաս/շաբաթ",
          price: "private.weekly1",
          period: "ամսական",
          features: ["Անհատական պլան", "4 դաս ամսական", "Ճկուն գրաֆիկ", "Թարմացումներ ծնողներին"],
          cta: "Ընտրել պլան",
        },
        {
          name: "Անհատական - 2 դաս/շաբաթ",
          price: "private.weekly2",
          period: "ամսական",
          features: ["Անհատական պլան", "8 դաս ամսական", "Ճկուն գրաֆիկ", "Թարմացումներ ծնողներին"],
          cta: "Ընտրել պլան",
        },
        {
          name: "Անհատական - 3 դաս/շաբաթ",
          price: "private.weekly3",
          period: "ամսական",
          features: ["Անհատական պլան", "12 դաս ամսական", "Ճկուն գրաֆիկ", "Թարմացումներ ծնողներին"],
          cta: "Ընտրել պլան",
        },
      ],
      note: "* Զեղչեր՝ քույր-եղբայրների համար",
    },
    faq: {
      title: "ՀՏՀ",
      subtitle: "Հաճախ տրվող հարցեր",
      cta: "Դեռ հարցեր ունե՞ք:",
      ctaLink1: "Կապվեք մեզ հետ",
      ctaLink2: "դիտեք մեր գնացուցակը",
      ctaEnd: "սկսելու համար:",
      items: [
        { q: "Առցանց դասեր ունե՞ք", a: "Այո, առցանց (Viber/WhatsApp/Meet) և առկա Երևանում։" },
        { q: "Ո՞ր մակարդակներին է", a: "5-րդ դասարանից մինչև բուհ ընդունելություն։" },
        { q: "Տնային աշխատանք տալիս ե՞ք", a: "Այո, հավասարակշռված տնայիններ՝ հետադարձ կապով։" },
        { q: "Կա՞ փորձնական", a: "Այո, անվճար փորձնական դաս՝ նախքան վճարելը։" },
      ],
    },
    enroll: {
      title: "Գրանցվել հիմա",
      subtitle: "Ամրագրեք անվճար փորձնական դաս կամ տվեք հարց",
      contactLead:
        "Գրեք մեզ էլ.փոստով, զանգահարեք, կամ օգտագործեք ձևը․ պատասխանում ենք մեկ աշխատանքային օրվա ընթացքում։",
      form: {
        name: "Ծնող/Ուսանողի անուն",
        email: "Էլ-փոստ",
        course: "Դասընթաց",
        format: "Ձևաչափ",
        time: "Նախընտրելի ժամ",
        message: "Հաղորդագրություն",
        placeholderMsg:
          "Գրեք դասարան, նպատակներ և նախընտրելի գրաֆիկ",
        submit: "Ուղարկել",
        courseOptions: ["Մաթեմատիկա", "Ֆիզիկա", "Անգլերեն", "Ծրագրավորում", "SAT/GRE/GMAT"],
        formatOptions: ["Խմբակային", "Անհատական", "Առցանց", "Առկա"],
        placeholders: {
          name: "Արթուր Ավագյան",
          email: "maratgalstyan1967@gmail.com",
          time: "Երք 18:00",
        },
      },
    },
    contact: {
      title: "Կապ",
      subtitle: "Կապվեք մեզ հետ",
      lead: "Հարցեր ունե՞ք կամ ցանկանու՞մ եք գրանցվել։ Մենք պատասխանում ենք մեկ աշխատանքային օրվա ընթացքում։",
      cta: "Պատրա՞ստ եք սկսել:",
      ctaLink1: "Դիտեք մեր դասընթացները",
      ctaLink2: "կարդացեք մեր ՀՏՀ-ն",
    },
    chat: {
      title: "Նյուտոն",
      subtitle: "",
      welcomeMessage: "Բարև! Ես Նյուտոնն եմ՝ Գալստյան Ակադեմիայի AI օգնականը։ Տվեք ձեր հարցը, և ես կօգնեմ քայլ առ քայլ։",
      tooltipTitle: "Բարև, ես Նյուտոնն եմ",
      tooltipBody: "Ես օգնում եմ մաթեմատիկայի և ֆիզիկայի հարցերում։ Եկեք սկսենք։",
      tooltipCta: "Սկսել",
      maximize: "Մեծացնել",
      restore: "Վերադարձնել",
      minimize: "Փոքրացնել",
      placeholder: "Տվեք ձեր հարցը...",
      send: "Ուղարկել",
      sending: "Ուղարկվում է...",
      clear: "Մաքրել",
      close: "Փակել",
      errorMessage: "Ներեցեք, տեխնիկական խնդիր է առաջացել: Խնդրում ենք փորձել ավելի ուշ կամ կապ հաստատել մեզ հետ ուղղակիորեն:",
    },
    auth: {
      loginNav: "Մուտք",
      signupNav: "Գրանցվել",
      loginTitle: "Մուտք գործել",
      loginSubtitle: "Մուտք գործեք՝ ձեր անձնական էջը տեսնելու համար։",
      username: "Օգտանուն կամ էլ․փոստ",
      password: "Գաղտնաբառ",
      login: "Մուտք",
      loggingIn: "Մուտք...",
      back: "Հետ",
      loginError: "Մուտքը ձախողվեց։",
      noAccount: "Չունե՞ք էջ։ Գրանցվեք",
      haveAccount: "Ունե՞ք էջ։ Մուտք",
      signupTitle: "Գրանցվել",
      signupSubtitle: "Լրացրեք տվյալները՝ անձնական էջ ստեղծելու համար։",
      firstName: "Անուն",
      lastName: "Ազգանուն",
      email: "Էլ-փոստ",
      age: "Տարիք",
      signup: "Գրանցվել",
      signingUp: "Գրանցվում է...",
      signupError: "Գրանցումը ձախողվեց։",
      passwordHint: "Գաղտնաբառը՝ առնվազն 6 նիշ։",
      repeatPassword: "Կրկնել գաղտնաբառը",
      passwordsNoMatch: "Գաղտնաբառերը չեն համընկնում։",
      forgot: "Մոռացել եք գաղտնաբառը՞",
      forgotTitle: "Վերականգնել գաղտնաբառը",
      forgotSubtitle: "Մուտքագրեք ձեր էլ․փոստը․ մենք կուղարկենք վերականգնման հղումը։",
      sendReset: "Ուղարկել հղումը",
      sending: "Ուղարկվում է...",
      forgotSent: "Վերականգնման հղումը ուղարկվեց։ Ստուգեք ձեր Inbox/Spam-ը։",
      forgotSentTo: "Վերականգնման նամակը ուղարկվել է՝",
      emailNotFound: "Այս էլ․փոստով հաշիվ չի գտնվել։",
      forgotError: "Չհաջողվեց ուղարկել նամակը։",
      signIn: "Մուտք",
      resetTitle: "Նոր գաղտնաբառ",
      resetSubtitle: "Մուտքագրեք նոր գաղտնաբառը։",
      resetBtn: "Փոխել գաղտնաբառը",
      saving: "Պահպանվում է...",
      resetOk: "Գաղտնաբառը փոխվեց։ Կարող եք մուտք գործել։",
      resetError: "Չհաջողվեց փոխել գաղտնաբառը։",
      resetMissingToken: "Վերականգնման հղումը անվավեր է։",
    },
    private: {
      dashboardNav: "Անձնական էջ",
      logoutNav: "Ելք",
      title: "Անձնական էջ",
      welcome: "Բարի գալուստ՝",
      home: "Գլխավոր",
      logout: "Ելք",
      profileTitle: "Պրոֆիլ",
      loading: "Բեռնվում է…",
      fullName: "Ամբողջ անունը",
      email: "Էլ-փոստ",
      phone: "Հեռախոս",
      grade: "Դասարան",
      save: "Պահպանել",
      saving: "Պահպանվում է…",
      saved: "Պահպանվեց",
      lastUpdated: "Վերջին թարմացումը՝",
      card1Title: "Նյութեր (շուտով)",
      card1Body: "Այստեղ կհայտնվեն ձեր փակ նյութերը, ֆայլերը և հղումները։",
      card2Title: "Առաջադրանքներ (շուտով)",
      card2Body: "Այստեղ կհայտնվեն առաջադրանքներ և առաջընթացի տվյալներ։",
      role: "Դեր",
      profileNav: "Պրոֆիլ",
      profileEditTitle: "Խմբագրել պրոֆիլը",
      notificationsTitle: "Ծանուցումներ",
      notificationsEmpty: "Դեռ ծանուցումներ չկան։",
      notificationsUnread: "Չկարդացված",
      notificationsAll: "Բոլորը",
      unread: "ՉԿԱՐԴԱՑՎԱԾ",
      unreadCount: "չկարդացված",
      markRead: "Նշել որպես կարդացված",
      marking: "Նշվում է…",
      from: "Ումից",
      sentTitle: "Ուղարկված ծանուցումներ",
      sentEmpty: "Դեռ ուղարկված ծանուցումներ չկան։",
      to: "Ում",
      recipients: "Ստացողներ",
      read: "Կարդացել են",

      notificationsTab: "Ծանուցումներ",
      supportTab: "Օգնություն",
      supportTitle: "Օգնության չաթ",
      supportStartTitle: "Սկսել զրույց",
      supportStartHelp: "Գրեք ձեր հարցը։ Ադմինը կամ մոդերատորը կպատասխանի։",
      supportStartPh: "Նկարագրեք խնդիրը…",
      supportStartBtn: "Սկսել",
      supportInbox: "Զրույցներ",
      supportEmpty: "Դեռ զրույցներ չկան։",
      refresh: "Թարմացնել",
      status: "Կարգավիճակ",
      supportSelect: "Ընտրեք զրույցը։",
      conversation: "Զրույց",
      user: "Օգտատեր",
      writeMessage: "Գրեք հաղորդագրություն…",
      messageTooShort: "Հաղորդագրությունը պարտադիր է",
      supportNotAvailable: "Օգնության չաթը հասանելի է Pro օգտատերերի համար։",
      typing: "Գրում է…",
    },
    forum: {
      title: "Ֆորում",
      subtitle: "Ստեղծեք թեմա և քննարկեք խնդիրներ։",
      back: "Գլխավոր",
      newThread: "Նոր թեմա",
      loading: "Բեռնվում է…",
      empty: "Դեռ թեմաներ չկան։ Ստեղծեք առաջինը։",
      emptyTitle: "Քննարկումներ չկան",
      by: "Հեղինակ՝",
      replies: "Պատասխաններ",
      backToForum: "Ֆորում",
      replyTitle: "Պատասխանել",
      loginToReply: "Պատասխանելու համար անհրաժեշտ է մուտք գործել։",
      replyPlaceholder: "Գրեք ձեր պատասխանը…",
      sendReply: "Ուղարկել",
      sending: "Ուղարկվում է…",
      newThreadSubtitle: "Վերնագիր և նկարագրություն (խնդիրը)։",
      threadTitle: "Վերնագիր",
      threadTitlePh: "Օր․ Ինտեգրալների խնդիր",
      threadBody: "Հաղորդագրություն",
      threadBodyPh: "Նկարագրեք խնդիրը և ինչ փորձեցիք անել…",
      create: "Ստեղծել",
      creating: "Ստեղծվում է…",
      deleteThread: "Ջնջել թեման",
      deleting: "Ջնջվում է…",
      deleteConfirm: "Վստա՞հ եք, որ ուզում եք ջնջել թեման (բոլոր պատասխաններով)։",
      deleteFailed: "Չհաջողվեց ջնջել թեման։",
    },
    footer: {
      links: { enroll: "Գրանցվել", faq: "ՀՏՀ", pricing: "Գնացուցակ", privacy: "Գաղտնիություն" },
      rights: "Բոլոր իրավունքները պաշտպանված են",
    },
    privacy: {
      title: "Գաղտնիության քաղաքականություն",
      subtitle: "Մենք հոգ ենք տանում ձեր տվյալների պաշտպանության մասին",
      lastUpdated: "Վերջին թարմացումը՝ Փետրվար 2024",
      sections: [
        {
          title: "1. Տեղեկությունների հավաքագրում",
          content: "Մենք հավաքում ենք տեղեկություններ, որոնք դուք տրամադրում եք մեզ անմիջապես, օրինակ՝ երբ գրանցվում եք դասընթացների կամ հաղորդագրություն եք ուղարկում մեզ:"
        },
        {
          title: "2. Տվյալների օգտագործում",
          content: "Ձեր տվյալներն օգտագործվում են դասընթացների կազմակերպման, ձեզ հետ կապ հաստատելու և մեր ծառայությունների որակը բարելավելու համար:"
        },
        {
          title: "3. Տվյալների պաշտպանություն",
          content: "Մենք կիրառում ենք անվտանգության ժամանակակից միջոցներ ձեր անձնական տվյալները չարտոնված մուտքից պաշտպանելու համար:"
        },
        {
          title: "4. Cookies",
          content: "Մենք օգտագործում ենք cookies՝ կայքի աշխատանքը բարելավելու և ձեր փորձառությունն ավելի հարմարավետ դարձնելու համար:"
        }
      ]
    },
  },
  en: {
    banner: "✨ Free trial lesson for new students — book today",
    admin: {
      members: {
        title: "Members",
        search: "Search…",
        count: "Count",
        username: "Username",
        email: "Email",
        role: "Role",
        actions: "Actions",
        message: "Message",
        sendTo: "Send to",
        cancel: "Cancel",
        save: "Save",
        saving: "Saving…",
        name: "Name",
        age: "Age",
        phone: "Phone",
        grade: "Grade",
        created: "Created",
        empty: "No users found.",
      },
      roles: {
        admin: "Admin",
        moderator: "Moderator",
        pro: "Pro",
        user: "User",
      },
    },
    nav: {
      courses: "Courses",
      teachers: "Teachers",
      pricing: "Pricing",
      faq: "FAQ",
      contact: "Contact",
      forum: "Forum",
    },
    hero: {
      badge: "",
      tagline: "Learn, Grow, Succeed",
      subtitle:
        "High‑quality lessons in Math and Physics for all levels.",
      subtitleLink: "Learn More",
      primary: "Join Courses",
      secondary: "View Courses",
      teachers: "Teachers",
      or: "or",
      smalls: [
        "🎯 Small groups & private",
        "📐 Mathematics for all levels",
        "⚗️ Physics theory & practice",
      ],
    },
    courses: {
      title: "Our Courses",
      subtitle: "Core subjects designed to build a strong foundation.",
      comingSoon: "Coming Soon",
      cta: "Ready to start your learning journey?",
      ctaLink1: "View our pricing plans",
      ctaLink2: "learn more about our teachers",
      items: [
        { icon: "➗", title: "Math", desc: "Algebra, geometry, trigonometry, calculus, problem solving, olympiad." },
        { icon: "🧲", title: "Physics", desc: "Mechanics, E&M, optics, experiments, real‑world intuition." },
        { icon: "⚗️", title: "Chemistry", desc: "Coming soon - organic & inorganic chemistry, laboratory work.", disabled: true },
        { icon: "🧬", title: "Biology", desc: "Coming soon - cell biology, genetics, ecology.", disabled: true },
        { icon: "🇬🇧", title: "English", desc: "Coming soon - grammar, conversation, written expression.", disabled: true },
        { icon: "📝", title: "SAT/GRE/GMAT", desc: "American standardized test preparation - mathematics in English.", disabled: false },
      ],
    },
    teachers: {
      title: "Our Teachers",
      subtitle: "Experienced mentors focused on clarity, practice, and results.",
      cta: "Ready to learn with our teachers?",
      ctaLink1: "View our courses",
      ctaLink2: "get in touch",
    },
    results: {
      title: "Results you can expect",
      subtitle: "Real improvements within weeks",
      cta: "Want to achieve similar results?",
      ctaLink1: "Check our pricing",
      ctaLink2: "contact us",
      ctaEnd: "for more information.",
      kpis: [
        { kpi: "+2x", label: "Homework completion & confidence" },
        { kpi: "−30%", label: "Fewer mistakes on quizzes" },
        { kpi: "+1–2", label: "Grade improvement in a term" },
      ],
    },
    pricing: {
      title: "Monthly Pricing",
      subtitle: "Simple and transparent monthly plans",
      groupTiers: [
        {
          name: "Group - 1 lesson/week",
          price: "group.weekly1",
          period: "monthly",
          features: ["Max 5 students", "4 lessons monthly", "Practice worksheets", "Weekly progress notes"],
          cta: "Choose Plan",
        },
        {
          name: "Group - 2 lessons/week",
          price: "group.weekly2",
          period: "monthly",
          features: ["Max 5 students", "8 lessons monthly", "Practice worksheets", "Weekly progress notes"],
          cta: "Choose Plan",
        },
        {
          name: "Group - 3 lessons/week",
          price: "group.weekly3",
          period: "monthly",
          features: ["Max 5 students", "12 lessons monthly", "Practice worksheets", "Weekly progress notes"],
          cta: "Choose Plan",
        },
      ],
      popularTiers: [
        {
          name: "⭐ Parents Plan",
          price: "popular.daily",
          period: "monthly",
          features: ["5 tasks a day", "Online support"],
          cta: "Choose Plan",
          popular: true,
        },
      ],
      privateTiers: [
        {
          name: "Private - 1 lesson/week",
          price: "private.weekly1",
          period: "monthly",
          features: ["Personal plan", "4 lessons monthly", "Flexible schedule", "Parent updates"],
          cta: "Choose Plan",
        },
        {
          name: "Private - 2 lessons/week",
          price: "private.weekly2",
          period: "monthly",
          features: ["Personal plan", "8 lessons monthly", "Flexible schedule", "Parent updates"],
          cta: "Choose Plan",
        },
        {
          name: "Private - 3 lessons/week",
          price: "private.weekly3",
          period: "monthly",
          features: ["Personal plan", "12 lessons monthly", "Flexible schedule", "Parent updates"],
          cta: "Choose Plan",
        },
      ],
      note: "* Discounts for siblings available.",
    },
    faq: {
      title: "FAQ",
      subtitle: "Common questions",
      cta: "Still have questions?",
      ctaLink1: "Contact us",
      ctaLink2: "view our pricing",
      ctaEnd: "to get started.",
      items: [
        { q: "Do you offer online lessons?", a: "Yes. In‑person in Yerevan or online via Viber/WhatsApp/Meet." },
        { q: "What levels do you teach?", a: "From grade 5 to university entrance." },
        { q: "Do you give homework?", a: "Yes, balanced homework with feedback to build mastery." },
        { q: "Can we try before paying?", a: "Absolutely—book a free trial lesson." },
      ],
    },
    enroll: {
      title: "Enroll now",
      subtitle: "Book your free trial lesson or ask a question.",
      contactLead:
        "Email us, call us, or use the form. We reply within one business day.",
      form: {
        name: "Parent/Student Name",
        email: "Email",
        course: "Course",
        format: "Format",
        time: "Preferred Time",
        message: "Message",
        placeholderMsg:
          "Tell us the student's grade, goals, and preferred schedule",
        submit: "Send",
        courseOptions: ["Math", "Physics", "English", "Programming", "SAT/GRE/GMAT"],
        formatOptions: ["Group", "Private", "Online", "In‑person"],
        placeholders: {
          name: "Arthur Avagyan",
          email: "maratgalstyan1967@gmail.com",
          time: "Tue 18:00",
        },
      },
    },
    contact: {
      title: "Contact",
      subtitle: "Get in touch with us",
      lead: "Have questions or want to enroll? We reply within one business day.",
      cta: "Ready to get started?",
      ctaLink1: "View our courses",
      ctaLink2: "read our FAQ",
    },
    chat: {
      title: "Newton",
      subtitle: "",
      welcomeMessage: "Hello! I'm Newton — the AI assistant for Galstyan Academy. Ask your question and I’ll help step by step.",
      tooltipTitle: "Hello, I'm Newton",
      tooltipBody: "I can help with math and physics. Let’s start.",
      tooltipCta: "Start",
      maximize: "Maximize",
      restore: "Restore",
      minimize: "Minimize",
      placeholder: "Type your question...",
      send: "Send",
      sending: "Sending...",
      clear: "Clear",
      close: "Close",
      errorMessage: "Sorry, there was a technical issue. Please try again later or contact us directly.",
    },
    auth: {
      loginNav: "Login",
      signupNav: "Sign up",
      loginTitle: "Sign in",
      loginSubtitle: "Sign in to access your private page.",
      username: "Username or email",
      password: "Password",
      login: "Login",
      loggingIn: "Logging in...",
      back: "Back",
      loginError: "Login failed.",
      noAccount: "No account? Sign up",
      haveAccount: "Already have an account? Sign in",
      signupTitle: "Create account",
      signupSubtitle: "Fill the form to create your private page.",
      firstName: "Name",
      lastName: "Surname",
      email: "Email",
      age: "Age",
      signup: "Sign up",
      signingUp: "Signing up...",
      signupError: "Sign up failed.",
      passwordHint: "Password must be at least 6 characters.",
      repeatPassword: "Repeat password",
      passwordsNoMatch: "Passwords do not match.",
      forgot: "Forgot password?",
      forgotTitle: "Reset your password",
      forgotSubtitle: "Enter your email and we’ll send you a reset link.",
      sendReset: "Send reset link",
      sending: "Sending...",
      forgotSent: "Password reset email sent. Check your Inbox/Spam.",
      forgotSentTo: "Password reset email sent to:",
      emailNotFound: "No account found with that email.",
      forgotError: "Failed to send reset email.",
      signIn: "Sign in",
      resetTitle: "New password",
      resetSubtitle: "Enter your new password.",
      resetBtn: "Reset password",
      saving: "Saving...",
      resetOk: "Password updated. You can sign in now.",
      resetError: "Failed to reset password.",
      resetMissingToken: "Reset link is invalid.",
    },
    private: {
      dashboardNav: "Dashboard",
      logoutNav: "Logout",
      title: "Private Dashboard",
      welcome: "Welcome,",
      home: "Home",
      logout: "Logout",
      profileTitle: "Profile",
      loading: "Loading…",
      fullName: "Full name",
      email: "Email",
      phone: "Phone",
      grade: "Grade",
      save: "Save",
      saving: "Saving…",
      saved: "Saved",
      lastUpdated: "Last updated:",
      card1Title: "Resources (coming soon)",
      card1Body: "Your private materials, files, and links will appear here.",
      card2Title: "Assignments (coming soon)",
      card2Body: "Assignments and progress tracking will appear here.",
      role: "Role",
      profileNav: "Profile",
      profileEditTitle: "Edit profile",
      notificationsTitle: "Notifications",
      notificationsEmpty: "No notifications yet.",
      notificationsUnread: "Unread",
      notificationsAll: "All",
      unread: "UNREAD",
      unreadCount: "unread",
      markRead: "Mark as read",
      marking: "Marking…",
      from: "From",
      sentTitle: "Sent notifications",
      sentEmpty: "No sent notifications yet.",
      to: "To",
      recipients: "Recipients",
      read: "Read",

      notificationsTab: "Notifications",
      supportTab: "Support",
      supportTitle: "Support chat",
      supportStartTitle: "Start a conversation",
      supportStartHelp: "Write your question. Admin/Moderator will reply.",
      supportStartPh: "Describe your problem…",
      supportStartBtn: "Start",
      supportInbox: "Inbox",
      supportEmpty: "No conversations yet.",
      refresh: "Refresh",
      status: "Status",
      supportSelect: "Select a conversation.",
      conversation: "Conversation",
      user: "User",
      writeMessage: "Write a message…",
      messageTooShort: "Message is required",
      supportNotAvailable: "Support chat is available for Pro users.",
      typing: "Typing…",
    },
    forum: {
      title: "Forum",
      subtitle: "Create a thread and discuss problems.",
      back: "Home",
      newThread: "New thread",
      loading: "Loading…",
      empty: "No threads yet. Be the first to start a conversation.",
      emptyTitle: "No discussions yet",
      by: "By:",
      replies: "Replies",
      backToForum: "Forum",
      replyTitle: "Reply",
      loginToReply: "You must sign in to reply.",
      replyPlaceholder: "Write your reply…",
      sendReply: "Send",
      sending: "Sending…",
      newThreadSubtitle: "Add a title and describe the problem.",
      threadTitle: "Title",
      threadTitlePh: "e.g., Integral question",
      threadBody: "Message",
      threadBodyPh: "Describe the task and what you tried…",
      create: "Create",
      creating: "Creating…",
      deleteThread: "Delete thread",
      deleting: "Deleting…",
      deleteConfirm: "Are you sure you want to delete this thread (and all replies)?",
      deleteFailed: "Failed to delete thread.",
    },
    footer: {
      links: { enroll: "Enroll", faq: "FAQ", pricing: "Pricing", privacy: "Privacy" },
      rights: "All rights reserved",
    },
    privacy: {
      title: "Privacy Policy",
      subtitle: "We care about the protection of your data",
      lastUpdated: "Last updated: February 2024",
      sections: [
        {
          title: "1. Information Collection",
          content: "We collect information that you provide to us directly, such as when you enroll in courses or send us a message."
        },
        {
          title: "2. Use of Information",
          content: "Your data is used to organize courses, communicate with you, and improve the quality of our services."
        },
        {
          title: "3. Data Protection",
          content: "We implement modern security measures to protect your personal data from unauthorized access."
        },
        {
          title: "4. Cookies",
          content: "We use cookies to improve site performance and make your experience more comfortable."
        }
      ]
    },
  },
  ru: {
    banner: "✨ Бесплатный пробный урок для новых учеников — запишитесь сегодня",
    admin: {
      members: {
        title: "Пользователи",
        search: "Поиск…",
        count: "Количество",
        username: "Логин",
        email: "Email",
        role: "Роль",
        actions: "Действия",
        message: "Сообщение",
        sendTo: "Отправить",
        cancel: "Отмена",
        save: "Сохранить",
        saving: "Сохранение…",
        name: "Имя",
        age: "Возраст",
        phone: "Телефон",
        grade: "Класс",
        created: "Создан",
        empty: "Пользователи не найдены.",
      },
      roles: {
        admin: "Админ",
        moderator: "Модератор",
        pro: "Pro",
        user: "Пользователь",
      },
    },
    nav: {
      courses: "Курсы",
      teachers: "Преподаватели",
      pricing: "Цены",
      faq: "Вопросы",
      contact: "Контакты",
      forum: "Форум",
    },
    hero: {
      badge: "",
      tagline: "Учись, Расти, Достигай",
      subtitle:
        "Качественные занятия по математике и физике для всех уровней.",
      subtitleLink: "Узнайте больше",
      primary: "Записаться на курсы",
      secondary: "Посмотреть курсы",
      teachers: "Преподаватели",
      or: "или",
      smalls: [
        "🎯 Небольшие группы и индивидуальные",
        "📐 Математика для всех уровней",
        "⚗️ Физика: теория и практика",
      ],
    },
    courses: {
      title: "Наши курсы",
      subtitle: "Базовые предметы для прочного фундамента.",
      comingSoon: "Скоро",
      cta: "Готовы начать свое обучение?",
      ctaLink1: "Посмотрите наши цены",
      ctaLink2: "узнайте больше о нашем основателе",
      items: [
        { icon: "➗", title: "Математика", desc: "Алгебра, геометрия, тригонометрия, анализ, решение задач, олимпиада." },
        { icon: "🧲", title: "Физика", desc: "Механика, ЭМ, оптика, эксперименты и практическое мышление." },
        { icon: "⚗️", title: "Химия", desc: "Скоро - органическая и неорганическая химия, лабораторные работы.", disabled: true },
        { icon: "🧬", title: "Биология", desc: "Скоро - клеточная биология, генетика, экология.", disabled: true },
        { icon: "🇬🇧", title: "Английский", desc: "Скоро - грамматика, разговорная речь, письменное выражение.", disabled: true },
        { icon: "📝", title: "SAT/GRE/GMAT", desc: "Подготовка к американским стандартизированным тестам - математика на английском.", disabled: false },
      ],
    },
    teachers: {
      title: "Наши преподаватели",
      subtitle: "Опытные наставники, ориентированные на практику и результат.",
      cta: "Готовы учиться с нашими преподавателями?",
      ctaLink1: "Посмотрите наши курсы",
      ctaLink2: "свяжитесь с нами",
    },
    results: {
      title: "Ожидаемые результаты",
      subtitle: "Заметный прогресс за несколько недель",
      cta: "Хотите достичь таких же результатов?",
      ctaLink1: "Посмотрите наши цены",
      ctaLink2: "свяжитесь с нами",
      ctaEnd: "для получения дополнительной информации.",
      kpis: [
        { kpi: "+2x", label: "Выполнение домашних и уверенность" },
        { kpi: "−30%", label: "Меньше ошибок в тестах" },
        { kpi: "+1–2", label: "Рост оценок за четверть" },
      ],
    },
    pricing: {
      title: "Месячные цены",
      subtitle: "Простые и прозрачные месячные планы",
      groupTiers: [
        {
          name: "Группа - 1 урок/неделя",
          price: "group.weekly1",
          period: "месячно",
          features: ["До 5 учеников", "4 урока в месяц", "Практические задания", "Еженедельный прогресс"],
          cta: "Выбрать план",
        },
        {
          name: "Группа - 2 урока/неделя",
          price: "group.weekly2",
          period: "месячно",
          features: ["До 5 учеников", "8 уроков в месяц", "Практические задания", "Еженедельный прогресс"],
          cta: "Выбрать план",
        },
        {
          name: "Группа - 3 урока/неделя",
          price: "group.weekly3",
          period: "месячно",
          features: ["До 5 учеников", "12 уроков в месяц", "Практические задания", "Еженедельный прогресс"],
          cta: "Выбрать план",
        },
      ],
      popularTiers: [
        {
          name: "⭐ План для родителей",
          price: "popular.daily",
          period: "месячно",
          features: ["5 заданий в день", "Онлайн поддержка"],
          cta: "Выбрать план",
          popular: true,
        },
      ],
      privateTiers: [
        {
          name: "Индивидуальные - 1 урок/неделя",
          price: "private.weekly1",
          period: "месячно",
          features: ["Личный план", "4 урока в месяц", "Гибкий график", "Обратная связь для родителей"],
          cta: "Выбрать план",
        },
        {
          name: "Индивидуальные - 2 урока/неделя",
          price: "private.weekly2",
          period: "месячно",
          features: ["Личный план", "8 уроков в месяц", "Гибкий график", "Обратная связь для родителей"],
          cta: "Выбрать план",
        },
        {
          name: "Индивидуальные - 3 урока/неделя",
          price: "private.weekly3",
          period: "месячно",
          features: ["Личный план", "12 уроков в месяц", "Гибкий график", "Обратная связь для родителей"],
          cta: "Выбрать план",
        },
      ],
      note: "* Скидки для братьев/сестёр.",
    },
    faq: {
      title: "Вопросы и ответы",
      subtitle: "Частые вопросы",
      cta: "Остались вопросы?",
      ctaLink1: "Свяжитесь с нами",
      ctaLink2: "посмотрите наши цены",
      ctaEnd: "чтобы начать.",
      items: [
        { q: "Проводите ли вы онлайн‑занятия?", a: "Да. Очно в Ереване и онлайн (Viber/WhatsApp/Meet)." },
        { q: "С какими уровнями вы работаете?", a: "С 5 класса до поступления в вуз." },
        { q: "Даёте ли вы домашние задания?", a: "Да, сбалансированные задания с обратной связью." },
        { q: "Можно ли попробовать бесплатно?", a: "Да, бесплатный пробный урок." },
      ],
    },
    enroll: {
      title: "Запишитесь сейчас",
      subtitle: "Бесплатный пробный урок или вопрос",
      contactLead:
        "Напишите на почту, позвоните или заполните форму. Отвечаем в течение рабочего дня.",
      form: {
        name: "Имя родителя/ученика",
        email: "Email",
        course: "Курс",
        format: "Формат",
        time: "Удобное время",
        message: "Сообщение",
        placeholderMsg:
          "Укажите класс, цели и предпочитаемое расписание",
        submit: "Отправить",
        courseOptions: ["Математика", "Физика", "Английский", "Программирование", "SAT/GRE/GMAT"],
        formatOptions: ["Группа", "Индивидуальные", "Онлайн", "Очно"],
        placeholders: {
          name: "Артур Авагян",
          email: "maratgalstyan1967@gmail.com",
          time: "Вт 18:00",
        },
      },
    },
    contact: {
      title: "Контакты",
      subtitle: "Свяжитесь с нами",
      lead: "Есть вопросы или хотите записаться? Отвечаем в течение рабочего дня.",
      cta: "Готовы начать?",
      ctaLink1: "Посмотрите наши курсы",
      ctaLink2: "прочитайте наши вопросы",
    },
    chat: {
      title: "Ньютон",
      subtitle: "",
      welcomeMessage: "Привет! Я Ньютон — AI-помощник Академии Галстяна. Задайте вопрос, и я помогу шаг за шагом.",
      tooltipTitle: "Привет, я Ньютон",
      tooltipBody: "Я помогу с математикой и физикой. Давайте начнем.",
      tooltipCta: "Начать",
      maximize: "Развернуть",
      restore: "Вернуть",
      minimize: "Свернуть",
      placeholder: "Введите ваш вопрос...",
      send: "Отправить",
      sending: "Отправка...",
      clear: "Очистить",
      close: "Закрыть",
      errorMessage: "Извините, произошла техническая ошибка. Пожалуйста, попробуйте позже или свяжитесь с нами напрямую.",
    },
    auth: {
      loginNav: "Вход",
      signupNav: "Регистрация",
      loginTitle: "Войти",
      loginSubtitle: "Войдите, чтобы открыть личную страницу.",
      username: "Логин или email",
      password: "Пароль",
      login: "Войти",
      loggingIn: "Вход...",
      back: "Назад",
      loginError: "Ошибка входа.",
      noAccount: "Нет аккаунта? Зарегистрироваться",
      haveAccount: "Уже есть аккаунт? Войти",
      signupTitle: "Регистрация",
      signupSubtitle: "Заполните данные, чтобы создать личную страницу.",
      firstName: "Имя",
      lastName: "Фамилия",
      email: "Email",
      age: "Возраст",
      signup: "Зарегистрироваться",
      signingUp: "Регистрация...",
      signupError: "Ошибка регистрации.",
      passwordHint: "Пароль минимум 6 символов.",
      repeatPassword: "Повторите пароль",
      passwordsNoMatch: "Пароли не совпадают.",
      forgot: "Забыли пароль?",
      forgotTitle: "Сброс пароля",
      forgotSubtitle: "Введите email — мы отправим ссылку для сброса.",
      sendReset: "Отправить ссылку",
      sending: "Отправка...",
      forgotSent: "Письмо для сброса пароля отправлено. Проверьте Входящие/Спам.",
      forgotSentTo: "Письмо для сброса отправлено на:",
      emailNotFound: "Аккаунт с таким email не найден.",
      forgotError: "Не удалось отправить письмо.",
      signIn: "Вход",
      resetTitle: "Новый пароль",
      resetSubtitle: "Введите новый пароль.",
      resetBtn: "Сменить пароль",
      saving: "Сохранение...",
      resetOk: "Пароль обновлён. Теперь вы можете войти.",
      resetError: "Не удалось сменить пароль.",
      resetMissingToken: "Ссылка для сброса недействительна.",
    },
    private: {
      dashboardNav: "Личный кабинет",
      logoutNav: "Выход",
      title: "Личный кабинет",
      welcome: "Добро пожаловать,",
      home: "Главная",
      logout: "Выход",
      profileTitle: "Профиль",
      loading: "Загрузка…",
      fullName: "Полное имя",
      email: "Email",
      phone: "Телефон",
      grade: "Класс",
      save: "Сохранить",
      saving: "Сохранение…",
      saved: "Сохранено",
      lastUpdated: "Последнее обновление:",
      card1Title: "Материалы (скоро)",
      card1Body: "Здесь появятся ваши закрытые материалы, файлы и ссылки.",
      card2Title: "Задания (скоро)",
      card2Body: "Здесь появятся задания и отслеживание прогресса.",
      role: "Роль",
      profileNav: "Профиль",
      profileEditTitle: "Редактировать профиль",
      notificationsTitle: "Уведомления",
      notificationsEmpty: "Пока нет уведомлений.",
      notificationsUnread: "Непрочитанные",
      notificationsAll: "Все",
      unread: "НЕПРОЧИТАНО",
      unreadCount: "непрочитано",
      markRead: "Отметить как прочитанное",
      marking: "Отмечается…",
      from: "От",
      sentTitle: "Отправленные уведомления",
      sentEmpty: "Пока нет отправленных уведомлений.",
      to: "Кому",
      recipients: "Получатели",
      read: "Прочитали",

      notificationsTab: "Уведомления",
      supportTab: "Поддержка",
      supportTitle: "Чат поддержки",
      supportStartTitle: "Начать диалог",
      supportStartHelp: "Напишите вопрос. Админ/модератор ответит.",
      supportStartPh: "Опишите проблему…",
      supportStartBtn: "Начать",
      supportInbox: "Диалоги",
      supportEmpty: "Пока нет диалогов.",
      refresh: "Обновить",
      status: "Статус",
      supportSelect: "Выберите диалог.",
      conversation: "Диалог",
      user: "Пользователь",
      writeMessage: "Напишите сообщение…",
      messageTooShort: "Сообщение обязательно",
      supportNotAvailable: "Чат поддержки доступен для Pro пользователей.",
      typing: "Печатает…",
    },
    forum: {
      title: "Форум",
      subtitle: "Создайте тему и обсуждайте задачи.",
      back: "Главная",
      newThread: "Новая тема",
      loading: "Загрузка…",
      empty: "Пока нет тем. Создайте первую.",
      emptyTitle: "Нет обсуждений",
      by: "Автор:",
      replies: "Ответы",
      backToForum: "Форум",
      replyTitle: "Ответить",
      loginToReply: "Чтобы ответить, нужно войти.",
      replyPlaceholder: "Напишите ответ…",
      sendReply: "Отправить",
      sending: "Отправка…",
      newThreadSubtitle: "Добавьте заголовок и опишите задачу.",
      threadTitle: "Заголовок",
      threadTitlePh: "Напр., задача на интегралы",
      threadBody: "Сообщение",
      threadBodyPh: "Опишите задачу и что вы пробовали…",
      create: "Создать",
      creating: "Создание…",
      deleteThread: "Удалить тему",
      deleting: "Удаление…",
      deleteConfirm: "Удалить тему и все ответы?",
      deleteFailed: "Не удалось удалить тему.",
    },
    footer: {
      links: { enroll: "Запись", faq: "Вопросы", pricing: "Цены", privacy: "Конфиденциальность" },
      rights: "Все права защищены",
    },
    privacy: {
      title: "Политика конфиденциальности",
      subtitle: "Мы заботимся о защите ваших данных",
      lastUpdated: "Последнее обновление: Февраль 2024",
      sections: [
        {
          title: "1. Сбор информации",
          content: "Мы собираем информацию, которую вы предоставляете нам напрямую, например, при записи на курсы или отправке нам сообщения."
        },
        {
          title: "2. Использование информации",
          content: "Ваши данные используются для организации курсов, связи с вами и повышения качества наших услуг."
        },
        {
          title: "3. Защита данных",
          content: "Мы применяем современные меры безопасности для защиты ваших личных данных от несанкционированного доступа."
        },
        {
          title: "4. Cookies",
          content: "Мы используем cookies для улучшения работы сайта и того, чтобы сделать ваше пребывание на нем более комфортным."
        }
      ]
    },
  },
};

// SEO and Analytics.


const formatPrice = (pricePath, lang) => {
  const pathParts = pricePath.split('.');
  const prices = pathParts.reduce((obj, key) => obj[key], CONFIG.pricing);

  switch (lang) {
    case 'hy': return `֏${prices.amd.toLocaleString()}`;
    case 'en': return `$${prices.usd}`;
    case 'ru': return `₽${prices.rub.toLocaleString()}`;
    default: return `֏${prices.amd.toLocaleString()}`;
  }
};

// Smooth scrolling utility
const smoothScrollTo = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export const SEO = ({ lang = "hy" }) => {

  /**
   * SEO best practices implemented:
   * - Unique title and description for each language
   * - Open Graph tags 
  */

  const meta = {
    hy: {
      title: "Գալստյան Ակադեմիա | Մաթեմատիկա և Ֆիզիկա Երևանում",
      description:
        "Բարձրորակ դասընթացներ մաթեմատիկայի և ֆիզիկայի՝ փորձառու ուսուցիչ Մարատ Գալստյանի կողմից։ Փոքր խմբեր և անհատական մոտեցում։",
    },
    en: {
      title: "Galstyan Academy | Math & Physics in Yerevan",
      description:
        "High-quality Math and Physics lessons by experienced teacher Marat Galstyan. Small groups and private tutoring available.",
    },
    ru: {
      title: "Академия Галстяна | Математика и Физика в Ереване",
      description:
        "Качественные занятия по математике и физике от опытного преподавателя Марата Галстяна. Малые группы и индивидуальные занятия.",
    },
  };

  const { title, description } = meta[lang];

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>


      <meta name="description" content={description} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/logo.png" />
      <meta property="og:url" content="https://www.galstyanacademy.com" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="/logo.png" />


      <meta
        name="keywords"
        content="Galstyan Academy, Math Yerevan, Physics tutoring, Մաթեմատիկա Երևան, Физика Ереван"
      />

      {/* Google Analyse */}

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "Galstyan Academy",
          url: "https://www.galstyanacademy.com",
          logo: "https://galstyanacademy.com/logo.png",
          founder: "Marat Galstyan",
          sameAs: [
            "https://www.facebook.com/galstyanacademy",
            "https://www.instagram.com/galstyanacademy/"
          ],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Yerevan",
            addressCountry: "Armenia",
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+37494766409",
            contactType: "customer service",
            availableLanguage: ["hy", "en", "ru"],
          },
        })}
      </script>
    </Helmet>
  );
};

export default function LandingPage() {

  /**
   * State management and effects:
   * - Language selection and persistence
   * - Authentication state and user data
   */

  const [lang, setLang] = useState("hy");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [unreadSupportCount, setUnreadSupportCount] = useState(0);
  const [resetToken, setResetToken] = useState(null);
  const [forumThreadId, setForumThreadId] = useState(null);
  const [pendingAnchor, setPendingAnchor] = useState(null);

  // Load token from localStorage and validate it.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = window.localStorage.getItem('authToken');
    if (!token) return;
    setAuthToken(token);
    getMe(token)
      .then((data) => {
        setAuthUser(data.user || null);
      })
      .catch(() => {
        window.localStorage.removeItem('authToken');
        setAuthToken(null);
        setAuthUser(null);
      });
  }, []);

  const refreshUnreadNotifications = async (token) => {
    try {
      if (!token) return setUnreadNotificationsCount(0);
      const rows = await getMyNotifications(token);
      const unread = (rows || []).filter((n) => !n.isRead).length;
      setUnreadNotificationsCount(unread);
    } catch {
      // Non-fatal: don't break app if notifications endpoint fails.
      setUnreadNotificationsCount(0);
    }
  };

  const refreshUnreadSupport = async (token) => {
    try {
      if (!token) return setUnreadSupportCount(0);
      const n = await getSupportUnreadCount(token);
      setUnreadSupportCount(Number.isFinite(n) ? n : 0);
    } catch {
      setUnreadSupportCount(0);
    }
  };

  useEffect(() => {
    if (!authToken) return;
    refreshUnreadNotifications(authToken);
    refreshUnreadSupport(authToken);

    const handler = () => refreshUnreadNotifications(authToken);
    window.addEventListener('notifications:changed', handler);

    const interval = window.setInterval(() => {
      refreshUnreadNotifications(authToken);
      refreshUnreadSupport(authToken);
    }, 5000);
    return () => {
      window.removeEventListener('notifications:changed', handler);
      window.clearInterval(interval);
    };
  }, [authToken]);

  // Listen for LoginPage "forgot password" navigation event.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => setCurrentPage('forgot');
    window.addEventListener('nav:forgot', handler);
    return () => window.removeEventListener('nav:forgot', handler);
  }, []);

  // --- URL Routing Logic ---
  // Sync state to URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (currentPage === 'home') {
      url.searchParams.delete('page');
    } else {
      url.searchParams.set('page', currentPage);
    }
    // Only push if it's different from current search to avoid history bloat
    if (window.location.search !== url.search) {
      window.history.pushState({ page: currentPage }, '', url.toString());
    }
    // Always scroll to top on page change
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Sync URL to state on load and popstate
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page');
      const resetTokenParam = params.get('reset');

      if (resetTokenParam) {
        setResetToken(resetTokenParam);
        setCurrentPage('reset');
      } else if (page && ['home', 'enroll', 'login', 'signup', 'teachers', 'forum', 'profile', 'messages', 'notifications', 'adminMembers', 'forgot', 'privacy'].includes(page)) {
        setCurrentPage(page);
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', syncFromUrl);
    syncFromUrl(); // Initial sync

    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  // Navigate to profile from dashboard button.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => setCurrentPage('profile');
    window.addEventListener('nav:profile', handler);
    return () => window.removeEventListener('nav:profile', handler);
  }, []);

  useEffect(() => {
    const initializeLanguage = async () => {
      if (typeof window !== "undefined") {
        // First check if user has a saved language preference
        const saved = window.localStorage.getItem("lang");
        if (saved && I18N[saved]) {
          setLang(saved);
          setIsLoading(false);
          return;
        }

        // If no saved preference, detect language based on location
        if (isLocationDetectionSupported()) {
          try {
            const detectedLang = await detectUserLanguage();
            setLang(detectedLang);
          } catch (error) {
            // Keep default Armenian if detection fails
            setLang("hy");
          }
        } else {
          // Fallback to Armenian if location detection is not supported
          setLang("hy");
        }

        setIsLoading(false);
      }
    };

    initializeLanguage();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lang", lang);
    }
  }, [lang]);

  // Update document title when language/unread changes (helps when site is in another tab)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const base = CONFIG.businessName[lang];
    const totalUnread = (unreadNotificationsCount || 0) + (unreadSupportCount || 0);
    const prefix = totalUnread > 0 ? `(${totalUnread}) ` : '';
    document.title = `${prefix}${base}`;
  }, [lang, unreadNotificationsCount, unreadSupportCount]);

  // Track page view on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      trackPageView('Home Page');
    }
  }, []);

  const t = (path) => {
    const parts = path.split(".");
    return parts.reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : null), I18N[lang]);
  };

  const navigateToAnchor = (anchorId) => {
    if (!anchorId) return;
    if (currentPage !== 'home') {
      setPendingAnchor(anchorId);
      setCurrentPage('home');
      return;
    }
    smoothScrollTo(anchorId);
  };

  useEffect(() => {
    if (currentPage !== 'home') return;
    if (!pendingAnchor) return;
    // Let the home page render first, then scroll.
    const id = pendingAnchor;
    setPendingAnchor(null);
    setTimeout(() => smoothScrollTo(id), 50);
  }, [currentPage, pendingAnchor]);

  // Add smooth scrolling to all internal links
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        e.preventDefault();
        const elementId = target.getAttribute('href').substring(1);
        smoothScrollTo(elementId);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    setCurrentPage('enroll');
    trackEvent('plan_selected', { plan: planId });
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedPlan(null);
  };


  if (isLoading) {
    return <LoadingSpinner CONFIG={CONFIG} lang={lang} />;
  }

  const isAuthed = Boolean(authToken && authUser);

  const goMessages = () => {
    if (!isAuthed) return setCurrentPage('login');
    return setCurrentPage('messages');
  };

  const goNotifications = () => {
    if (!isAuthed) return setCurrentPage('login');
    return setCurrentPage('notifications');
  };

  const goProfile = () => {
    if (!isAuthed) return setCurrentPage('login');
    return setCurrentPage('profile');
  };

  const goMembers = () => {
    if (!isAuthed) return setCurrentPage('login');
    if (!['admin', 'moderator'].includes(authUser?.role)) return setCurrentPage('messages');
    return setCurrentPage('adminMembers');
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('authToken');
    }
    setAuthToken(null);
    setAuthUser(null);
    setCurrentPage('home');
  };

  const headerEl = (
    <Header
      lang={lang}
      setLang={setLang}
      t={t}
      CONFIG={CONFIG}
      isAuthed={isAuthed}
      user={authUser}
      unreadNotificationsCount={unreadNotificationsCount || 0}
      unreadSupportCount={unreadSupportCount || 0}
      currentPage={currentPage}
      onNavigateAnchor={navigateToAnchor}
      onLogoClick={() => navigateToAnchor('home')}
      onForumClick={() => setCurrentPage('forum')}
      onTeachersClick={() => setCurrentPage('teachers')}
      onPrivacyClick={() => setCurrentPage('privacy')}
      onLoginClick={() => setCurrentPage('login')}
      onSignUpClick={() => setCurrentPage('signup')}
      onMessagesClick={goMessages}
      onNotificationsClick={goNotifications}
      onProfileClick={goProfile}
      onMembersClick={goMembers}
      onLogout={logout}
    />
  );

  const withHeader = (children) => (
    <Fragment>
      {headerEl}
      {children}
    </Fragment>
  );

  if (currentPage === 'enroll') {
    return (
      <Fragment>
        {headerEl}
        <EnrollPage
          selectedPlan={selectedPlan}
          CONFIG={CONFIG}
          lang={lang}
          setLang={setLang}
          t={t}
          onBack={handleBackToHome}
        />

        {/* Chat Button */}
        <ChatButton onClick={() => setIsChatOpen(true)} t={t} />

        {/* Chat */}
        <Chat
          lang={lang}
          t={t}
          CONFIG={CONFIG}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      </Fragment>
    );
  }

  if (currentPage === 'login') {
    return withHeader(
      <LoginPage
        t={t}
        onBack={() => setCurrentPage('home')}
        onSignUpClick={() => setCurrentPage('signup')}
        onLoginSuccess={({ token, user }) => {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('authToken', token);
          }
          setAuthToken(token);
          setAuthUser(user);
          setCurrentPage('messages');
        }}
      />
    );
  }

  if (currentPage === 'signup') {
    return withHeader(
      <SignUpPage
        t={t}
        onBack={() => setCurrentPage('home')}
        onSignInClick={() => setCurrentPage('login')}
        onSignupSuccess={({ token, user }) => {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('authToken', token);
          }
          setAuthToken(token);
          setAuthUser(user);
          setCurrentPage('messages');
        }}
      />
    );
  }

  if (currentPage === 'forgot') {
    return withHeader(
      <ForgotPasswordPage
        t={t}
        onBack={() => setCurrentPage('login')}
        onSignInClick={() => setCurrentPage('login')}
      />
    );
  }

  if (currentPage === 'reset') {
    return withHeader(
      <ResetPasswordPage
        t={t}
        token={resetToken}
        onBackToSignIn={() => {
          setResetToken(null);
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('reset');
            window.history.replaceState({}, '', url.toString());
          }
          setCurrentPage('login');
        }}
      />
    );
  }

  if (currentPage === 'forum') {
    return withHeader(
      <ForumPage
        t={t}
        isAuthed={isAuthed}
        onBack={() => setCurrentPage('home')}
        onNewThread={(mode) => {
          if (mode === 'login') return setCurrentPage('login');
          return setCurrentPage('newThread');
        }}
        onOpenThread={(id) => {
          setForumThreadId(id);
          setCurrentPage('thread');
        }}
      />
    );
  }

  if (currentPage === 'newThread') {
    if (!isAuthed) return setCurrentPage('login');
    return withHeader(
      <NewThreadPage
        t={t}
        token={authToken}
        onBack={() => setCurrentPage('forum')}
        onCreated={(id) => {
          setForumThreadId(id);
          setCurrentPage('thread');
        }}
      />
    );
  }

  if (currentPage === 'thread') {
    if (!forumThreadId) return setCurrentPage('forum');
    return withHeader(
      <ForumThreadPage
        t={t}
        threadId={forumThreadId}
        isAuthed={isAuthed}
        token={authToken}
        user={authUser}
        onBack={() => setCurrentPage('forum')}
        onGoLogin={() => setCurrentPage('login')}
        onDeleted={() => {
          setForumThreadId(null);
          setCurrentPage('forum');
        }}
      />
    );
  }

  if (currentPage === 'profile') {
    if (!isAuthed) return setCurrentPage('login');
    return withHeader(
      <ProfilePage
        t={t}
        user={authUser}
        token={authToken}
        onLogout={logout}
        onBackHome={() => setCurrentPage('home')}
        onMembers={() => setCurrentPage('adminMembers')}
      />
    );
  }

  if (currentPage === 'messages') {
    if (!isAuthed) return setCurrentPage('login');
    return withHeader(
      <MessagesPage
        t={t}
        user={authUser}
        token={authToken}
        onAdminMembers={() => setCurrentPage('adminMembers')}
      />
    );
  }

  if (currentPage === 'notifications') {
    if (!isAuthed) return setCurrentPage('login');
    return withHeader(
      <NotificationsPage
        t={t}
        user={authUser}
        token={authToken}
      />
    );
  }

  if (currentPage === 'teachers') {
    return withHeader(
      <TeachersPage
        t={t}
        CONFIG={CONFIG}
        lang={lang}
        onBack={() => setCurrentPage('home')}
      />
    );
  }

  if (currentPage === 'privacy') {
    return withHeader(
      <PrivacyPolicyPage
        t={t}
        lang={lang}
        onBack={() => setCurrentPage('home')}
      />
    );
  }

  if (currentPage === 'adminMembers') {
    if (!isAuthed) return setCurrentPage('login');
    if (!['admin', 'moderator'].includes(authUser?.role)) return setCurrentPage('messages');
    return withHeader(
      <AdminMembersPage
        t={t}
        authToken={authToken}
        authUser={authUser}
        onBack={() => setCurrentPage('messages')}
      />
    );
  }

  return (
    <Fragment>
      <SEO lang={lang} />


      <div className={`min-h-screen ${CONFIG.color.bg} ${CONFIG.color.text} antialiased`}>

        {/* Header */}
        {headerEl}

        {/* Hero */}
        <Hero t={t} CONFIG={CONFIG} lang={lang} />

        {/* Courses */}
        <Section id="courses" title={t("courses.title")} subtitle={t("courses.subtitle")} variant="subtle">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t("courses.items").map((c, i) => (
              <Feature key={i} icon={c.icon} title={c.title} desc={c.desc} CONFIG={CONFIG} disabled={c.disabled} comingSoonText={t("courses.comingSoon")} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-sky-200 mb-6">
              {t("courses.cta")} <a href="#pricing" className="text-sky-300 hover:text-white underline decoration-sky-300/50 hover:decoration-white transition-colors">{t("courses.ctaLink1")}</a> {t("hero.or")} <a href="#teachers" className="text-sky-300 hover:text-white underline decoration-sky-300/50 hover:decoration-white transition-colors">{t("courses.ctaLink2")}</a>.
            </p>
          </div>
        </Section>

        {/* Results */}
        <Section id="results" title={t("results.title")} subtitle={t("results.subtitle")} variant="minimal">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t("results.kpis").map((c, i) => (
              <Card key={i} CONFIG={CONFIG}>
                <div className="text-4xl font-bold text-white">{c.kpi}</div>
                <p className="mt-2 text-sky-200">{c.label}</p>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-sky-200 mb-6">
              {t("results.cta")} <a href="#pricing" className="text-sky-300 hover:text-white underline decoration-sky-300/50 hover:decoration-white transition-colors">{t("results.ctaLink1")}</a> {t("hero.or")} <a href="#contact" className="text-sky-300 hover:text-white underline decoration-sky-300/50 hover:decoration-white transition-colors">{t("results.ctaLink2")}</a> {t("results.ctaEnd")}
            </p>
          </div>
        </Section>

        {/* Teachers Section - Compact Preview */}
        <Section id="teachers" title={t("teachers.title")} subtitle={t("teachers.subtitle")} variant="subtle">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {CONFIG.teachers.map((teacher) => (
              <Card key={teacher.id} className="max-w-md mx-auto group cursor-pointer" CONFIG={CONFIG} onClick={() => setCurrentPage('teachers')}>
                <div className="flex items-center gap-6">
                  <img
                    src={teacher.photo}
                    alt={teacher.name[lang]}
                    className="w-24 h-24 rounded-full ring-2 ring-white/10 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="text-left">
                    <div className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">{teacher.name[lang]}</div>
                    <div className="text-sm text-sky-400 font-medium">{teacher.role[lang]}</div>
                    <button className="mt-3 text-xs font-bold text-sky-300/60 uppercase tracking-widest flex items-center gap-2 group-hover:text-sky-300 transition-colors">
                      {t("hero.subtitleLink")}
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setCurrentPage('teachers')}
              className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all backdrop-blur-xl group flex items-center gap-3 mx-auto"
            >
              {lang === "hy" ? "Տեսնել բոլոր ուսուցիչներին" : lang === "en" ? "View All Teachers" : "Посмотреть всех учителей"}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </Section>

        {/* Pricing */}
        <Section id="pricing" title={t("pricing.title")} subtitle={t("pricing.subtitle")} variant="default">
          <PricingAccordion
            t={t}
            CONFIG={CONFIG}
            lang={lang}
            formatPrice={formatPrice}
            onPlanSelect={handlePlanSelect}
          />
        </Section>

        {/* FAQ */}
        <Section id="faq" title={t("faq.title")} subtitle={t("faq.subtitle")} variant="subtle">
          <div className="relative">
            {/* Decorative Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {t("faq.items").map((f, i) => (
                <FAQItem key={i} q={f.q} a={f.a} />
              ))}
            </div>
          </div>

          <div className="mt-20 text-center relative z-10">
            <div className="inline-block p-1 rounded-3xl bg-gradient-to-r from-sky-500/20 via-white/5 to-indigo-500/20 border border-white/5">
              <div className="px-8 py-6 rounded-[1.25rem] bg-slate-950/80 backdrop-blur-3xl">
                <p className="text-xl text-sky-100/90 font-medium">
                  {t("faq.cta")}
                  <a href="#contact" className="mx-2 text-sky-400 hover:text-white underline underline-offset-8 decoration-2 decoration-sky-400/30 hover:decoration-white transition-all font-bold">
                    {t("faq.ctaLink1")}
                  </a>
                  {t("hero.or")}
                  <a href="#pricing" className="mx-2 text-sky-400 hover:text-white underline underline-offset-8 decoration-2 decoration-sky-400/30 hover:decoration-white transition-all font-bold">
                    {t("faq.ctaLink2")}
                  </a>
                  {t("faq.ctaEnd")}
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Contact Info */}

        <ContactSection
          lang={lang}
          t={t}
          CONFIG={CONFIG}
        />


        {/* Footer */}
        <Footer
          t={t}
          CONFIG={CONFIG}
          lang={lang}
          onPrivacyClick={() => setCurrentPage('privacy')}
        />

        {/* Chat Button */}
        <ChatButton onClick={() => setIsChatOpen(true)} t={t} />

        {/* Chat Modal */}
        <Chat
          lang={lang}
          t={t}
          CONFIG={CONFIG}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      </div>


    </Fragment>
  );
}
