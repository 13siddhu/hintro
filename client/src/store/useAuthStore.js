import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true,
    token: localStorage.getItem('token'),

    loadUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            set({ loading: false, isAuthenticated: false, user: null });
            return;
        }

        try {
            const res = await api.get('/auth/me'); // We can add this endpoint or just rely on token validity check
            set({ isAuthenticated: true, loading: false, user: res.data });
        } catch (err) {
            localStorage.removeItem('token');
            set({ isAuthenticated: false, loading: false, user: null, token: null });
        }
    },

    login: async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            set({
                isAuthenticated: true,
                loading: false,
                user: res.data.user,
                token: res.data.token,
            });
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    },

    register: async (username, email, password) => {
        try {
            const res = await api.post('/auth/register', { username, email, password });
            localStorage.setItem('token', res.data.token);
            set({
                isAuthenticated: true,
                loading: false,
                user: res.data.user,
                token: res.data.token,
            });
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ isAuthenticated: false, user: null, token: null });
    },
}));

export default useAuthStore;
