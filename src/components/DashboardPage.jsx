export function DashboardPage({ t, user, onAdminMembers, onGoProfile, onGoMessages, onGoNotifications }) {
  return (
    <div className="min-h-screen bg-sky-950 text-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold">{t?.('private.title') || 'Dashboard'}</h1>
            <p className="mt-1 text-sky-200 text-sm">
              {t?.('private.welcome') || 'Welcome,'}{' '}
              <span className="text-white font-medium">{user?.username || '—'}</span>
            </p>
            <div className="mt-2 text-xs text-sky-200">
              {t?.('private.role') || 'Role'}:{' '}
              <span className="inline-flex items-center px-2 py-1 rounded bg-white/10 text-white">
                {user?.role || 'user'}
              </span>
            </div>
          </div>

          {['admin', 'moderator'].includes(user?.role) ? (
            <button
              type="button"
              onClick={onAdminMembers}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition-colors"
            >
              {t?.('admin.members.title') || 'Members'}
            </button>
          ) : null}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            type="button"
            onClick={onGoMessages}
            className="text-left rounded-2xl border border-white/10 bg-sky-900/40 p-6 hover:bg-white/5 transition-colors"
          >
            <div className="text-white font-semibold">{t?.('private.supportTitle') || 'Messages'}</div>
            <p className="mt-2 text-sky-200 text-sm">
              {t?.('private.supportStartHelp') || 'Write your question. Admin/Moderator will reply.'}
            </p>
          </button>

          <button
            type="button"
            onClick={onGoNotifications}
            className="text-left rounded-2xl border border-white/10 bg-sky-900/40 p-6 hover:bg-white/5 transition-colors"
          >
            <div className="text-white font-semibold">{t?.('private.notificationsTitle') || 'Notifications'}</div>
            <p className="mt-2 text-sky-200 text-sm">
              {t?.('private.notificationsUnread') || 'Unread'} / {t?.('private.notificationsAll') || 'All'}
            </p>
          </button>

          <button
            type="button"
            onClick={onGoProfile}
            className="text-left rounded-2xl border border-white/10 bg-sky-900/40 p-6 hover:bg-white/5 transition-colors"
          >
            <div className="text-white font-semibold">{t?.('private.profileTitle') || 'Profile'}</div>
            <p className="mt-2 text-sky-200 text-sm">{t?.('private.profileEditTitle') || 'Edit profile'}</p>
          </button>
        </div>
      </div>
    </div>
  );
}


