import { create } from "zustand";

export interface ShareModalState {
    isOpen: boolean;
    canvasId: string | null;
    owner: string;
    isOwner: boolean;
    sharedWith: string[];
    isPublic: boolean;
    /** Transient share-form state. */
    targetUser: string;
    availableUsers: string[];
    isSharing: boolean;
    isTogglingPublic: boolean;
    unsharingUser: string | null;
    errorMsg: string | null;
    copied: boolean;
    publicCopied: boolean;
}

interface UIState {
    /** Libraries browser modal — opened from the sidebar or a library panel. */
    libraryModal: {
        isOpen: boolean;
        initialBrowseId: string | null;
    };
    /** Share-canvas modal — opened from the canvas editor's "Share" action. */
    shareModal: ShareModalState;
    /** Version-history modal — opened from the canvas editor's "History" action. */
    versionModal: {
        isOpen: boolean;
        canvasId: string | null;
    };

    openLibraryBrowser: (initialBrowseId?: string | null) => void;
    closeLibraryBrowser: () => void;

    openShareCanvas: (
        payload: Pick<
            ShareModalState,
            "canvasId" | "owner" | "isOwner" | "sharedWith" | "isPublic"
        >,
    ) => void;
    closeShareCanvas: () => void;

    setShareTargetUser: (value: string) => void;
    setShareAvailableUsers: (value: string[]) => void;
    setShareIsSharing: (value: boolean) => void;
    setShareIsTogglingPublic: (value: boolean) => void;
    setShareIsPublic: (value: boolean) => void;
    setShareUnsharingUser: (value: string | null) => void;
    setShareErrorMsg: (value: string | null) => void;
    setShareCopied: (value: boolean) => void;
    setSharePublicCopied: (value: boolean) => void;

    openVersionHistory: (canvasId: string) => void;
    closeVersionHistory: () => void;
}

const emptyShareForm = {
    targetUser: "",
    availableUsers: [] as string[],
    isSharing: false,
    isTogglingPublic: false,
    unsharingUser: null as string | null,
    errorMsg: null as string | null,
    copied: false,
    publicCopied: false,
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
        isPublic: false,
        ...emptyShareForm,
    },
    versionModal: {
        isOpen: false,
        canvasId: null,
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
        set((state) => ({
            shareModal: { ...state.shareModal, isOpen: false },
        })),

    setShareTargetUser: (targetUser) =>
        set((s) => ({ shareModal: { ...s.shareModal, targetUser } })),
    setShareAvailableUsers: (availableUsers) =>
        set((s) => ({ shareModal: { ...s.shareModal, availableUsers } })),
    setShareIsSharing: (isSharing) => set((s) => ({ shareModal: { ...s.shareModal, isSharing } })),
    setShareIsTogglingPublic: (isTogglingPublic) =>
        set((s) => ({ shareModal: { ...s.shareModal, isTogglingPublic } })),
    setShareIsPublic: (isPublic) => set((s) => ({ shareModal: { ...s.shareModal, isPublic } })),
    setShareUnsharingUser: (unsharingUser) =>
        set((s) => ({ shareModal: { ...s.shareModal, unsharingUser } })),
    setShareErrorMsg: (errorMsg) => set((s) => ({ shareModal: { ...s.shareModal, errorMsg } })),
    setShareCopied: (copied) => set((s) => ({ shareModal: { ...s.shareModal, copied } })),
    setSharePublicCopied: (publicCopied) =>
        set((s) => ({ shareModal: { ...s.shareModal, publicCopied } })),

    openVersionHistory: (canvasId) => set({ versionModal: { isOpen: true, canvasId } }),
    closeVersionHistory: () => set({ versionModal: { isOpen: false, canvasId: null } }),
}));