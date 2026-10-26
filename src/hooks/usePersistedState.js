import { useCallback, useState } from 'react';

export default function usePersistedState(key, initialState) {
    const [state, setState] = useState(() => {
        const persistedState = localStorage.getItem(key);

        if (!persistedState) {
            return typeof initialState === 'function'
                ? initialState()
                : initialState;
        }

        try {
            return JSON.parse(persistedState);
        } catch {
            return typeof initialState === 'function'
                ? initialState()
                : initialState;
        }
    });

    const setPersistedState = useCallback((value) => {
        setState((current) => {
            const nextState = typeof value === 'function' ? value(current) : value;

            if (nextState == null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, JSON.stringify(nextState));
            }

            return nextState;
        });
    }, [key]);

    return [state, setPersistedState];
}
