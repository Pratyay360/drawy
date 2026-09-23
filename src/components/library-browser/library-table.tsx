import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableHeaderCell,
	TableRow,
} from "@astryxdesign/core/Table";
import { Text } from "@astryxdesign/core/Text";
import { BookmarkCheck, BookmarkPlus, Loader2 } from "lucide-react";
import {
	type ExcalidrawLibrary,
	getLibraryAssetUrl,
	libraryItemCount,
	type SavedLibrary,
} from "../../services/libraries";

interface LibraryTableProps {
	libraries: ExcalidrawLibrary[];
	filteredLibraries: ExcalidrawLibrary[];
	savedLibraries: SavedLibrary[];
	savingId: string | null;
	onLibrarySelect?: (library: ExcalidrawLibrary) => void;
	onToggleSave: (library: ExcalidrawLibrary) => void;
}

export function LibraryTable({
	libraries,
	filteredLibraries,
	savedLibraries,
	savingId,
	onLibrarySelect,
	onToggleSave,
}: LibraryTableProps) {
	return (
		<>
			<Table density="compact" hasHover dividers="rows">
				<TableHeader>
					<TableRow isHeaderRow>
						<TableHeaderCell>Preview</TableHeaderCell>
						<TableHeaderCell>Name</TableHeaderCell>
						<TableHeaderCell>Description</TableHeaderCell>
						<TableHeaderCell>Author</TableHeaderCell>
						<TableHeaderCell>Status</TableHeaderCell>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredLibraries.map((library, index) => {
						const saved = savedLibraries.find((lib) => lib.id === library.id);
						const saving = savingId === library.id;
						return (
							<TableRow
								key={library.id ?? `${library.source}-${index}`}
								onClick={() => onLibrarySelect?.(library)}
							>
								<TableCell>
									{library.preview && (
										<img
											src={getLibraryAssetUrl(library.preview)}
											alt={`${library.name} preview`}
											className="h-12 w-16 rounded object-cover"
										/>
									)}
								</TableCell>
								<TableCell>
									<Text weight="medium" maxLines={1}>
										{library.name}
									</Text>
								</TableCell>
								<TableCell>
									<Text type="supporting" maxLines={1}>
										{library.description}
									</Text>
								</TableCell>
								<TableCell>
									<Text maxLines={1}>
										{library.authors[0]?.name || "Unknown"}
									</Text>
								</TableCell>
								<TableCell onClick={(e) => e.stopPropagation()}>
									<Button
										label={saved ? `${libraryItemCount(saved)} items` : "Save"}
										variant="ghost"
										size="sm"
										icon={
											saving ? (
												<Icon icon={Loader2} size="sm" />
											) : saved ? (
												<Icon icon={BookmarkCheck} size="sm" />
											) : (
												<Icon icon={BookmarkPlus} size="sm" />
											)
										}
										isLoading={saving}
										onClick={() => onToggleSave(library)}
										tooltip={
											saved ? `Remove ${library.name}` : `Save ${library.name}`
										}
									/>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>

			{filteredLibraries.length === 0 && (
				<Text type="supporting" justify="center">
					No libraries found matching your search.
				</Text>
			)}

			<Text type="supporting">
				{filteredLibraries.length} of {libraries.length} libraries ·{" "}
				{savedLibraries.length} saved
			</Text>
		</>
	);
}
