import { useEffect, useState } from 'react';
import { addReply, deleteThread, getThread } from '../services/forumService';

export function ForumThreadPage({ t, threadId, isAuthed, token, user, onBack, onGoLogin, onDeleted }) {
  const [data, setData] = useState({ thread: null, posts: [] });
  const [reply, setReply] = useState('');
  const [status, setStatus] = useState({ loading: true, error: '', sending: false, deleting: false });

  const load = async () => {
    try {
      setStatus((s) => ({ ...s, loading: true, error: '' }));
      const res = await getThread(threadId);
      setData(res);
      setStatus((s) => ({ ...s, loading: false }));
    } catch (e) {
      setStatus((s) => ({ ...s, loading: false, error: e.message || 'Failed' }));
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  const send = async () => {
    if (!isAuthed) return onGoLogin();
    const body = reply.trim();
    if (!body) return;
    setStatus((s) => ({ ...s, sending: true, error: '' }));
    try {
      await addReply(token, threadId, body);
      setReply('');
      await load();
      setStatus((s) => ({ ...s, sending: false }));
    } catch (e) {
      setStatus((s) => ({ ...s, sending: false, error: e.message || 'Failed to reply' }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col pt-28 pb-32">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-500/10 blur-[120px] animate-float opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] animate-float-delayed opacity-40"></div>
      </div>

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-12 animate-fade-in">
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

          {user?.role === 'admin' ? (
            <button
              type="button"
              onClick={async () => {
                if (!confirm(t('forum.deleteConfirm'))) return;
                setStatus((s) => ({ ...s, deleting: true, error: '' }));
                try {
                  await deleteThread(token, threadId);
                  onDeleted?.();
                } catch (e) {
                  setStatus((s) => ({ ...s, deleting: false, error: e.message || t('forum.deleteFailed') }));
                }
              }}
              disabled={!isAuthed || status.deleting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs font-black uppercase tracking-widest text-red-100 hover:bg-red-500/20 transition-all disabled:opacity-60"
            >
              {status.deleting ? (
                <>
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                  <span>{t('forum.deleting')}</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-trash-can"></i>
                  <span>{t('forum.deleteThread')}</span>
                </>
              )}
            </button>
          ) : null}
        </div>

        {status.loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-sky-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-sky-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-sky-300 font-medium tracking-widest animate-pulse">
              {t('forum.loading')}
            </p>
          </div>
        ) : status.error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center text-red-200">
            <i className="fa-solid fa-circle-exclamation text-4xl mb-4 text-red-400"></i>
            <p className="text-xl font-medium">{status.error}</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Thread Title Header */}
            <div className="animate-fade-in-up">
              <div className="inline-block px-4 py-1.5 rounded-full bg-sky-500/10 text-sky-400 font-black text-[10px] tracking-[0.2em] uppercase mb-6 border border-sky-500/20 shadow-[0_0_20px_rgba(14,165,233,0.1)]">
                Discussion Thread
              </div>
              <h1 className="text-3xl md:text-5xl font-black mb-4 font-heading leading-tight italic tracking-tight text-white">
                {data.thread?.title}
              </h1>
            </div>

            {/* Posts List */}
            <div className="space-y-6 animate-fade-in-up delay-[200ms]">
              {data.posts.map((p, index) => (
                <div
                  key={p.id}
                  className={`group relative rounded-[2rem] border border-white/10 bg-white/5 p-8 md:p-10 backdrop-blur-md transition-all duration-500 hover:bg-white/[0.07] ${index === 0 ? 'ring-2 ring-sky-500/20' : ''}`}
                >
                  <div className="flex items-start gap-6">
                    <div className="shrink-0 hidden md:block">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg text-white font-black text-xl italic uppercase">
                        {p.authorUsername?.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sky-400">
                          <i className="fa-solid fa-user-circle text-lg md:hidden"></i>
                          <span className="font-black text-sm uppercase tracking-wider">{p.authorUsername}</span>
                        </div>
                        {index === 0 && (
                          <span className="px-3 py-1 rounded-lg bg-sky-500/20 text-sky-300 text-[10px] font-black uppercase tracking-widest border border-sky-500/30">
                            Author
                          </span>
                        )}
                        <span className="text-white/20 text-xs">•</span>
                        <span className="text-white/30 text-xs font-medium">#{index + 1}</span>
                      </div>
                      <div className="text-lg md:text-xl text-sky-50/90 leading-relaxed whitespace-pre-wrap selection:bg-sky-500/30 selection:text-white">
                        {p.body}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Section */}
            <div className="mt-16 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-2xl shadow-2xl animate-fade-in-up delay-[400ms]">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400">
                  <i className="fa-solid fa-reply"></i>
                </div>
                <h3 className="text-2xl font-bold font-heading">{t('forum.replyTitle')}</h3>
              </div>

              {!isAuthed && (
                <div className="mb-6 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4 text-amber-200 italic">
                  <i className="fa-solid fa-lock"></i>
                  <p>
                    {t('forum.loginToReply')}{' '}
                    <button
                      type="button"
                      onClick={onGoLogin}
                      className="font-bold underline decoration-amber-500/30 hover:text-white transition-colors"
                    >
                      {t('auth.loginNav')}
                    </button>
                  </p>
                </div>
              )}

              <div className="relative group">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={4}
                  disabled={!isAuthed}
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-6 py-5 text-lg outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all placeholder:text-white/20 disabled:opacity-50 resize-none"
                  placeholder={t('forum.replyPlaceholder')}
                />
                {!isAuthed && (
                  <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] rounded-2xl cursor-not-allowed"></div>
                )}
              </div>

              <div className="mt-8 flex flex-col md:flex-row md:items-center gap-6">
                <button
                  type="button"
                  onClick={send}
                  disabled={!isAuthed || status.sending || !reply.trim()}
                  className="relative group px-10 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-black uppercase tracking-widest text-xs hover:scale-[1.05] active:scale-[0.95] transition-all shadow-[0_10px_30px_rgba(56,189,248,0.3)] disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="flex items-center justify-center gap-3">
                    {status.sending ? (
                      <>
                        <i className="fa-solid fa-circle-notch animate-spin"></i>
                        {t('forum.sending')}
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-paper-plane"></i>
                        {t('forum.sendReply')}
                      </>
                    )}
                  </span>
                </button>
                {status.error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm font-bold bg-red-400/10 px-4 py-2 rounded-xl border border-red-400/20">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    {status.error}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


