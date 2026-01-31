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
        setThreads(items);
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
    <div className="min-h-screen bg-sky-950 text-white px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{t('forum.title')}</h1>
            <p className="mt-1 text-sky-200 text-sm">{t('forum.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition-colors"
            >
              {t('forum.back')}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isAuthed) return onNewThread('login');
                onNewThread('new');
              }}
              className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-400 text-sky-950 font-semibold px-3 py-2 text-sm hover:opacity-95 transition-opacity"
            >
              {t('forum.newThread')}
            </button>
          </div>
        </div>

        {status.loading ? (
          <p className="mt-6 text-sky-200">{t('forum.loading')}</p>
        ) : status.error ? (
          <p className="mt-6 text-red-200">{status.error}</p>
        ) : (
          <div className="mt-6 space-y-3">
            {threads.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-sky-900/40 p-6 text-sky-200">
                {t('forum.empty')}
              </div>
            ) : (
              threads.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => onOpenThread(th.id)}
                  className="w-full text-left rounded-2xl border border-white/10 bg-sky-900/40 p-5 hover:bg-sky-900/55 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-white font-semibold">{th.title}</div>
                      <div className="mt-1 text-xs text-sky-300/90">
                        {t('forum.by')} <span className="text-sky-200">{th.authorUsername}</span>
                      </div>
                    </div>
                    <div className="text-xs text-sky-200 whitespace-nowrap">
                      {t('forum.replies')}: {Math.max((th.postCount || 1) - 1, 0)}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}


