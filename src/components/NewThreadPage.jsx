import { useState } from 'react';
import { createThread } from '../services/forumService';

export function NewThreadPage({ t, token, onCreated, onBack }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState({ sending: false, error: '' });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ sending: true, error: '' });
    try {
      const res = await createThread(token, { title: title.trim(), body: body.trim() });
      onCreated(res.threadId);
    } catch (err) {
      setStatus({ sending: false, error: err.message || 'Failed to create thread' });
    }
  };

  return (
    <div className="min-h-screen bg-sky-950 text-white px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition-colors"
        >
          ← {t('forum.backToForum')}
        </button>

        <h1 className="mt-6 text-2xl font-semibold">{t('forum.newThread')}</h1>
        <p className="mt-1 text-sky-200 text-sm">{t('forum.newThreadSubtitle')}</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-sky-200 mb-1">{t('forum.threadTitle')}</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg bg-sky-950/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/40"
              placeholder={t('forum.threadTitlePh')}
            />
          </div>
          <div>
            <label className="block text-sm text-sky-200 mb-1">{t('forum.threadBody')}</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              className="w-full rounded-lg bg-sky-950/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/40"
              placeholder={t('forum.threadBodyPh')}
            />
          </div>

          <button
            type="submit"
            disabled={status.sending}
            className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-400 text-sky-950 font-semibold px-4 py-2 text-sm hover:opacity-95 disabled:opacity-60"
          >
            {status.sending ? t('forum.creating') : t('forum.create')}
          </button>

          {status.error ? <p className="text-red-200 text-sm">{status.error}</p> : null}
        </form>
      </div>
    </div>
  );
}


