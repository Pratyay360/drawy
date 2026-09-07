import { create } from "zustand";

interface LibraryItemState {
    /** Search filter for the items within a single saved library. */
    query: string;
    /** Content refresh in progress. */
    refreshing: boolean;

    setQuery: (query: string) => void;
    setRefreshing: (refreshing: boolean) => void;
    reset: () => void;
}

const initialState = {
    query: "",
    refreshing: false,
};

export const useLibraryItemStore = create<LibraryItemState>((set) => ({
    ...initialState,

    setQuery: (query) => set({ query }),
    setRefreshing: (refreshing) => set({ refreshing }),
    reset: () => set({ ...initialState }),
}));