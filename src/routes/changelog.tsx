import { Heading } from "@astryxdesign/core/Heading";
import { List, ListItem } from "@astryxdesign/core/List";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "#/components/public-page";

export const Route = createFileRoute("/changelog")({
	head: () => ({
		meta: [
			{ title: "Changelog — Drawy" },
			{
				name: "description",
				content: "What changed in Drawy, release by release.",
			},
		],
	}),
	component: ChangelogPage,
});

interface Release {
	version: string;
	date: string;
	summary: string;
	changes: string[];
}

const RELEASES: Release[] = [
	{
		version: "v1.1.0",
		date: "October 20, 2026",
		summary:
			"The collaboration release. Drawy became a shared workspace rather than a solo one.",
		changes: [
			"Live cursors and selections so you can see who is drawing with you, in real time.",
			"Share a canvas with a specific person by their Drawy username.",
			"Publish a read-only link that anyone can open without an account.",
			"Version history on every canvas, with one-click restore of an earlier revision.",
			"Library browser: save the public Excalidraw libraries you use and build a personal library.",
		],
	},
	{
		version: "v1.0.0",
		date: "September 28, 2026",
		summary:
			"The first stable release, with the full editor and the account system.",
		changes: [
			"Full Excalidraw editor: shapes, arrows, text, freehand, frames and images on an infinite canvas.",
			"Autosave on every change, with drawings grouped by the date you last touched them.",
			"Username and password accounts, with no email address or confirmation step.",
			"Import and export .excalidraw files from the main menu.",
			"Six themes across light and dark mode, applied before the first paint.",
		],
	},
	{
		version: "v0.9.0",
		date: "September 10, 2026",
		summary: "The open beta, where the drawing experience was shaped.",
		changes: [
			"Canvas management: create, rename, group and delete drawings from the sidebar.",
			"Public view page for drawings shared with a link.",
			"Sidebar collapse for smaller screens.",
		],
	},
];

function ChangelogPage() {
	return (
		<PublicPage>
			<VStack gap={3}>
				<Heading level={1}>Changelog</Heading>
				<Text as="p" type="large">
					Every public release of Drawy, newest first. Breaking changes to your
					drawings or your data are always called out here.
				</Text>
			</VStack>

			{RELEASES.map((release) => (
				<VStack key={release.version} gap={3}>
					<HStack align="center" gap={3} wrap="wrap">
						<Heading level={2}>{release.version}</Heading>
						<Text type="supporting">{release.date}</Text>
					</HStack>
					<Text as="p">{release.summary}</Text>
					<List
						density="balanced"
						hasDividers
						header={<Text weight="semibold">What changed</Text>}
						listStyle="disc"
					>
						{release.changes.map((change) => (
							<ListItem key={change} label={change} />
						))}
					</List>
				</VStack>
			))}
		</PublicPage>
	);
}
