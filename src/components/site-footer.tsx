import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
import { LayoutFooter } from "@astryxdesign/core/Layout";
import { Link } from "@astryxdesign/core/Link";
import { HStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { Mail } from "lucide-react";

export const CONTACT_URL = "https://app.youform.com/forms/moki0tve";

export function SiteFooter() {
	return (
		<LayoutFooter hasDivider padding={4}>
			<HStack align="center" gap={3} justify="between" wrap="wrap">
				<Text size="sm" type="supporting">
					Drawy
				</Text>
				<HStack align="center" gap={3} wrap="wrap">
					<Link href="/privacy" isStandalone size="sm">
						Privacy Policy
					</Link>
					<Button
						href={CONTACT_URL}
						icon={<Icon icon={Mail} size="sm" />}
						label="Contact us"
						rel="noopener noreferrer"
						size="sm"
						target="_blank"
						variant="secondary"
					/>
				</HStack>
			</HStack>
		</LayoutFooter>
	);
}
