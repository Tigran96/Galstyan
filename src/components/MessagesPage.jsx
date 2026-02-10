import { useEffect, useRef, useState } from 'react';
import {
  createSupportConversation,
  getSupportConversation,
  listSupportConversations,
  markSupportSeen,
  setSupportTyping,
  sendSupportMessage,
} from '../services/supportService';

export function MessagesPage({ t, user, token, onAdminMembers }) {
  const canUseSupport = ['admin', 'moderator', 'pro', 'user'].includes(user?.role);
  const isStaff = ['admin', 'moderator'].includes(user?.role);

  const [convs, setConvs] = useState([]);
  const [convStatus, setConvStatus] = useState({ loading: false, error: '' });
  const [activeConvId, setActiveConvId] = useState(null);
  const [activeConv, setActiveConv] = useState(null);
  const [convMessages, setConvMessages] = useState([]);
  const [typing, setTyping] = useState(null);
  const [msgInput, setMsgInput] = useState('');
  const [msgSending, setMsgSending] = useState(false);
  const [msgFile, setMsgFile] = useState(null);
  const [startMessage, setStartMessage] = useState('');
  const [startSending, setStartSending] = useState(false);
  const [startFile, setStartFile] = useState(null);

  const supportScrollRef = useRef(null);
  const supportWasNearBottomRef = useRef(true);
  const supportInputRef = useRef(null);
  const msgFileInputRef = useRef(null);
  const startFileInputRef = useRef(null);

  const refreshConversations = async () => {
    try {
      setConvStatus({ loading: true, error: '' });
      const rows = await listSupportConversations(token);
      setConvs(rows);
      setConvStatus({ loading: false, error: '' });
      if (!activeConvId && rows?.length) setActiveConvId(rows[0].id);
    } catch (e) {
      setConvStatus({ loading: false, error: e.message || 'Failed to load conversations' });
    }
  };

  const silentRefreshConversations = async () => {
    try {
      const rows = await listSupportConversations(token);
      setConvs(rows);
      if ((!activeConvId || !rows.some((c) => c.id === activeConvId)) && rows?.length) {
        setActiveConvId(rows[0].id);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!token) return;
    if (!canUseSupport) return;
    refreshConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user?.role]);

  useEffect(() => {
    if (!canUseSupport) return;
    if (!convs || convs.length === 0) return;
    if (!activeConvId) {
      setActiveConvId(convs[0].id);
      return;
    }
    const stillExists = convs.some((c) => c.id === activeConvId);
    if (!stillExists) setActiveConvId(convs[0].id);
  }, [canUseSupport, convs, activeConvId]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        if (!activeConvId) {
          setActiveConv(null);
          setConvMessages([]);
          setTyping(null);
          return;
        }
        const data = await getSupportConversation(token, activeConvId);
        if (!mounted) return;
        setActiveConv(data.conversation || null);
        setConvMessages(data.messages || []);
        setTyping(data.typing || null);
        Promise.resolve()
          .then(() => markSupportSeen(token, activeConvId))
          .then(() => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('notifications:changed'));
            }
          })
          .catch(() => {});
      } catch (e) {
        if (!mounted) return;
        setConvStatus((s) => ({ ...s, error: e.message || 'Failed to load conversation' }));
      }
    };
    if (token && canUseSupport) run();
    return () => {
      mounted = false;
    };
  }, [token, activeConvId, canUseSupport]);

  const scrollSupportToBottom = (behavior = 'smooth') => {
    const el = supportScrollRef.current;
    if (!el) return;
    const top = el.scrollHeight;
    try {
      if (typeof el.scrollTo === 'function') el.scrollTo({ top, behavior });
      else el.scrollTop = top;
    } catch {
      el.scrollTop = top;
    }
  };

  const updateNearBottom = () => {
    const el = supportScrollRef.current;
    if (!el) return;
    const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
    supportWasNearBottomRef.current = remaining < 120;
  };

  useEffect(() => {
    const el = supportScrollRef.current;
    if (!el) return;
    updateNearBottom();
    const onScroll = () => updateNearBottom();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [activeConvId]);

  useEffect(() => {
    if (!activeConvId) return;
    if (!supportWasNearBottomRef.current) return;
    scrollSupportToBottom('auto');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConvId, convMessages?.length]);

  // Poll for updates
  useEffect(() => {
    if (!token) return;
    if (!canUseSupport) return;
    if (!activeConvId) return;

    const interval = setInterval(() => {
      if (msgSending || startSending) return;
      Promise.resolve()
        .then(() => getSupportConversation(token, activeConvId))
        .then((data) => {
          setActiveConv(data.conversation || null);
          setConvMessages(data.messages || []);
          setTyping(data.typing || null);
        })
        .catch(() => {});

      if (isStaff) {
        Promise.resolve()
          .then(() => silentRefreshConversations())
          .catch(() => {});
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [token, canUseSupport, activeConvId, isStaff, msgSending, startSending]);

  const sendCurrentSupportMessage = async () => {
    const msg = String(msgInput || '').trim();
    if (!activeConv?.id) return;
    if (msg.length < 1 && !msgFile) {
      setConvStatus((s) => ({ ...s, error: t?.('private.messageTooShort') || 'Message is required' }));
      return;
    }

    setMsgSending(true);
    const optimisticId = `tmp-${Date.now()}`;
    const optimistic = {
      id: optimisticId,
      conversationId: activeConv.id,
      senderUserId: user?.id,
      senderUsername: user?.username,
      senderRole: user?.role,
      body: msg,
      createdAt: new Date().toISOString(),
    };
    setConvMessages((prev) => [...(prev || []), optimistic]);
    setMsgInput('');
    setMsgFile(null);
    if (msgFileInputRef.current) msgFileInputRef.current.value = '';
    requestAnimationFrame(() => supportInputRef.current?.focus?.());
    scrollSupportToBottom('smooth');
    try {
      await sendSupportMessage(token, activeConv.id, { message: msg }, msgFile);
      Promise.resolve()
        .then(() => setSupportTyping(token, activeConv.id, false))
        .catch(() => {});
      Promise.resolve()
        .then(() => getSupportConversation(token, activeConv.id))
        .then((data) => {
          setActiveConv(data.conversation || null);
          setConvMessages(data.messages || []);
          setTyping(data.typing || null);
        })
        .catch(() => {});
      Promise.resolve()
        .then(() => silentRefreshConversations())
        .catch(() => {});
    } catch (e) {
      const raw = String(e?.message || '');
      const friendly =
        raw === 'Failed to fetch'
          ? 'Failed to upload image. Please try a smaller image or check your connection.'
          : raw || 'Failed to send message';
      setConvStatus((s) => ({ ...s, error: friendly }));
      setConvMessages((prev) => (prev || []).filter((m) => m.id !== optimisticId));
    } finally {
      setMsgSending(false);
      requestAnimationFrame(() => supportInputRef.current?.focus?.());
    }
  };

  // Typing indicator
  useEffect(() => {
    if (!token) return;
    if (!activeConv?.id) return;
    if (msgSending) return;

    const text = String(msgInput || '');
    if (!text) {
      Promise.resolve()
        .then(() => setSupportTyping(token, activeConv.id, false))
        .catch(() => {});
      return;
    }

    const t1 = setTimeout(() => {
      Promise.resolve()
        .then(() => setSupportTyping(token, activeConv.id, true))
        .catch(() => {});
    }, 250);

    const t2 = setTimeout(() => {
      Promise.resolve()
        .then(() => setSupportTyping(token, activeConv.id, false))
        .catch(() => {});
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [token, activeConv?.id, msgInput, msgSending]);

  return (
    <div className="min-h-screen bg-sky-950 text-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold">{t?.('private.supportTitle') || 'Messages'}</h1>
            <p className="mt-1 text-sky-200 text-sm">
              {t?.('private.welcome') || 'Welcome,'}{' '}
              <span className="text-white font-medium">{user?.username || '—'}</span>
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-sky-900/40 p-6">
          {!canUseSupport ? (
            <p className="text-sky-200 text-sm">
              {t?.('private.supportNotAvailable') || 'Support chat is available for Pro users.'}
            </p>
          ) : (
            <div>
              {convStatus.error ? <p className="text-red-200 text-sm">{convStatus.error}</p> : null}

              {!isStaff ? (
                <div className="rounded-xl border border-white/10 bg-sky-950/30 p-3">
                  <div className="text-sm text-white font-semibold">
                    {t?.('private.supportStartTitle') || 'Start a conversation'}
                  </div>
                  <p className="mt-1 text-xs text-sky-200">
                    {t?.('private.supportStartHelp') || 'Write your question. Admin/Moderator will reply.'}
                  </p>
                  <textarea
                    className="mt-3 w-full min-h-[90px] rounded-lg bg-sky-950/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/40"
                    value={startMessage}
                    onChange={(e) => setStartMessage(e.target.value)}
                    placeholder={t?.('private.supportStartPh') || 'Describe your problem…'}
                    disabled={startSending}
                  />
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <input
                      ref={startFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setStartFile(e.target.files?.[0] || null)}
                      disabled={startSending}
                    />
                    <button
                      type="button"
                      className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
                      onClick={() => startFileInputRef.current?.click?.()}
                      disabled={startSending}
                      title="Attach image"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 text-sky-100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21.44 11.05l-8.49 8.49a5 5 0 0 1-7.07-7.07l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                    </button>
                    {startFile ? (
                      <div className="flex-1 min-w-0 text-xs text-sky-200 truncate">
                        {startFile.name}
                        <button
                          type="button"
                          className="ml-2 text-sky-300 hover:text-white"
                          onClick={() => {
                            setStartFile(null);
                            if (startFileInputRef.current) startFileInputRef.current.value = '';
                          }}
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="flex-1" />
                    )}
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-400 text-sky-950 font-semibold px-4 py-2 text-sm hover:opacity-95 disabled:opacity-60"
                      disabled={startSending}
                      onClick={async () => {
                        const msg = String(startMessage || '').trim();
                        if (msg.length < 1 && !startFile) {
                          return setConvStatus({
                            loading: false,
                            error: t?.('private.messageTooShort') || 'Message is required',
                          });
                        }
                        setStartSending(true);
                        try {
                          const data = await createSupportConversation(token, { message: msg }, startFile);
                          setStartMessage('');
                          setStartFile(null);
                          if (startFileInputRef.current) startFileInputRef.current.value = '';
                          await refreshConversations();
                          if (data?.conversationId) setActiveConvId(data.conversationId);
                        } catch (e) {
                          setConvStatus({ loading: false, error: e.message || 'Failed to start conversation' });
                        } finally {
                          setStartSending(false);
                        }
                      }}
                    >
                      {startSending ? t?.('private.sending') || 'Sending…' : t?.('private.supportStartBtn') || 'Start'}
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="text-sm text-sky-200">
                  {t?.('private.supportInbox') || 'Inbox'}: <b className="text-white">{convs.length}</b>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10"
                  onClick={refreshConversations}
                  disabled={convStatus.loading}
                >
                  {convStatus.loading ? t?.('private.loading') || 'Loading…' : t?.('private.refresh') || 'Refresh'}
                </button>
              </div>

              {convs.length === 0 ? (
                <p className="mt-3 text-sky-200 text-sm">{t?.('private.supportEmpty') || 'No conversations yet.'}</p>
              ) : (
                <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/10 bg-sky-950/20 overflow-hidden">
                    <div className="max-h-[480px] overflow-auto divide-y divide-white/10">
                      {convs.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setActiveConvId(c.id)}
                          className={`w-full text-left px-3 py-2 hover:bg-white/5 ${
                            activeConvId === c.id ? 'bg-white/10' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-sm text-white font-medium">
                              {isStaff ? (
                                <>
                                  #{c.id}{' '}
                                  {c.proUsername || (t?.('private.user') || 'User')}
                                  <span className="text-sky-200 font-normal">
                                    {c.proEmail ? ` • ${c.proEmail}` : ''}
                                  </span>
                                </>
                              ) : (
                                t?.('private.supportTitle') || 'Support chat'
                              )}
                            </div>
                            <div className="text-[11px] text-sky-300 whitespace-nowrap">
                              {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleString() : ''}
                            </div>
                          </div>
                          <div className="mt-0.5 text-xs text-sky-300">
                            {t?.('private.status') || 'Status'}: {c.status || 'open'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-sky-950/30 p-3 flex flex-col">
                    {!activeConv ? (
                      <p className="text-sky-200 text-sm">{t?.('private.supportSelect') || 'Select a conversation.'}</p>
                    ) : (
                      <>
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm text-white font-semibold">
                            {isStaff ? (
                              <>
                                #{activeConv.id} {t?.('private.user') || 'User'}: {activeConv.proUsername || ''}
                              </>
                            ) : (
                              t?.('private.supportTitle') || 'Support chat'
                            )}
                          </div>
                        </div>

                        <div ref={supportScrollRef} className="mt-3 flex-1 min-h-[220px] max-h-[420px] overflow-auto space-y-2 pr-1">
                          {convMessages.map((m, idx) => {
                            const isMe = Number(m.senderUserId) === Number(user?.id);
                            const prev = idx > 0 ? convMessages[idx - 1] : null;
                            const showName = !isMe && (!prev || prev.senderUserId !== m.senderUserId);
                            return (
                              <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div
                                  className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                                    isMe
                                      ? 'bg-sky-500 text-sky-950'
                                      : 'bg-sky-950/30 border border-white/10 text-sky-100'
                                  }`}
                                >
                                  {showName ? (
                                    <div className="mb-1 text-[11px] text-sky-300">
                                      {m.senderUsername || (t?.('private.user') || 'User')}
                                    </div>
                                  ) : null}
                                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.body}</div>
                                  {m.attachmentUrl ? (
                                    <a href={m.attachmentUrl} target="_blank" rel="noreferrer">
                                      <img
                                        src={m.attachmentUrl}
                                        alt={m.attachmentName || 'attachment'}
                                        className="mt-2 max-h-56 rounded-lg border border-white/10 object-contain bg-black/10"
                                        loading="lazy"
                                      />
                                    </a>
                                  ) : null}
                                  <div className={`mt-1 text-[10px] ${isMe ? 'text-sky-900/70' : 'text-sky-300'}`}>
                                    {m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {typing?.userId ? (
                          <div className="mt-2 flex items-center gap-2 text-xs text-sky-300">
                            <span className="inline-flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-sky-300/80 animate-bounce" />
                              <span className="h-1.5 w-1.5 rounded-full bg-sky-300/80 animate-bounce [animation-delay:120ms]" />
                              <span className="h-1.5 w-1.5 rounded-full bg-sky-300/80 animate-bounce [animation-delay:240ms]" />
                            </span>
                            <span>{t?.('private.typing') || 'Typing…'}</span>
                          </div>
                        ) : null}

                        <div className="mt-3 flex items-end gap-2">
                          <input
                            ref={msgFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setMsgFile(e.target.files?.[0] || null)}
                            disabled={msgSending}
                          />
                          <button
                            type="button"
                            className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
                            onClick={() => msgFileInputRef.current?.click?.()}
                            disabled={msgSending}
                            title="Attach image"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="h-5 w-5 text-sky-100"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21.44 11.05l-8.49 8.49a5 5 0 0 1-7.07-7.07l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                            </svg>
                          </button>
                          <textarea
                            ref={supportInputRef}
                            rows={1}
                            className="flex-1 min-h-10 h-10 max-h-[120px] resize-none rounded-lg bg-sky-950/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/40 leading-5"
                            value={msgInput}
                            onChange={(e) => setMsgInput(e.target.value)}
                            placeholder={t?.('private.writeMessage') || 'Write a message…'}
                            disabled={msgSending}
                            onKeyDown={(e) => {
                              if (e.key !== 'Enter') return;
                              if (e.shiftKey) return;
                              e.preventDefault();
                              if (!msgSending) sendCurrentSupportMessage();
                            }}
                          />
                          <button
                            type="button"
                            className="h-10 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-400 text-sky-950 font-semibold px-4 py-2 text-sm hover:opacity-95 disabled:opacity-60"
                            disabled={msgSending}
                            onClick={sendCurrentSupportMessage}
                          >
                            {msgSending ? t?.('private.sending') || 'Sending…' : t?.('private.send') || 'Send'}
                          </button>
                        </div>
                        {msgFile ? (
                          <div className="mt-2 text-xs text-sky-200 truncate">
                            {msgFile.name}
                            <button
                              type="button"
                              className="ml-2 text-sky-300 hover:text-white"
                              onClick={() => {
                                setMsgFile(null);
                                if (msgFileInputRef.current) msgFileInputRef.current.value = '';
                              }}
                              title="Remove"
                            >
                              ×
                            </button>
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


