import { create } from 'zustand';
import { type getUser } from '~/lib/fetchers/auth';

export type User = Awaited<ReturnType<typeof getUser>>;

type UserState = {
  setUser: (user: User | null) => void;
  user?: User | null;
};

const useUserStore = create<UserState>((set) => ({
  user: undefined,
  setUser: (user) =>
    set(() => ({
      user,
    })),
}));

export default useUserStore;
