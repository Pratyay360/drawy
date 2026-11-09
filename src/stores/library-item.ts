import { create } from "zustand";

interface LibraryItemState {
	query: string;
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
