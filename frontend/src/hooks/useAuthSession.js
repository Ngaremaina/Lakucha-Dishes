import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { refreshSession } from '../services/auth';

// Runs once on app boot: tries to silently repopulate the access token from
// the httpOnly refresh cookie, so a page reload doesn't force a re-login.
export const useAuthSession = () => {
  const status = useAuthStore((state) => state.status);
  const setAuth = useAuthStore((state) => state.setAuth);
  const setStatus = useAuthStore((state) => state.setStatus);

  useEffect(() => {
    if (status !== 'idle') return;
    setStatus('authenticating');

    refreshSession()
      .then(({ accessToken, user }) => setAuth(accessToken, user))
      .catch(() => setStatus('ready'));
  }, [status, setAuth, setStatus]);

  return status;
};
