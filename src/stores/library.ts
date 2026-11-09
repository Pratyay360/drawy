import { create } from "zustand";
import type { ExcalidrawLibrary, SavedLibrary } from "#/services/libraries";

interface LibraryState {
	libraries: ExcalidrawLibrary[];
	filteredLibraries: ExcalidrawLibrary[];
	savedLibraries: SavedLibrary[];
    savingId: string | null;
    refreshingId: string | null;
    removingId: string | null;
	loading: boolean;
	savedLoaded: boolean;
	searchQuery: string;
	browsingId: string | null;
	pendingBrowseId: string | null;

	init: (initialBrowseId: string | null) => void;
    setLibraries: (libraries: ExcalidrawLibrary[]) => void;
    setFilteredLibraries: (libraries: ExcalidrawLibrary[]) => void;
    setSavedLibraries: (
        libraries: SavedLibrary[] | ((prev: SavedLibrary[]) => SavedLibrary[]),
    ) => void;
    setSavingId: (id: string | null) => void;
    setRefreshingId: (id: string | null) => void;
    setRemovingId: (id: string | null) => void;
    setLoading: (loading: boolean) => void;
    setSavedLoaded: (loaded: boolean) => void;
    setSearchQuery: (query: string) => void;
    setBrowsingId: (id: string | null) => void;
    setPendingBrowseId: (id: string | null) => void;
    reset: () => void;
}

const initialState = {
    libraries: [] as ExcalidrawLibrary[],
    filteredLibraries: [] as ExcalidrawLibrary[],
    savedLibraries: [] as SavedLibrary[],
    savingId: null,
    refreshingId: null,
    removingId: null,
    loading: true,
    savedLoaded: false,
    searchQuery: "",
    browsingId: null,
    pendingBrowseId: null,
};

export const useLibraryStore = create<LibraryState>((set) => ({
    ...initialState,

    init: (initialBrowseId) =>
        set({ browsingId: initialBrowseId, pendingBrowseId: initialBrowseId }),
    setLibraries: (libraries) => set({ libraries }),
    setFilteredLibraries: (filteredLibraries) => set({ filteredLibraries }),
    setSavedLibraries: (savedLibraries) =>
        set((state) => ({
            savedLibraries:
                typeof savedLibraries === "function"
                    ? savedLibraries(state.savedLibraries)
                    : savedLibraries,
        })),
    setSavingId: (savingId) => set({ savingId }),
    setRefreshingId: (refreshingId) => set({ refreshingId }),
    setRemovingId: (removingId) => set({ removingId }),
    setLoading: (loading) => set({ loading }),
    setSavedLoaded: (savedLoaded) => set({ savedLoaded }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setBrowsingId: (browsingId) => set({ browsingId }),
    setPendingBrowseId: (pendingBrowseId) => set({ pendingBrowseId }),
    reset: () => set({ ...initialState }),
}));
