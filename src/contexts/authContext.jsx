import { createContext, useCallback, useContext, useEffect } from 'react';
import { authApi, profileApi } from '../api';
import usePersistedState from '../hooks/usePersistedState';

export const AuthContext = createContext();

function mapAccount(session, username) {
    const authUser = session?.user || (session?.id ? session : {});

    return {
        id: authUser.id,
        email: authUser.email,
        username:
            username ||
            authUser.user_metadata?.username ||
            (authUser.email ? authUser.email.split('@')[0] : ''),
        accessToken: session?.access_token,
        refreshToken: session?.refresh_token,
        authorId: authUser.id,
    };
}

function loadUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch {
        return null;
    }
}

export function getAuthorId(account) {
    return account?.authorId || account?.id || null;
}

export function AuthContextProvider({ children }) {
    const [user, setUser] = usePersistedState('user', null);

    const saveUser = useCallback((nextUser) => {
        setUser(nextUser);
        if (!nextUser) {
            localStorage.removeItem('users');
        }
    }, [setUser]);

    const completeSession = useCallback(async (session, username) => {
        if (!session?.access_token) {
            throw new Error('Check your email to confirm your account, then log in.');
        }

        let account = mapAccount(session, username);
        saveUser(account);

        const profile = await profileApi.ensure(account);
        if (profile?.username && profile.username !== account.username) {
            account = { ...account, username: profile.username };
            saveUser(account);
        }

        return account;
    }, [saveUser]);

    useEffect(() => {
        const restore = async () => {
            const stored = loadUser();
            if (!stored?.refreshToken) {
                return;
            }

            try {
                const session = await authApi.refresh(stored.refreshToken);
                try {
                    await completeSession(session, stored.username);
                } catch {
                    saveUser(mapAccount(session, stored.username));
                }
            } catch {
                saveUser(null);
            }
        };

        restore();
    }, [completeSession, saveUser]);

    const register = useCallback(async ({ username, email, password }) => {
        const session = await authApi.register({ email, password, username });
        await completeSession(session, username);
        return true;
    }, [completeSession]);

    const login = useCallback(async ({ email, password }) => {
        const session = await authApi.login({ email, password });
        await completeSession(session);
        return true;
    }, [completeSession]);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch {
            // still clear the local session
        }
        saveUser(null);
    }, [saveUser]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: Boolean(user?.accessToken),
                register,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);
