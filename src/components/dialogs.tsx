import { LibraryBrowserModal } from "./library-browser-modal";
import { UpdatePrompt } from "./update-prompt";

/** App-wide dialogs rendered once at the root (library browser, update prompt). */
export function Dialogs() {
    return (
        <>
            <LibraryBrowserModal />
            <UpdatePrompt />
        </>
    );
}