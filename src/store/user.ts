import { type User } from "firebase/auth";
import { create } from "zustand";

type UserState = {
  setUser: (user: User | null) => void;
  user?: User | null;
  status: "authenticated" | "loading" | "unauthenticated";
};

const useUserStore = create<UserState>((set) => ({
  user: undefined,
  setUser: (user) =>
    set(() => ({
      user,
      status: !!user ? "authenticated" : "unauthenticated",
    })),
  status: "loading",
}));

export default useUserStore;
