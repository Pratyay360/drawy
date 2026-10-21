import { Heading } from "@astryxdesign/core/Heading";
import { Link } from "@astryxdesign/core/Link";
import { VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { createFileRoute } from "@tanstack/react-router";
import { CONTACT_URL } from "#/components/site-footer";
import { PublicPage } from "#/components/public-page";

export const Route = createFileRoute("/cookies")({
	head: () => ({
		meta: [
			{ title: "Cookie Policy — Drawy" },
			{
				name: "description",
				content: "How Drawy uses cookies and similar technologies.",
			},
		],
	}),
	component: CookiePolicyPage,
});

function CookiePolicyPage() {
	return (
		<PublicPage>
			<VStack gap={3}>
				<Heading level={1}>Cookie Policy</Heading>
				<Text as="p">Last updated: October 20, 2026</Text>
				<Text as="p">
					This Cookie Policy explains how Drawy ("We", "Us", or "Our") uses
					cookies and similar technologies (such as local storage) when You use
					the Service. It should be read together with Our{" "}
					<Link href="/privacy" isStandalone>
						Privacy Policy
					</Link>{" "}
					and{" "}
					<Link href="/terms" isStandalone>
						Terms of Service
					</Link>
					.
				</Text>
			</VStack>

			<VStack gap={3}>
				<Heading level={2}>What Are Cookies?</Heading>
				<Text as="p">
					Cookies are small text files that a website stores on Your device.
					They help the website remember information between visits, such as
					whether You are signed in or which preferences You have chosen.
				</Text>
				<Text as="p">
					Similar technologies include local storage and session storage, which
					keep data in Your browser and are not automatically sent with every
					request the way cookies are. This policy covers both cookies and these
					similar technologies.
				</Text>
			</VStack>

			<VStack gap={3}>
				<Heading level={2}>Technologies We Use</Heading>
				<Heading level={3}>Strictly Necessary Cookies</Heading>
				<Text as="p">
					These technologies are required for the Service to work and cannot be
					switched off through Our Service. They are used to keep You signed in
					and to protect Your Account.
				</Text>
				<ul className="list-disc ps-5 space-y-2">
					<li className="space-y-2">
						<Text as="p">
							<strong>drawy-session</strong>
						</Text>
						<Text as="p">Type: Session cookie</Text>
						<Text as="p">Administered by: Us</Text>
						<Text as="p">
							Purpose: Stores a signed session token so that You remain signed
							in as You move between pages. It is HTTP-only, SameSite=Lax, and
							expires after up to 7 days or when You sign out.
						</Text>
					</li>
				</ul>
				<Heading level={3}>Preference Storage</Heading>
				<Text as="p">
					We use Your browser's local storage to remember choices You make in
					the Service. This data stays on Your device and is not transmitted to
					Us, but it is used by the Service when it runs in Your browser.
				</Text>
				<ul className="list-disc ps-5 space-y-2">
					<li>
						<Text as="p">
							<strong>drawy-theme</strong> and <strong>drawy-theme-mode</strong>
							: remember Your selected theme and light/dark preference.
						</Text>
					</li>
					<li>
						<Text as="p">
							<strong>drawy-sidebar-collapsed</strong>: remembers whether the
							sidebar is collapsed.
						</Text>
					</li>
					<li>
						<Text as="p">
							<strong>Saved libraries</strong>: stores libraries and items You
							save locally in the library browser.
						</Text>
					</li>
				</ul>
				<Heading level={3}>Error Monitoring and Diagnostics</Heading>
				<Text as="p">
					We use Sentry to detect, diagnose, and fix errors and performance
					problems. Sentry may collect technical information such as error
					details, device and browser information, IP address, and a sampled
					recording of Your interactions with the Service (session replay). This
					information is used only to maintain and improve the reliability and
					security of the Service.
				</Text>
			</VStack>

			<VStack gap={3}>
				<Heading level={2}>Your Choices</Heading>
				<Text as="p">
					Most browsers let You view, manage, refuse, or delete cookies through
					their settings. You can also clear local storage for this site through
					Your browser. If You block or delete the strictly necessary session
					cookie, You will be signed out and may not be able to use parts of the
					Service that require an Account.
				</Text>
				<Text as="p">
					Where required by law, We use non-essential technologies only with
					Your consent. You can withdraw or change Your consent at any time
					through Your browser or device settings. Withdrawing consent does not
					affect the lawfulness of processing based on consent before its
					withdrawal.
				</Text>
				<Text as="p">
					Some browsers offer a "Do Not Track" signal. Because there is no
					common industry standard for responding to these signals, the Service
					does not currently respond to them. We do not use advertising cookies
					or cross-site tracking technologies.
				</Text>
			</VStack>

			<VStack gap={3}>
				<Heading level={2}>Third-Party Links</Heading>
				<Text as="p">
					The Service may link to websites We do not operate. Those websites may
					use their own cookies, and We do not control their practices. We
					encourage You to review the cookie and privacy policies of any
					third-party site You visit.
				</Text>
			</VStack>

			<VStack gap={3}>
				<Heading level={2}>Changes to This Cookie Policy</Heading>
				<Text as="p">
					We may update this Cookie Policy from time to time to reflect changes
					in the technologies We use or applicable law. We will post the updated
					policy on this page and revise the "Last updated" date above.
				</Text>
			</VStack>

			<VStack gap={3}>
				<Heading level={2}>Contact Us</Heading>
				<Text as="p">
					If You have any questions about this Cookie Policy, You can contact
					Us:
				</Text>
				<ul className="list-disc ps-5 space-y-2">
					<li className="space-y-2">
						<Text as="p">
							By email:{" "}
							<Link isExternalLink href="mailto:pratyaymustafi@outlook.com">
								pratyaymustafi@outlook.com
							</Link>
						</Text>
					</li>
					<li className="space-y-2">
						<Text as="p">
							By visiting this page on Our Website:{" "}
							<Link isExternalLink href={CONTACT_URL}>
								{CONTACT_URL}
							</Link>
						</Text>
					</li>
				</ul>
			</VStack>
		</PublicPage>
	);
}
