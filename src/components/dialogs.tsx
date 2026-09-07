import { LibraryBrowserModal } from "./library-browser-modal";
import { ShareCanvasModal } from "./share-canvas-modal";
import { UpdatePrompt } from "./update-prompt";
import { VersionHistoryModal } from "./version-history-modal";

export function Dialogs() {
    return (
        <>
            <LibraryBrowserModal />
            <ShareCanvasModal />
            <VersionHistoryModal />
            <UpdatePrompt />
        </>
    );
}