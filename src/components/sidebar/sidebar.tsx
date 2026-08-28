import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import {
	SideNav,
	SideNavCollapseButton,
	SideNavHeading,
	SideNavItem,
	SideNavSection,
} from "@astryxdesign/core/SideNav";
import { VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { Library, Loader2, PenTool, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useSidebarStore } from "#/stores/sidebar";
import { subscribeCanvasListChanged } from "#/utils/canvas-realtime";
import {
	createCanvas,
	deleteCanvas,
	listCanvases,
} from "../../services/canvases";
import { requestLibraryBrowse } from "../../services/libraries";
import { subscribeCanvasEvents } from "../../utils/realtime";
import { ThemeToggle } from "../theme-toggle";
import { groupCanvasesByDate } from "./canvas-grouping";
import { SidebarFooter } from "./sidebar-footer";

export function Sidebar() {
	const isCollapsed = useSidebarStore((s) => s.isCollapsed);
	const setIsCollapsed = useSidebarStore((s) => s.setIsCollapsed);
	const canvases = useSidebarStore((s) => s.canvases);
	const setCanvases = useSidebarStore((s) => s.setCanvases);
	const isCreating = useSidebarStore((s) => s.isCreating);
	const setIsCreating = useSidebarStore((s) => s.setIsCreating);
	const deletingId = useSidebarStore((s) => s.deletingId);
	const setDeletingId = useSidebarStore((s) => s.setDeletingId);
	const { id: currentCanvasId } = useParams({ strict: false });
	const navigate = useNavigate();

	const loadCanvases = useCallback(async () => {
		try {
			const result = await listCanvases();
			setCanvases(result);
		} catch (error) {
			console.error("Failed to load canvases:", error);
		}
	}, [setCanvases]);

	useEffect(() => {
		void loadCanvases();
		addEventListener("canvas-updated", loadCanvases);
		const unsubscribe = subscribeCanvasEvents(loadCanvases);
		const unsubscribeList = subscribeCanvasListChanged(loadCanvases);
		return () => {
			removeEventListener("canvas-updated", loadCanvases);
			unsubscribe();
			unsubscribeList();
		};
	}, [loadCanvases]);

	async function handleCreateCanvas() {
		setIsCreating(true);
		try {
			const now = new Date();
			const title = now.toLocaleDateString(undefined, {
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
			const newCanvas = await createCanvas(title);
			dispatchEvent(new Event("canvas-updated"));
			void navigate({ to: "/canvas/$id", params: { id: newCanvas.id } });
		} catch (error) {
			console.error("Failed to create canvas:", error);
		} finally {
			setIsCreating(false);
		}
	}

	async function handleDeleteCanvas(canvasId: string, event: React.MouseEvent) {
		event.preventDefault();
		event.stopPropagation();

		setDeletingId(canvasId);
		try {
			await deleteCanvas(canvasId);
			dispatchEvent(new Event("canvas-updated"));
			if (canvasId === currentCanvasId) {
				void navigate({ to: "/" });
			}
		} catch (error) {
			console.error("Failed to delete canvas:", error);
		} finally {
			setDeletingId(null);
		}
	}

	const grouped = groupCanvasesByDate(canvases);

	return (
		<SideNav
			collapsible={{
				isCollapsed,
				onCollapsedChange: setIsCollapsed,
				hasButton: false,
			}}
			resizable={{
				defaultWidth: 240,
				minWidth: 200,
				maxWidth: 320,
				autoSaveId: "drawy-sidebar-width",
			}}
			header={
				<SideNavHeading
					heading="Drawy"
					icon={<Icon icon={PenTool} size="sm" />}
					headingHref="/"
					as={Link}
				/>
			}
			topContent={
				<Button
					label="New canvas"
					icon={<Icon icon={Plus} size="sm" />}
					onClick={handleCreateCanvas}
					isLoading={isCreating}
					width="100%"
				/>
			}
			footerIcons={
				<>
					<IconButton
						label="Libraries"
						tooltip="Libraries"
						variant="ghost"
						icon={<Icon icon={Library} size="sm" />}
						onClick={() => requestLibraryBrowse(null)}
					/>
					<ThemeToggle />
					<SideNavCollapseButton />
				</>
			}
			footer={<SidebarFooter />}
		>
			{grouped.Today.length > 0 && (
				<SideNavSection title="Today">
					{grouped.Today.map((canvas) => (
						<SideNavItem
							key={canvas.id}
							label={canvas.title}
							href={`/canvas/${canvas.id}`}
							as={Link}
							isSelected={canvas.id === currentCanvasId}
							endContent={
								canvas.isOwner ? (
									deletingId === canvas.id ? (
										<Icon icon={Loader2} size="sm" />
									) : (
										<IconButton
											label="Delete canvas"
											variant="ghost"
											size="sm"
											icon={<Icon icon={Trash2} size="sm" />}
											onClick={(e) => handleDeleteCanvas(canvas.id, e)}
										/>
									)
								) : null
							}
						/>
					))}
				</SideNavSection>
			)}

			{grouped.Older.length > 0 && (
				<SideNavSection title="Older">
					{grouped.Older.map((canvas) => (
						<SideNavItem
							key={canvas.id}
							label={canvas.title}
							href={`/canvas/${canvas.id}`}
							as={Link}
							isSelected={canvas.id === currentCanvasId}
							endContent={
								canvas.isOwner ? (
									deletingId === canvas.id ? (
										<Icon icon={Loader2} size="sm" />
									) : (
										<IconButton
											label="Delete canvas"
											variant="ghost"
											size="sm"
											icon={<Icon icon={Trash2} size="sm" />}
											onClick={(e) => handleDeleteCanvas(canvas.id, e)}
										/>
									)
								) : null
							}
						/>
					))}
				</SideNavSection>
			)}

			{canvases.length === 0 && (
				<SideNavSection title="Drawings" isHeaderHidden>
					<VStack gap={2} hAlign="center" padding={3}>
						<Text type="supporting">No drawings yet</Text>
						<Button
							label="Create one"
							variant="ghost"
							size="sm"
							onClick={handleCreateCanvas}
						/>
					</VStack>
				</SideNavSection>
			)}
		</SideNav>
	);
}
