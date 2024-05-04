import { create } from "zustand";

const useMiscStore = create((set, get) => ({
    // alert
    alertActive: false,
    alertText: "",
    alertTheme: "success",

    activateAlert: (text, theme = "success") => {
        set({ alertActive: true, alertText: text, alertTheme: theme });

        setTimeout(() => {
            set({ alertActive: false });
        }, 2000);
    },

    // confirmation
    confirmationActive: false,
    confirmationText: "",
    resolve: null,

    confirmation: (text) => {
        set({ confirmationText: text, confirmationActive: true });

        return new Promise((res) => {
            set({ resolve: res });
        });
    },

    confirm: () => {
        set({ confirmationActive: false });
        get().resolve(true);
    },

    deny: () => {
        set({ confirmationActive: false });
        get().resolve(false);
    },

    // dropdown
    dropdownActive: false,
    toggleDropdownActive: () => {
        set((state) => ({ dropdownActive: !state.dropdownActive }));
    },

    // modal
    modalState: false,
    setModalState: (newModalState) => {
        set({ modalState: newModalState });
    },
}));

export default useMiscStore;
