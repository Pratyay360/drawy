import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { Icon } from "@astryxdesign/core/Icon";
import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
import { Library } from "lucide-react";
import { useUIStore } from "#/stores/ui";
import { LibraryBrowser } from "./library-browser";

export function LibraryBrowserModal() {
	const isOpen = useUIStore((s) => s.libraryModal.isOpen);
	const initialBrowseId = useUIStore((s) => s.libraryModal.initialBrowseId);
	const closeLibraryBrowser = useUIStore((s) => s.closeLibraryBrowser);

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			closeLibraryBrowser();
		}
	};

	return (
		<Dialog
			isOpen={isOpen}
			onOpenChange={handleOpenChange}
			width={880}
			maxHeight="85vh"
		>
			<Layout
				header={
					<DialogHeader
						title="Libraries"
						startContent={<Icon icon={Library} size="sm" />}
						onOpenChange={handleOpenChange}
					/>
				}
				content={
					<LayoutContent isScrollable padding={4}>
						<LibraryBrowser
							initialBrowseId={initialBrowseId}
							source="sidebar"
						/>
					</LayoutContent>
				}
			/>
		</Dialog>
	);
}
