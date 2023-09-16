import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { localStorageKeys } from '~/lib/constants/local-storage';
import { type Blog } from '~/server/routers/blog';

type BlogState = {
  selectedBlog: Blog | null | undefined;
  setSelectedBlog: (blog: Blog | null) => void;
};

const useBlogStore = create<BlogState>()(
  persist(
    (set) => ({
      selectedBlog: null,
      setSelectedBlog: (blog: Blog | null) => set({ selectedBlog: blog }),
    }),
    {
      name: localStorageKeys.blogStore,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useBlogStore;
