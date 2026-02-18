import { useEffect, useRef, useState } from 'react';
import {
  createSupportConversation,
  deleteSupportConversation,
  getSupportConversation,
  listSupportConversations,
  markSupportSeen,
  setSupportTyping,
  sendSupportMessage,
} from '../services/supportService';

export function MessagesPage({ t, user, token, onAdminMembers }) {
  const canUseSupport = ['admin', 'moderator', 'pro', 'user'].includes(user?.role);
  const isStaff = ['admin', 'moderator'].includes(user?.role);
  const NEW_CHAT_ID = '__new_chat__';

  const [convs, setConvs] = useState([]);
  const [convStatus, setConvStatus] = useState({ loading: false, error: '' });
  const [activeConvId, setActiveConvId] = useState(null);
  const [activeConv, setActiveConv] = useState(null);
  const [convMessages, setConvMessages] = useState([]);
  const [typing, setTyping] = useState(null);
  const [msgInput, setMsgInput] = useState('');
  const [msgSending, setMsgSending] = useState(false);
  const [msgFile, setMsgFile] = useState(null);
  const [deletingConvId, setDeletingConvId] = useState(null);

  const supportScrollRef = useRef(null);
  const supportWasNearBottomRef = useRef(true);
  const supportInputRef = useRef(null);
  const msgFileInputRef = useRef(null);

  const focusSupportInputSafe = () => {
    const el = supportInputRef.current;
    if (!el) return;
    const y = typeof window !== 'undefined' ? window.scrollY : 0;
    try {
      el.focus({ preventScroll: true });
    } catch {
      el.focus();
      if (typeof window !== 'undefined') window.scrollTo({ top: y, left: 0, behavior: 'auto' });
    }
  };

  const applyConversationSnapshot = (data) => {
    if (!data) return;
    const nextConv = data.conversation || null;
    const nextMsgs = data.messages || [];
    const nextTyping = data.typing || null;

    setActiveConv((prev) => {
      const prevId = prev?.id ?? null;
      const nextId = nextConv?.id ?? null;
      const same =
        prevId === nextId &&
        String(prev?.status || '') === String(nextConv?.status || '') &&
        String(prev?.title || '') === String(nextConv?.title || '') &&
        String(prev?.lastMessageAt || '') === String(nextConv?.lastMessageAt || '');
      return same ? prev : nextConv;
    });

    setConvMessages((prev) => {
      const prevLen = prev?.length || 0;
      const nextLen = nextMsgs?.length || 0;
      const prevLast = prevLen ? prev[prevLen - 1]?.id : null;
      const nextLast = nextLen ? nextMsgs[nextLen - 1]?.id : null;
      if (prevLen === nextLen && prevLast === nextLast) return prev;
      return nextMsgs;
    });

    setTyping((prev) => {
      const prevUser = prev?.userId ?? null;
      const nextUser = nextTyping?.userId ?? null;
      return prevUser === nextUser ? prev : nextTyping;
    });
  };

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
    if (activeConvId === NEW_CHAT_ID) return;
    if (!convs || convs.length === 0) return;
    if (!activeConvId) {
      setActiveConvId(convs[0].id);
      return;
    }
    const stillExists = convs.some((c) => c.id === activeConvId);
    if (!stillExists) setActiveConvId(convs[0].id);
  }, [canUseSupport, convs, activeConvId, NEW_CHAT_ID]);

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
        if (activeConvId === NEW_CHAT_ID) {
          setActiveConv({ id: null, status: 'open' });
          setConvMessages([]);
          setTyping(null);
          return;
        }
        const data = await getSupportConversation(token, activeConvId);
        if (!mounted) return;
        applyConversationSnapshot(data);
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
  }, [token, activeConvId, canUseSupport, NEW_CHAT_ID]);

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
    if (activeConvId === NEW_CHAT_ID) return;

    const interval = setInterval(() => {
      if (msgSending) return;
      Promise.resolve()
        .then(() => getSupportConversation(token, activeConvId))
        .then((data) => applyConversationSnapshot(data))
        .catch(() => {});

      if (isStaff) {
        Promise.resolve()
          .then(() => silentRefreshConversations())
          .catch(() => {});
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [token, canUseSupport, activeConvId, isStaff, msgSending, NEW_CHAT_ID]);

  const sendCurrentSupportMessage = async () => {
    const msg = String(msgInput || '').trim();
    if (msg.length < 1 && !msgFile) {
      setConvStatus((s) => ({ ...s, error: t?.('private.messageTooShort') || 'Message is required' }));
      return;
    }

    const isDraftChat = activeConvId === NEW_CHAT_ID || !activeConv?.id;
    setMsgSending(true);
    setMsgInput('');
    setMsgFile(null);
    if (msgFileInputRef.current) msgFileInputRef.current.value = '';
    requestAnimationFrame(() => focusSupportInputSafe());
    let optimisticId = null;
    if (!isDraftChat) {
      optimisticId = `tmp-${Date.now()}`;
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
      scrollSupportToBottom('smooth');
    }

    try {
      if (isDraftChat) {
        const data = await createSupportConversation(token, { message: msg }, msgFile);
        const newId = data?.conversationId;
        await refreshConversations();
        if (newId) setActiveConvId(newId);
      } else {
        await sendSupportMessage(token, activeConv.id, { message: msg }, msgFile);
      }
      Promise.resolve()
        .then(() => (activeConv?.id ? setSupportTyping(token, activeConv.id, false) : null))
        .catch(() => {});
      // Keep optimistic message; polling will refresh in background.
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
      if (optimisticId) {
        setConvMessages((prev) => (prev || []).filter((m) => m.id !== optimisticId));
      }
    } finally {
      setMsgSending(false);
      requestAnimationFrame(() => focusSupportInputSafe());
    }
  };

  const deleteCurrentConversation = async () => {
    if (activeConvId === NEW_CHAT_ID) return;
    const convId = Number(activeConvId);
    if (!Number.isFinite(convId)) return;

    const question = t?.('private.deleteChatConfirm') || 'Delete this chat? This action cannot be undone.';
    if (typeof window !== 'undefined' && !window.confirm(question)) return;

    setDeletingConvId(convId);
    setConvStatus((s) => ({ ...s, error: '' }));
    try {
      await deleteSupportConversation(token, convId);
      const rows = await listSupportConversations(token);
      setConvs(rows || []);
      const nextId = rows?.[0]?.id || null;
      setActiveConvId(nextId);
      if (!nextId) {
        setActiveConv(null);
        setConvMessages([]);
        setTyping(null);
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('notifications:changed'));
      }
    } catch (e) {
      setConvStatus((s) => ({ ...s, error: e.message || 'Failed to delete conversation' }));
    } finally {
      setDeletingConvId(null);
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
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="text-sm text-sky-200">
                  {t?.('private.supportInbox') || 'Inbox'}: <b className="text-white">{convs.length}</b>
                </div>
                <div className="flex items-center gap-2">
                  {!isStaff ? (
                    <button
                      type="button"
                      className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
                      onClick={() => {
                        setConvStatus((s) => ({ ...s, error: '' }));
                        setActiveConvId(NEW_CHAT_ID);
                        setConvMessages([]);
                        setTyping(null);
                        setMsgInput('');
                        setMsgFile(null);
                        if (msgFileInputRef.current) msgFileInputRef.current.value = '';
                        requestAnimationFrame(() => focusSupportInputSafe());
                      }}
                      title={t?.('private.supportStartBtn') || 'New chat'}
                      aria-label={t?.('private.supportStartBtn') || 'New chat'}
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 text-sky-100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                      </svg>
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10"
                    onClick={refreshConversations}
                    disabled={convStatus.loading}
                  >
                    {convStatus.loading ? t?.('private.loading') || 'Loading…' : t?.('private.refresh') || 'Refresh'}
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="h-[540px] rounded-xl border border-white/10 bg-sky-950/20 overflow-hidden">
                    <div className="h-full overflow-auto divide-y divide-white/10">
                      {!isStaff && activeConvId === NEW_CHAT_ID ? (
                        <button
                          type="button"
                          onClick={() => setActiveConvId(NEW_CHAT_ID)}
                          className="w-full text-left px-3 py-2 bg-white/10"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-sm text-white font-medium">{t?.('private.supportStartTitle') || 'New chat'}</div>
                            <div className="text-[11px] text-sky-300 whitespace-nowrap">{t?.('private.status') || 'Status'}: draft</div>
                          </div>
                        </button>
                      ) : null}
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
                                  {c.title || (t?.('private.supportTitle') || 'Support chat')}
                                </>
                              ) : (
                                c.title || t?.('private.supportTitle') || 'Support chat'
                              )}
                            </div>
                            <div className="text-[11px] text-sky-300 whitespace-nowrap">
                              {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleString() : ''}
                            </div>
                          </div>
                          <div className="mt-0.5 text-xs text-sky-300">
                            {isStaff ? (
                              <>
                                {c.proUsername || (t?.('private.user') || 'User')}
                                <span className="text-sky-200">{c.proEmail ? ` • ${c.proEmail}` : ''}</span>
                                <span> • </span>
                              </>
                            ) : null}
                            {t?.('private.status') || 'Status'}: {c.status || 'open'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-[540px] rounded-xl border border-white/10 bg-sky-950/30 p-3 flex flex-col">
                    {!activeConv ? (
                      <p className="text-sky-200 text-sm">{t?.('private.supportSelect') || 'Select a conversation.'}</p>
                    ) : (
                      <>
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm text-white font-semibold">
                            {isStaff ? (
                              <>
                                #{activeConv.id}{' '}
                                {activeConv.title || `${t?.('private.user') || 'User'}: ${activeConv.proUsername || ''}`}
                              </>
                            ) : (
                              activeConvId === NEW_CHAT_ID
                                ? t?.('private.supportStartTitle') || 'New chat'
                                : activeConv.title || t?.('private.supportTitle') || 'Support chat'
                            )}
                          </div>
                          {activeConvId !== NEW_CHAT_ID && activeConv?.id ? (
                            <button
                              type="button"
                              className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-red-300/30 bg-red-500/10 text-red-200 hover:bg-red-500/20 disabled:opacity-60"
                              onClick={deleteCurrentConversation}
                              disabled={msgSending || deletingConvId === activeConv.id}
                              title={t?.('private.deleteChat') || 'Delete chat'}
                              aria-label={t?.('private.deleteChat') || 'Delete chat'}
                            >
                              {deletingConvId === activeConv.id ? (
                                <span className="text-sm">…</span>
                              ) : (
                                <svg
                                  viewBox="0 0 24 24"
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M8 6V4h8v2" />
                                  <path d="M19 6l-1 14H6L5 6" />
                                  <path d="M10 11v6" />
                                  <path d="M14 11v6" />
                                </svg>
                              )}
                            </button>
                          ) : null}
                        </div>

                        <div ref={supportScrollRef} className="mt-3 flex-1 min-h-0 overflow-auto space-y-2 pr-1">
                          {activeConvId === NEW_CHAT_ID ? (
                            <div className="text-sm text-sky-200">
                              {t?.('private.supportStartHelp') || 'Write your question. We will reply.'}
                            </div>
                          ) : null}
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
                            className="h-10 w-10 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-sky-500 to-indigo-400 text-sky-950 hover:opacity-95 disabled:opacity-60"
                            disabled={msgSending}
                            onClick={sendCurrentSupportMessage}
                            aria-label={t?.('private.send') || 'Send'}
                            title={t?.('private.send') || 'Send'}
                          >
                            {msgSending ? (
                              <span className="text-sm font-semibold">…</span>
                            ) : (
                              <svg
                                viewBox="0 0 24 24"
                                className="block h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M22 2L11 13" />
                                <path d="M22 2l-7 20-4-9-9-4 20-7Z" />
                              </svg>
                            )}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


