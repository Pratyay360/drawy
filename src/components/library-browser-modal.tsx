import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { Icon } from "@astryxdesign/core/Icon";
import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
import { Library } from "lucide-react";
import { useEffect, useState } from "react";

import { onLibraryBrowseRequested } from "../services/libraries";
import { LibraryBrowser } from "./library-browser";

export function LibraryBrowserModal() {
	const [isOpen, setIsOpen] = useState(false);
	const [librariesBrowseId, setLibrariesBrowseId] = useState<string | null>(
		null,
	);

	useEffect(() => {
		return onLibraryBrowseRequested((libraryId) => {
			setLibrariesBrowseId(libraryId);
			setIsOpen(true);
		});
	}, []);

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);

		if (!open) {
			setLibrariesBrowseId(null);
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
							initialBrowseId={librariesBrowseId}
							source="sidebar"
						/>
					</LayoutContent>
				}
			/>
		</Dialog>
	);
}
