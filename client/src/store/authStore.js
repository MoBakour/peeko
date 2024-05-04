import { create } from "zustand";

const useAuthStore = create((set, get) => {
    const userAuth = JSON.parse(localStorage.getItem("auth")) || null;

    return {
        auth: userAuth,
        authorized: !!userAuth?.userDocument.activation.activated,
        setAuth: (newAuth) => {
            set({
                auth: newAuth,
                authorized: !!newAuth?.userDocument.activation.activated,
            });
        },
    };
});

export default useAuthStore;
