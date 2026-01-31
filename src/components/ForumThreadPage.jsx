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
    <div className="min-h-screen bg-sky-950 text-white px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition-colors"
          >
            ← {t('forum.backToForum')}
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
              className="rounded-lg bg-red-500/20 border border-red-500/30 px-3 py-2 text-sm text-red-100 hover:bg-red-500/25 transition-colors disabled:opacity-60"
            >
              {status.deleting ? t('forum.deleting') : t('forum.deleteThread')}
            </button>
          ) : null}
        </div>

        {status.loading ? (
          <p className="mt-6 text-sky-200">{t('forum.loading')}</p>
        ) : status.error ? (
          <p className="mt-6 text-red-200">{status.error}</p>
        ) : (
          <>
            <h1 className="mt-6 text-2xl font-semibold">{data.thread?.title}</h1>

            <div className="mt-6 space-y-3">
              {data.posts.map((p) => (
                <div key={p.id} className="rounded-2xl border border-white/10 bg-sky-900/40 p-5">
                  <div className="text-xs text-sky-300/90">
                    {t('forum.by')} <span className="text-sky-200">{p.authorUsername}</span>
                  </div>
                  <div className="mt-2 text-sky-100 whitespace-pre-wrap">{p.body}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-sky-900/40 p-5">
              <div className="text-white font-semibold">{t('forum.replyTitle')}</div>
              {!isAuthed ? (
                <div className="mt-2 text-sky-200 text-sm">
                  {t('forum.loginToReply')}{' '}
                  <button
                    type="button"
                    onClick={onGoLogin}
                    className="text-sky-200 hover:text-white underline decoration-sky-300/40 hover:decoration-white"
                  >
                    {t('auth.loginNav')}
                  </button>
                </div>
              ) : null}
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
                className="mt-3 w-full rounded-lg bg-sky-950/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/40"
                placeholder={t('forum.replyPlaceholder')}
              />
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={send}
                  disabled={!isAuthed || status.sending}
                  className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-400 text-sky-950 font-semibold px-4 py-2 text-sm hover:opacity-95 disabled:opacity-60"
                >
                  {status.sending ? t('forum.sending') : t('forum.sendReply')}
                </button>
                {status.error ? <span className="text-sm text-red-200">{status.error}</span> : null}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


