import { useEffect, useState } from 'react';
import { listThreads } from '../services/forumService';

export function ForumPage({ t, isAuthed, onNewThread, onOpenThread, onBack }) {
  const [threads, setThreads] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: '' });

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setStatus({ loading: true, error: '' });
        const items = await listThreads();
        if (!mounted) return;
        setThreads(Array.isArray(items) ? items : []);
        setStatus({ loading: false, error: '' });
      } catch (e) {
        if (!mounted) return;
        setStatus({ loading: false, error: e.message || 'Failed to load forum' });
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col pt-28 pb-32">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sky-500/10 blur-[120px] animate-pulse opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse opacity-40"></div>
        <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] rounded-full bg-sky-400/5 blur-[100px] opacity-30"></div>
      </div>

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        {/* Navigation Header */}
        <div className="mb-12">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-3 text-sky-400 hover:text-white transition-all font-bold group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-sky-500/20 group-hover:border-sky-500/40 transition-all shadow-lg">
              <i className="fa-solid fa-chevron-left text-sm"></i>
            </div>
            <span className="text-lg tracking-wide uppercase text-xs">{t('forum.back') || 'Home'}</span>
          </button>
        </div>

        {/* Page Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="border-l-4 border-sky-500 pl-8">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight italic">
              {t('forum.title') || 'Forum'}
            </h1>
            <p className="text-xl text-sky-200/60 max-w-2xl leading-relaxed">
              {t('forum.subtitle') || 'Join the discussion'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!isAuthed) return onNewThread('login');
              onNewThread('new');
            }}
            className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(56,189,248,0.3)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <i className="fa-solid fa-plus-circle text-lg"></i>
            <span>{t('forum.newThread') || 'New Topic'}</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div>
          {status.loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-sky-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-sky-500 rounded-full animate-spin"></div>
              </div>
              <p className="text-sky-300 font-medium tracking-widest animate-pulse">
                {t('forum.loading') || 'Loading...'}
              </p>
            </div>
          ) : status.error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center text-red-200">
              <i className="fa-solid fa-circle-exclamation text-4xl mb-4 text-red-400"></i>
              <p className="text-xl font-medium">{status.error}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {threads.length === 0 ? (
                <div className="rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl p-16 text-center shadow-2xl">
                  <div className="w-20 h-20 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fa-solid fa-comments text-3xl text-sky-400"></i>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{t('forum.emptyTitle') || 'No discussions yet'}</h3>
                  <p className="text-sky-200/50 text-lg">
                    {t('forum.empty') || 'Start the first conversation!'}
                  </p>
                </div>
              ) : (
                threads.map((th, index) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => onOpenThread(th.id)}
                    className="group relative w-full text-left rounded-3xl border border-white/10 bg-white/5 hover:bg-white/[0.08] p-6 md:p-8 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] backdrop-blur-md overflow-hidden"
                  >
                    {/* Hover Decoration */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-sky-400 transition-colors line-clamp-2 leading-snug">
                          {th.title}
                        </h2>

                        <div className="flex flex-wrap items-center gap-6 text-sm">
                          <div className="flex items-center gap-2.5 text-sky-200/70 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                            <i className="fa-solid fa-circle-user text-sky-400"></i>
                            <span className="font-semibold">{th.authorUsername || 'Anonymous'}</span>
                          </div>

                          <div className="flex items-center gap-2.5 text-sky-200/50">
                            <i className="fa-solid fa-clock text-xs"></i>
                            <span>{new Date(th.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-3">
                        <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 group-hover:border-sky-500/30 group-hover:bg-sky-500/5 transition-all">
                          <span className="text-xl font-black text-sky-400">
                            {Math.max((th.postCount || 1) - 1, 0)}
                          </span>
                          <span className="text-[10px] uppercase font-black tracking-widest text-sky-200/40">
                            {t('forum.replies') || 'Replies'}
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sky-200/30 group-hover:text-sky-400 group-hover:translate-x-1 transition-all">
                          <i className="fa-solid fa-arrow-right text-xl"></i>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
