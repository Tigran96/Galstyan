import { useState } from 'react';
import { createThread } from '../services/forumService';

export function NewThreadPage({ t, token, onCreated, onBack }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState({ sending: false, error: '' });

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setStatus({ sending: true, error: '' });
    try {
      const res = await createThread(token, { title: title.trim(), body: body.trim() });
      onCreated(res.threadId);
    } catch (err) {
      setStatus({ sending: false, error: err.message || 'Failed to create thread' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col pt-28 pb-32">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sky-500/10 blur-[120px] animate-float opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] animate-float-delayed opacity-40"></div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        {/* Navigation Header */}
        <div className="mb-12 animate-fade-in">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-3 text-sky-400 hover:text-white transition-all font-bold group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-sky-500/20 group-hover:border-sky-500/40 transition-all shadow-lg">
              <i className="fa-solid fa-chevron-left text-sm"></i>
            </div>
            <span className="text-lg tracking-wide uppercase text-xs">{t('forum.backToForum')}</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-14 backdrop-blur-2xl shadow-2xl animate-fade-in-up">
          <div className="mb-12 border-l-4 border-sky-500 pl-8">
            <h1 className="text-4xl md:text-5xl font-black mb-4 font-heading italic tracking-tight">{t('forum.newThread')}</h1>
            <p className="text-xl text-sky-200/60 leading-relaxed font-medium">
              {t('forum.newThreadSubtitle')}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-8">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-sky-400 ml-1">
                <i className="fa-solid fa-heading text-xs"></i>
                {t('forum.threadTitle')}
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-6 py-4 text-lg outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all placeholder:text-white/10"
                placeholder={t('forum.threadTitlePh')}
                required
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-sky-400 ml-1">
                <i className="fa-solid fa-paragraph text-xs"></i>
                {t('forum.threadBody')}
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-6 py-4 text-lg outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all placeholder:text-white/10 resize-none"
                placeholder={t('forum.threadBodyPh')}
                required
              />
            </div>

            <div className="pt-6 flex flex-col md:flex-row md:items-center gap-8">
              <button
                type="submit"
                disabled={status.sending || !title.trim() || !body.trim()}
                className="relative group px-12 py-5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-black uppercase tracking-widest text-xs hover:scale-[1.05] active:scale-[0.95] transition-all shadow-[0_15px_40px_rgba(56,189,248,0.3)] disabled:opacity-50 disabled:scale-100 disabled:shadow-none min-w-[200px]"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="flex items-center justify-center gap-3">
                  {status.sending ? (
                    <>
                      <i className="fa-solid fa-circle-notch animate-spin text-lg"></i>
                      {t('forum.creating')}
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane text-lg"></i>
                      {t('forum.create')}
                    </>
                  )}
                </span>
              </button>

              {status.error && (
                <div className="flex items-center gap-3 text-red-400 font-bold bg-red-400/10 px-6 py-4 rounded-2xl border border-red-400/20 animate-wiggle">
                  <i className="fa-solid fa-triangle-exclamation text-xl"></i>
                  <span>{status.error}</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


