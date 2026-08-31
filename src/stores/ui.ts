import { create } from "zustand";

export interface ShareModalState {
    isOpen: boolean;
    canvasId: string | null;
    owner: string;
    isOwner: boolean;
    sharedWith: string[];
    /** Transient share-form state. */
    targetUser: string;
    availableUsers: string[];
    isSharing: boolean;
    unsharingUser: string | null;
    errorMsg: string | null;
    copied: boolean;
}

interface UIState {
    /** Libraries browser modal — opened from the sidebar or a library panel. */
    libraryModal: {
        isOpen: boolean;
        initialBrowseId: string | null;
    };
    /** Share-canvas modal — opened from the canvas editor's "Share" action. */
    shareModal: ShareModalState;

    openLibraryBrowser: (initialBrowseId?: string | null) => void;
    closeLibraryBrowser: () => void;

    openShareCanvas: (
        payload: Pick<ShareModalState, "canvasId" | "owner" | "isOwner" | "sharedWith">,
    ) => void;
    closeShareCanvas: () => void;

    setShareTargetUser: (value: string) => void;
    setShareAvailableUsers: (value: string[]) => void;
    setShareIsSharing: (value: boolean) => void;
    setShareUnsharingUser: (value: string | null) => void;
    setShareErrorMsg: (value: string | null) => void;
    setShareCopied: (value: boolean) => void;
}

const emptyShareForm = {
    targetUser: "",
    availableUsers: [] as string[],
    isSharing: false,
    unsharingUser: null as string | null,
    errorMsg: null as string | null,
    copied: false,
};

export const useUIStore = create<UIState>((set) => ({
    libraryModal: {
        isOpen: false,
        initialBrowseId: null,
    },
    shareModal: {
        isOpen: false,
        canvasId: null,
        owner: "",
        isOwner: false,
        sharedWith: [],
        ...emptyShareForm,
    },

    openLibraryBrowser: (initialBrowseId: string | null = null) =>
        set({ libraryModal: { isOpen: true, initialBrowseId } }),

    closeLibraryBrowser: () =>
        set((state) => ({
            libraryModal: {
                ...state.libraryModal,
                isOpen: false,
                initialBrowseId: null,
            },
        })),

    openShareCanvas: (payload) =>
        set({ shareModal: { ...payload, isOpen: true, ...emptyShareForm } }),

    closeShareCanvas: () =>
        set((state) => ({ shareModal: { ...state.shareModal, isOpen: false } })),

    setShareTargetUser: (targetUser) =>
        set((s) => ({ shareModal: { ...s.shareModal, targetUser } })),
    setShareAvailableUsers: (availableUsers) =>
        set((s) => ({ shareModal: { ...s.shareModal, availableUsers } })),
    setShareIsSharing: (isSharing) => set((s) => ({ shareModal: { ...s.shareModal, isSharing } })),
    setShareUnsharingUser: (unsharingUser) =>
        set((s) => ({ shareModal: { ...s.shareModal, unsharingUser } })),
    setShareErrorMsg: (errorMsg) => set((s) => ({ shareModal: { ...s.shareModal, errorMsg } })),
    setShareCopied: (copied) => set((s) => ({ shareModal: { ...s.shareModal, copied } })),
}));