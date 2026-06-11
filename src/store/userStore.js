// handles user data
import { create } from 'zustand';
const useUserStore = create((set) => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null,

    fetchUsers: async (companyId) => {
        set({ loading: true });
        try {
            set({ users: [], loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
    addUser: async (userData) => {
        set({ loading: true });
        try {
            set({ loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
    setCurrentUser: (user) => set({ currentUser: user }),
    clearError: () => set({ error: null }),
}));
export default useUserStore;