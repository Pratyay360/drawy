import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { Icon } from "@astryxdesign/core/Icon";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { createFileRoute } from "@tanstack/react-router";
import {
	Clock,
	Download,
	FolderOpen,
	History,
	Palette,
	PenTool,
	Share2,
	Users,
} from "lucide-react";
import { PublicPage } from "#/components/public-page";

export const Route = createFileRoute("/about")({
	head: () => ({
		meta: [
			{ title: "About — Drawy" },
			{
				name: "description",
				content:
					"Drawy is a collaborative drawing workspace built on Excalidraw, with real-time multiplayer, version history and shareable links.",
			},
		],
	}),
	component: AboutPage,
});

const FEATURES = [
	{
		icon: PenTool,
		title: "A canvas that never runs out",
		body: "Full Excalidraw editing — rectangles, diamonds, arrows, text, freehand, frames and images — on an infinite surface that pans and zooms the way you expect.",
	},
	{
		icon: Users,
		title: "Real-time collaboration",
		body: "Work in the same canvas with other people. Live cursors, selections and strokes show up as they happen, so you can point at a shape instead of describing it.",
	},
	{
		icon: Share2,
		title: "Share the way you want",
		body: "Publish a read-only link anyone can open, or invite a specific person by username. Revoke access whenever you like without deleting the drawing.",
	},
	{
		icon: History,
		title: "Version history",
		body: "Every saved revision of a canvas is kept. Roll back to an earlier state with one click when a change was not what you had in mind.",
	},
	{
		icon: FolderOpen,
		title: "A library for your assets",
		body: "Browse the public Excalidraw libraries, save the ones you use, and build a personal library of your own items to drop into any drawing.",
	},
	{
		icon: Download,
		title: "Take your work with you",
		body: "Import and export `.excalidraw` files whenever you want, so nothing you draw is locked inside the app.",
	},
	{
		icon: Clock,
		title: "Autosave, always on",
		body: "Changes are saved as you draw. Close the tab, come back later, and the canvas is exactly where you left it.",
	},
	{
		icon: Palette,
		title: "Themes that fit",
		body: "Six themes across light and dark mode. Your choice is remembered on this device and applied before the first paint, so there is no flash.",
	},
];

const STEPS = [
	{
		title: "Create an account",
		body: "Pick a username and a password. No email address, no confirmation link — you are in straight away.",
	},
	{
		title: "Start a canvas",
		body: "Every new canvas gets a name you can rename later. Your drawings are grouped by the date you last touched them.",
	},
	{
		title: "Draw, share, invite",
		body: "Sketch, pull in library assets, then share a link or invite a collaborator to work alongside you.",
	},
];

const STACK = [
	"Excalidraw for the canvas and editor",
	"TanStack Start and Router for the app shell and routing",
	"oRPC for the typed API between client and server",
	"Supabase or PartyKit for realtime presence and persistence",
	"Astryx for the component library and theming",
];

function AboutPage() {
	return (
		<PublicPage>
			<VStack gap={3}>
				<Heading level={1}>About Drawy</Heading>
				<Text as="p" type="large">
					Drawy is a collaborative drawing workspace. It gives you the full
					Excalidraw editor, then adds the things a whiteboard needs to be
					useful with other people: live cursors, shareable links, shared
					canvases and a history you can roll back to.
				</Text>
				<Text as="p">
					Everything is saved as you draw, so you can close the tab and pick up
					exactly where you left off. Drawings can stay private, be shared with
					one person, or be published as a read-only link.
				</Text>
			</VStack>

			<VStack gap={3}>
				<Heading level={2}>What you get</Heading>
				<Grid columns={{ minWidth: 240, max: 2 }} gap={3}>
					{FEATURES.map((feature) => (
						<Card key={feature.title} padding={4}>
							<VStack gap={2}>
								<HStack align="center" gap={2}>
									<Icon icon={feature.icon} size="md" />
									<Heading level={3}>{feature.title}</Heading>
								</HStack>
								<Text as="p">{feature.body}</Text>
							</VStack>
						</Card>
					))}
				</Grid>
			</VStack>

			<VStack gap={3}>
				<Heading level={2}>How it works</Heading>
				<Grid columns={{ minWidth: 220, max: 3 }} gap={3}>
					{STEPS.map((step, index) => (
						<Card key={step.title} padding={4} variant="muted">
							<VStack gap={2}>
								<Text type="label" color="secondary">
									Step {index + 1}
								</Text>
								<Heading level={3}>{step.title}</Heading>
								<Text as="p">{step.body}</Text>
							</VStack>
						</Card>
					))}
				</Grid>
			</VStack>

			<VStack gap={3}>
				<Heading level={2}>Under the hood</Heading>
				<Text as="p">
					Drawy is open source and built on a small set of well-known projects:
				</Text>
				<ul className="list-disc ps-5 space-y-2">
					{STACK.map((item) => (
						<li key={item}>
							<Text as="p">{item}</Text>
						</li>
					))}
				</ul>
			</VStack>

			<VStack gap={3}>
				<Heading level={2}>Ready to draw?</Heading>
				<Text as="p">
					Creating an account takes a username and a password. There is no
					trial, no card and no email address to verify.
				</Text>
				<HStack align="center" gap={3} wrap="wrap">
					<Button
						label="Create an account"
						href="/login"
						icon={<Icon icon={PenTool} size="sm" />}
						variant="primary"
					/>
					<Button
						label="Read the help centre"
						href="/help"
						variant="secondary"
					/>
				</HStack>
			</VStack>
		</PublicPage>
	);
}
