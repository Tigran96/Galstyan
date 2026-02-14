import { Badge } from "../components/Badge";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { Card } from "../components/Card";

export function TeachersPage({ t, CONFIG, lang, onBack }) {
  // Defensive check for CONFIG and teachers
  const teachersList = CONFIG?.teachers || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col pt-28 pb-32">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Navigation Header */}
        <div className="mb-14">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-3 text-sky-400 hover:text-white transition-colors font-bold group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-sky-500/20 group-hover:border-sky-500/40 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-lg">{t('auth.back') || (lang === 'hy' ? 'Հետ' : 'Back')}</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="mb-20 border-l-4 border-sky-500 pl-8">
          <h1 className="text-4xl md:text-7xl font-bold mb-6">{t("teachers.title")}</h1>
          <p className="text-1xl md:text-2xl text-sky-200/60 max-w-3xl leading-relaxed">
            {t("teachers.subtitle")}
          </p>
        </div>

        {/* Teachers List */}
        <div className="space-y-12">
          {teachersList?.length > 0 ? (
            teachersList.map((teacher, index) => (
              <div 
                key={teacher.id || index} 
                className="shadow-2xl"
              >
                <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 hover:bg-white/[0.08] transition-all duration-500">
                  <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start text-center lg:text-left">
                    {/* Photo */}
                    <div className="shrink-0">
                      <div className="w-48 h-48 md:w-64 md:h-64 rounded-full p-2 bg-gradient-to-br from-white/20 to-sky-500/20 shadow-2xl">
                        <img 
                          src={teacher.photo || './owner.jpg'} 
                          alt={teacher.name?.[lang]} 
                          className="w-full h-full rounded-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-6">
                      <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-3">{teacher.name?.[lang]}</h2>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-sky-500/20 text-sky-300 font-bold text-xs tracking-widest uppercase">
                          {teacher.role?.[lang]}
                        </span>
                      </div>

                      <div className="text-xl text-sky-200">{teacher.experience?.[lang]}</div>

                      <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                        {(teacher.specialties?.[lang] || []).map((spec, idx) => (
                          <Badge key={idx} className="bg-white/10 border-white/10 text-sky-100">{spec}</Badge>
                        ))}
                      </div>

                      {teacher.bio?.[lang] && (
                        <p className="text-xl text-white/70 leading-relaxed font-serif italic pt-6 border-t border-white/5">
                          "{teacher.bio[lang]}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 italic text-sky-300">
              Teacher information not available.
            </div>
          )}
        </div>

        {/* Action Section */}
        <div className="mt-32 p-12 md:p-20 rounded-[4rem] bg-sky-500 text-white text-center shadow-[0_0_100px_rgba(14,165,233,0.1)]">
           <h3 className="text-4xl md:text-5xl font-bold mb-10">{t("teachers.cta")}</h3>
           <div className="flex flex-wrap justify-center gap-6">
              <button 
                onClick={() => { onBack(); setTimeout(() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                className="px-12 py-5 rounded-2xl bg-white text-sky-950 font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl"
              >
                {t("teachers.ctaLink1")}
              </button>
              <button 
                onClick={() => { onBack(); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                className="px-12 py-5 rounded-2xl bg-sky-950 text-white font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl border border-white/10"
              >
                {t("teachers.ctaLink2")}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

