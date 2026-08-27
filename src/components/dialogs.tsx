import { LibraryBrowserModal } from "./library-browser-modal";
import { ShareCanvasModal } from "./share-canvas-modal";
import { UpdatePrompt } from "./update-prompt";

export function Dialogs() {
	return (
		<>
			<LibraryBrowserModal />
			<ShareCanvasModal />
			<UpdatePrompt />
		</>
	);
}
