import { useEffect, useRef, useState } from 'react';
import { getMyNotifications, getSentNotifications, markNotificationRead } from '../services/notificationService';
import {
  createSupportConversation,
  getSupportConversation,
  listSupportConversations,
  markSupportSeen,
  setSupportTyping,
  sendSupportMessage,
} from '../services/supportService';

export function DashboardPage({ t, user, token, onLogout, onBackHome, onAdminMembers }) {
  const [notifs, setNotifs] = useState([]);
  const [notifStatus, setNotifStatus] = useState({ loading: false, error: '' });
  const [notifFilter, setNotifFilter] = useState('all'); // 'unread' | 'all'
  const [markingId, setMarkingId] = useState(null);

  const canSendNotifs = ['admin', 'moderator'].includes(user?.role);
  const [sent, setSent] = useState([]);
  const [sentStatus, setSentStatus] = useState({ loading: false, error: '' });

  // Support chat (left side)
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
  const [startMessage, setStartMessage] = useState('');
  const [startSending, setStartSending] = useState(false);
  const supportScrollRef = useRef(null);
  const supportWasNearBottomRef = useRef(true);
  const supportInputRef = useRef(null);


  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setNotifStatus({ loading: true, error: '' });
        const rows = await getMyNotifications(token);
        if (!mounted) return;
        setNotifs(rows);
        setNotifStatus({ loading: false, error: '' });
      } catch (e) {
        if (!mounted) return;
        setNotifStatus({ loading: false, error: e.message || 'Failed to load notifications' });
      }
    };
    if (token) run();
    return () => {
      mounted = false;
    };
  }, [token]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setSentStatus({ loading: true, error: '' });
        const rows = await getSentNotifications(token);
        if (!mounted) return;
        setSent(rows);
        setSentStatus({ loading: false, error: '' });
      } catch (e) {
        if (!mounted) return;
        setSentStatus({ loading: false, error: e.message || 'Failed to load sent history' });
      }
    };
    if (token && canSendNotifs) run();
    return () => {
      mounted = false;
    };
  }, [token, canSendNotifs]);

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

  const fireAndForgetRefreshConversations = () => {
    Promise.resolve()
      .then(() => refreshConversations())
      .catch(() => {});
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

  // Always keep a conversation "open" when there is at least one.
  useEffect(() => {
    if (!canUseSupport) return;
    if (!convs || convs.length === 0) return;

    if (!activeConvId) {
      setActiveConvId(convs[0].id);
      return;
    }

    const stillExists = convs.some((c) => c.id === activeConvId);
    if (!stillExists) {
      setActiveConvId(convs[0].id);
    }
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
        // Mark this conversation as seen (best-effort) so tab unread badge clears.
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
      if (typeof el.scrollTo === 'function') {
        el.scrollTo({ top, behavior });
      } else {
        el.scrollTop = top;
      }
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

  // Keep track of whether user is near bottom (so we don't fight when scrolling old messages).
  useEffect(() => {
    const el = supportScrollRef.current;
    if (!el) return;
    updateNearBottom();
    const onScroll = () => updateNearBottom();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [activeConvId]);

  // Auto-scroll when new messages arrive, only if user was near bottom.
  useEffect(() => {
    if (!activeConvId) return;
    if (!supportWasNearBottomRef.current) return;
    scrollSupportToBottom('auto');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConvId, convMessages?.length]);


  // Poll for incoming support messages (simple refresh without websockets).
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

      // Also refresh inbox list for staff (new conversations / ordering).
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
    if (msg.length < 1) {
      setConvStatus((s) => ({
        ...s,
        error: t?.('private.messageTooShort') || 'Message is required',
      }));
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
    // Keep focus in the input for fast consecutive messages.
    requestAnimationFrame(() => {
      supportInputRef.current?.focus?.();
    });
    scrollSupportToBottom('smooth');
    try {
      await sendSupportMessage(token, activeConv.id, msg);
      // Stop typing after successful send.
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
      fireAndForgetRefreshConversations();
    } catch (e) {
      setConvStatus((s) => ({ ...s, error: e.message || 'Failed to send message' }));
      setConvMessages((prev) => (prev || []).filter((m) => m.id !== optimisticId));
    } finally {
      setMsgSending(false);
      requestAnimationFrame(() => {
        supportInputRef.current?.focus?.();
      });
    }
  };

  // Typing indicator: ping server while user is typing (debounced with inactivity timeout).
  useEffect(() => {
    if (!token) return;
    if (!activeConv?.id) return;
    if (msgSending) return;

    const text = String(msgInput || '');
    if (!text) {
      // Stop typing quickly when input cleared.
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
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{t('private.title')}</h1>
            <p className="mt-1 text-sky-200 text-sm">
              {t('private.welcome')}{' '}
              <span className="text-white font-medium">{user?.username || '—'}</span>
            </p>
            <div className="mt-2 text-xs text-sky-200">
              {t?.('private.role') || 'Role'}:{' '}
              <span className="inline-flex items-center px-2 py-1 rounded bg-white/10 text-white">
                {user?.role || 'user'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {['admin', 'moderator'].includes(user?.role) ? (
              <button
                type="button"
                onClick={onAdminMembers}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition-colors"
              >
                {t?.('admin.members.title') || 'Members'}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('nav:profile'))}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition-colors"
            >
              {t?.('private.profileNav') || 'Profile'}
            </button>
            <button
              type="button"
              onClick={onBackHome}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition-colors"
            >
              {t('private.home')}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg bg-red-500/20 border border-red-500/30 px-3 py-2 text-sm text-red-100 hover:bg-red-500/25 transition-colors"
            >
              {t('private.logout')}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-sky-900/40 p-6">
            <div className="text-white font-semibold">{t?.('private.supportTitle') || 'Support'}</div>

            {!canUseSupport ? (
              <p className="mt-3 text-sky-200 text-sm">
                {t?.('private.supportNotAvailable') || 'Support chat is available for Pro users.'}
              </p>
            ) : (
              <div className="mt-4">
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
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-400 text-sky-950 font-semibold px-4 py-2 text-sm hover:opacity-95 disabled:opacity-60"
                        disabled={startSending}
                        onClick={async () => {
                          const msg = String(startMessage || '').trim();
                          if (msg.length < 1) {
                            return setConvStatus({
                              loading: false,
                              error: t?.('private.messageTooShort') || 'Message is required',
                            });
                          }
                          setStartSending(true);
                          try {
                            const data = await createSupportConversation(token, msg);
                            setStartMessage('');
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
                  <div className="mt-3 grid grid-cols-1 gap-3">
                    <div className="rounded-xl border border-white/10 bg-sky-950/20 overflow-hidden">
                      <div className="max-h-40 overflow-auto divide-y divide-white/10">
                        {convs.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setActiveConvId(c.id)}
                            className={`w-full text-left px-3 py-2 hover:bg-white/5 ${activeConvId === c.id ? 'bg-white/10' : ''}`}
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

                    <div className="rounded-xl border border-white/10 bg-sky-950/30 p-3">
                      {!activeConv ? (
                        <p className="text-sky-200 text-sm">{t?.('private.supportSelect') || 'Select a conversation.'}</p>
                      ) : (
                        <>
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-sm text-white font-semibold">
                              {isStaff ? (
                                <>
                                  #{activeConv.id}{' '}
                                  {t?.('private.user') || 'User'}: {activeConv.proUsername || ''}
                                </>
                              ) : (
                                t?.('private.supportTitle') || 'Support chat'
                              )}
                            </div>
                            <div className="text-xs text-sky-300">
                              {isStaff && activeConv.proUsername ? `${t?.('private.user') || 'User'}: ${activeConv.proUsername}` : ''}
                            </div>
                          </div>

                            <div ref={supportScrollRef} className="mt-3 max-h-52 overflow-auto space-y-2 pr-1">
                            {convMessages.map((m, idx) => {
                              const isMe = Number(m.senderUserId) === Number(user?.id);
                              const prev = idx > 0 ? convMessages[idx - 1] : null;
                              const showName = !isMe && (!prev || prev.senderUserId !== m.senderUserId);
                              return (
                                <div
                                  key={m.id}
                                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                >
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
                            <textarea
                              ref={supportInputRef}
                              className="flex-1 min-h-[44px] max-h-[120px] rounded-lg bg-sky-950/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/40"
                              value={msgInput}
                              onChange={(e) => setMsgInput(e.target.value)}
                              placeholder={t?.('private.writeMessage') || 'Write a message…'}
                              disabled={msgSending}
                              onKeyDown={(e) => {
                                if (e.key !== 'Enter') return;
                                if (e.shiftKey) return; // newline
                                e.preventDefault();
                                if (!msgSending) sendCurrentSupportMessage();
                              }}
                              onFocus={() => {
                                if (!activeConv?.id) return;
                                Promise.resolve()
                                  .then(() => setSupportTyping(token, activeConv.id, true))
                                  .catch(() => {});
                              }}
                              onBlur={() => {
                                if (!activeConv?.id) return;
                                Promise.resolve()
                                  .then(() => setSupportTyping(token, activeConv.id, false))
                                  .catch(() => {});
                              }}
                            />
                            <button
                              type="button"
                              className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-400 text-sky-950 font-semibold px-4 py-2 text-sm hover:opacity-95 disabled:opacity-60"
                              disabled={msgSending}
                              onClick={sendCurrentSupportMessage}
                            >
                              {msgSending ? t?.('private.sending') || 'Sending…' : t?.('private.send') || 'Send'}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-sky-900/40 p-6">
            <div className="text-white font-semibold">{t?.('private.notificationsTitle') || 'Notifications'}</div>

            {(
              <>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                className={`px-3 py-1 rounded-lg text-sm border ${
                  notifFilter === 'unread' ? 'bg-white/15 border-white/20' : 'bg-white/5 border-white/10'
                }`}
                onClick={() => setNotifFilter('unread')}
              >
                {t?.('private.notificationsUnread') || 'Unread'}
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded-lg text-sm border ${
                  notifFilter === 'all' ? 'bg-white/15 border-white/20' : 'bg-white/5 border-white/10'
                }`}
                onClick={() => setNotifFilter('all')}
              >
                {t?.('private.notificationsAll') || 'All'}
              </button>
              <div className="ml-auto text-xs text-sky-200">
                {(notifs || []).filter((n) => !n.isRead).length} {t?.('private.unreadCount') || 'unread'}
              </div>
            </div>

            {notifStatus.loading ? (
              <p className="mt-3 text-sky-200 text-sm">{t?.('private.loading') || 'Loading…'}</p>
            ) : notifStatus.error ? (
              <p className="mt-3 text-red-200 text-sm">{notifStatus.error}</p>
            ) : (notifs || []).filter((n) => (notifFilter === 'unread' ? !n.isRead : true)).length === 0 ? (
              <p className="mt-3 text-sky-200 text-sm">{t?.('private.notificationsEmpty') || 'No notifications yet.'}</p>
            ) : (
              <div className="mt-3 space-y-3 max-h-72 overflow-auto pr-2">
                {(notifs || [])
                  .filter((n) => (notifFilter === 'unread' ? !n.isRead : true))
                  .map((n) => (
                    <div
                      key={n.id}
                      className={`rounded-xl border border-white/10 bg-sky-950/30 p-3 ${n.isRead ? 'opacity-80' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-semibold text-white flex items-center gap-2">
                          {n.title}
                          {!n.isRead ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/30 text-sky-100">
                              {t?.('private.unread') || 'UNREAD'}
                            </span>
                          ) : null}
                        </div>
                        <div className="text-[11px] text-sky-300 whitespace-nowrap">
                          {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                        </div>
                      </div>
                      <div className="mt-1 text-sm text-sky-200 whitespace-pre-wrap">{n.message}</div>
                      {n.senderUsername ? (
                        <div className="mt-2 text-xs text-sky-300">
                          {t?.('private.from') || 'From'}: {n.senderUsername} ({n.senderRole || 'user'})
                        </div>
                      ) : null}

                      {!n.isRead ? (
                        <div className="mt-3 flex justify-end">
                          <button
                            type="button"
                            className="px-3 py-1 rounded-lg text-xs border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-60"
                            disabled={markingId === n.id}
                            onClick={async () => {
                              setMarkingId(n.id);
                              try {
                                await markNotificationRead(token, n.id);
                                setNotifs((prev) =>
                                  (prev || []).map((x) =>
                                    x.id === n.id ? { ...x, isRead: true, readAt: new Date().toISOString() } : x
                                  )
                                );
                              // Keep message visible after marking as read.
                              setNotifFilter('all');
                                if (typeof window !== 'undefined') {
                                  window.dispatchEvent(new Event('notifications:changed'));
                                }
                              } catch (e) {
                                setNotifStatus((s) => ({ ...s, error: e.message || 'Failed to mark read' }));
                              } finally {
                                setMarkingId(null);
                              }
                            }}
                          >
                            {markingId === n.id ? t?.('private.marking') || 'Marking…' : t?.('private.markRead') || 'Mark as read'}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ))}
              </div>
            )}

            {canSendNotifs ? (
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="text-white font-semibold">{t?.('private.sentTitle') || 'Sent notifications'}</div>
                {sentStatus.loading ? (
                  <p className="mt-2 text-sky-200 text-sm">{t?.('private.loading') || 'Loading…'}</p>
                ) : sentStatus.error ? (
                  <p className="mt-2 text-red-200 text-sm">{sentStatus.error}</p>
                ) : sent.length === 0 ? (
                  <p className="mt-2 text-sky-200 text-sm">{t?.('private.sentEmpty') || 'No sent notifications yet.'}</p>
                ) : (
                  <div className="mt-3 space-y-3 max-h-56 overflow-auto pr-2">
                    {sent.map((s) => (
                      <div key={s.id} className="rounded-xl border border-white/10 bg-sky-950/30 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="font-semibold text-white">{s.title}</div>
                          <div className="text-[11px] text-sky-300 whitespace-nowrap">
                            {s.createdAt ? new Date(s.createdAt).toLocaleString() : ''}
                          </div>
                        </div>
                        <div className="mt-1 text-sm text-sky-200 whitespace-pre-wrap">{s.message}</div>
                        <div className="mt-2 text-xs text-sky-300">
                          {s.targetUserId
                            ? `${t?.('private.to') || 'To'}: ${s.targetUsername || ''} ${
                                s.targetEmail ? `(${s.targetEmail})` : ''
                              }`.trim()
                            : `${t?.('private.to') || 'To'}: ${s.targetRoles || '-'}`}
                        </div>
                        <div className="mt-1 text-xs text-sky-300">
                          {t?.('private.recipients') || 'Recipients'}: {s.recipientsCount ?? '-'} •{' '}
                          {t?.('private.read') || 'Read'}: {s.readCount ?? 0}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


