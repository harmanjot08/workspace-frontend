// UI control - notifications, modals(pop-up), sidebar, darkmode.
import { create } from 'zustand';
const useUIStore = create((set) => ({
    notifications: [],
    modals: {},
    sidebarOpen: true,
    darkMode: true,

    addNotification: (notification) =>
        set((state) => ({
            notifications: [
                ...state.notifications,
                { id: Date.now(), ...notification }
            ]
        })),

    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id)
        })),

    openModal: (modalName) =>
        set((state) => ({
            modals: { ...state.modals, [modalName]: true }
        })),

    closeModal: (modalName) =>
        set((state) => ({
            modals: { ...state.modals, [modalName]: false }
        })),

    toggleSidebar: () =>
        set((state) => ({
            sidebarOpen: !state.sidebarOpen
        })),

    toggleDarkMode: () =>
        set((state) => ({
            darkMode: !state.darkMode
        })),
}));
export default useUIStore;