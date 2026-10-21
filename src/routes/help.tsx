import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Collapsible, CollapsibleGroup } from "@astryxdesign/core/Collapsible";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { Icon } from "@astryxdesign/core/Icon";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { createFileRoute } from "@tanstack/react-router";
import { FileDown, MessageCircle, Rocket } from "lucide-react";
import { PublicPage } from "#/components/public-page";

export const Route = createFileRoute("/help")({
	head: () => ({
		meta: [
			{ title: "Help — Drawy" },
			{
				name: "description",
				content:
					"Answers to common Drawy questions: accounts, autosave, sharing, version history, libraries and exports.",
			},
		],
	}),
	component: HelpPage,
});

const GETTING_STARTED = [
	{
		icon: Rocket,
		title: "Make an account",
		body: "A username and a password is all it takes. Your username is how other people find you when you share a canvas.",
	},
	{
		icon: FileDown,
		title: "Make a canvas",
		body: "Hit New canvas in the sidebar. Everything you draw on it saves as you work — there is no save button to remember.",
	},
	{
		icon: MessageCircle,
		title: "Share it",
		body: "Open Share canvas to publish a read-only link or invite someone by username, then collaborate on it together.",
	},
];

const FAQ = [
	{
		question: "Do I need an email address?",
		answer:
			"No. An account is just a username and a password. There is no confirmation email to click and no password reset email, so keep track of your credentials.",
	},
	{
		question: "Is my drawing saved automatically?",
		answer:
			"Yes. Drawy autosaves your canvas as you work, and your drawings are grouped by the date you last touched them. Closing the tab does not lose anything.",
	},
	{
		question: "How do I share a drawing?",
		answer:
			"Open the share dialog for your canvas. You get two options: a public view link that anyone with the URL can open, and sharing with a specific person by their Drawy username.",
	},
	{
		question: "Can a public link let other people edit my drawing?",
		answer:
			"No. Public links are read-only. To let someone edit alongside you, invite them by username instead — they will need their own account.",
	},
	{
		question: "How do I undo a change I do not like?",
		answer:
			"Use the version history for the canvas. Every saved revision is kept, and you can restore an earlier one with a single click.",
	},
	{
		question: "Can I bring in my own images and shapes?",
		answer:
			"Yes. The library browser lets you save the public Excalidraw libraries you like and build a personal library of your own items. You can also import an .excalidraw file straight into a canvas.",
	},
	{
		question: "Can I export my work?",
		answer:
			"Yes. The main menu in the canvas has Export File (.excalidraw), so you can download a canvas and open it in any Excalidraw-compatible tool.",
	},
	{
		question: "Does Drawy work on a phone or tablet?",
		answer:
			"The workspace adapts to smaller screens, including a collapsible sidebar and a mobile navigation drawer. Drawing on a touch screen is supported, though a stylus or mouse is more comfortable for detailed work.",
	},
	{
		question: "How do I delete a drawing?",
		answer:
			"Use the delete action on the drawing, either from the Drawings list on your home page or from the sidebar. Deleting a drawing removes it for everyone it was shared with.",
	},
	{
		question: "What happens to my data if I delete my account?",
		answer:
			"Your account and its personal data are deleted, subject to the retention windows described in the Privacy Policy. Contact us if you need a copy of your drawings first.",
	},
	{
		question: "Who can see my drawings?",
		answer:
			"Only you, unless you share them. The Privacy Policy explains exactly what we store, why we store it and how long we keep it.",
	},
];

function HelpPage() {
	return (
		<PublicPage>
			<VStack gap={3}>
				<Heading level={1}>Help centre</Heading>
				<Text as="p" type="large">
					Short answers to the questions we get most often. If yours is not
					here, get in touch and we will help you out.
				</Text>
			</VStack>

			<VStack gap={3}>
				<Heading level={2}>Getting started</Heading>
				<Grid columns={{ minWidth: 220, max: 3 }} gap={3}>
					{GETTING_STARTED.map((item) => (
						<Card key={item.title} padding={4}>
							<VStack gap={2}>
								<HStack align="center" gap={2}>
									<Icon icon={item.icon} size="md" />
									<Heading level={3}>{item.title}</Heading>
								</HStack>
								<Text as="p">{item.body}</Text>
							</VStack>
						</Card>
					))}
				</Grid>
			</VStack>

			<VStack gap={3}>
				<Heading level={2}>Frequently asked questions</Heading>
				<CollapsibleGroup type="single" hasDividers>
					{FAQ.map((item) => (
						<Collapsible
							key={item.question}
							trigger={<Text weight="semibold">{item.question}</Text>}
						>
							<Text as="p">{item.answer}</Text>
						</Collapsible>
					))}
				</CollapsibleGroup>
			</VStack>

			<VStack gap={3}>
				<Heading level={2}>Still stuck?</Heading>
				<Text as="p">
					Tell us what went wrong and we will get back to you. Bug reports with
					a screenshot of the canvas are especially helpful.
				</Text>
				<HStack align="center" gap={3} wrap="wrap">
					<Button
						label="Contact support"
						href="/contact"
						icon={<Icon icon={MessageCircle} size="sm" />}
						variant="primary"
					/>
					<Button
						label="Read the Terms of Service"
						href="/terms"
						variant="secondary"
					/>
				</HStack>
			</VStack>
		</PublicPage>
	);
}
