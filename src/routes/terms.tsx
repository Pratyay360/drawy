import { Heading } from "@astryxdesign/core/Heading";
import { Link } from "@astryxdesign/core/Link";
import { VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { createFileRoute } from "@tanstack/react-router";
import { CONTACT_URL } from "#/components/site-footer";
import { PublicPage } from "#/components/public-page";

export const Route = createFileRoute("/terms")({
    head: () => ({
        meta: [
            { title: "Terms of Service — Drawy" },
            {
                name: "description",
                content: "The terms that govern your access to and use of Drawy.",
            },
        ],
    }),
    component: TermsPage,
});

function TermsPage() {
    return (
        <PublicPage>
            <VStack gap={3}>
                <Heading level={1}>Terms of Service</Heading>
                <Text as="p">Last updated: October 20, 2026</Text>
                <Text as="p">
                    These Terms of Service ("Terms") govern Your access to and use of Drawy,
                    including the website, application, and any related services (collectively, the
                    "Service"). By creating an account, accessing, or using the Service, You agree
                    to be bound by these Terms. If You do not agree to these Terms, do not access or
                    use the Service.
                </Text>
                <Text as="p">
                    Please read these Terms together with Our{" "}
                    <Link href="/privacy" isStandalone>
                        Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link href="/cookies" isStandalone>
                        Cookie Policy
                    </Link>
                    , which describe how We handle Your information.
                </Text>
            </VStack>

            <VStack gap={3}>
                <Heading level={2}>Interpretation and Definitions</Heading>
                <Heading level={3}>Interpretation</Heading>
                <Text as="p">
                    The words whose initial letters are capitalized have meanings defined under the
                    following conditions. The following definitions shall have the same meaning
                    regardless of whether they appear in singular or in plural.
                </Text>
                <Heading level={3}>Definitions</Heading>
                <Text as="p">For the purposes of these Terms:</Text>
                <ul className="list-disc ps-5 space-y-2">
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>Account</strong> means a unique account created for You to
                            access the Service or parts of the Service.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>Application</strong> refers to Drawy, the software program
                            provided by the Company.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>Company</strong> (referred to as either "the Company", "We",
                            "Us" or "Our" in these Terms) refers to Drawy.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>Country/State</strong> refers to: West Bengal, India.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>Service</strong> refers to the Application or the Website or
                            both.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>User Content</strong> means drawings, text, images, files, and
                            any other material that You create, upload, or share through the
                            Service.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>Website</strong> refers to Drawy, accessible from{" "}
                            <Link isExternalLink href="https://drawy.pratyay.online/">
                                https://drawy.pratyay.online/
                            </Link>
                            .
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>You</strong> means the individual accessing or using the
                            Service, or the company, or other legal entity on behalf of which such
                            individual is accessing or using the Service, as applicable.
                        </Text>
                    </li>
                </ul>
            </VStack>

            <VStack gap={3}>
                <Heading level={2}>Eligibility and Accounts</Heading>
                <Text as="p">
                    You must be at least 16 years old to use the Service. By using the Service, You
                    represent and warrant that You meet this requirement and that You have the legal
                    capacity to enter into these Terms.
                </Text>
                <Text as="p">
                    To access some features, You must create an Account with a username and
                    password. You agree to provide accurate information, keep Your credentials
                    confidential, and remain responsible for all activity that occurs under Your
                    Account.
                </Text>
                <Text as="p">
                    You must notify Us promptly at{" "}
                    <Link isExternalLink href="mailto:pratyaymustafi@outlook.com">
                        pratyaymustafi@outlook.com
                    </Link>{" "}
                    if You believe Your Account has been accessed without authorization. We are not
                    liable for any loss or damage arising from Your failure to protect Your
                    credentials.
                </Text>
            </VStack>

            <VStack gap={3}>
                <Heading level={2}>Your Content</Heading>
                <Text as="p">
                    You retain ownership of the User Content You create and share through the
                    Service. We do not claim ownership of Your drawings.
                </Text>
                <Text as="p">
                    By using the Service, You grant Us a worldwide, non-exclusive, royalty-free
                    license to host, store, reproduce, display, transmit, and process Your User
                    Content solely as necessary to operate, provide, and improve the Service. This
                    includes displaying Your drawings to other users when You share a canvas or
                    collaborate in real time. This license ends when You delete Your User Content or
                    Your Account, except where content was shared with others or where retention is
                    required by law.
                </Text>
                <Text as="p">
                    You represent and warrant that You own or have the necessary rights to the User
                    Content You submit and that Your User Content does not infringe the rights of
                    any third party or violate applicable law.
                </Text>
                <Text as="p">
                    We may remove User Content that We reasonably believe violates these Terms or
                    applicable law, or that exposes the Service or other users to harm. We may also
                    disable access to content pending an investigation.
                </Text>
            </VStack>

            <VStack gap={3}>
                <Heading level={2}>Acceptable Use</Heading>
                <Text as="p">You agree not to:</Text>
                <ul className="list-disc ps-5 space-y-2">
                    <li>
                        <Text as="p">
                            Use the Service for any unlawful, infringing, fraudulent, or harmful
                            purpose.
                        </Text>
                    </li>
                    <li>
                        <Text as="p">
                            Upload or share content that is defamatory, harassing, hateful, obscene,
                            or that violates another person's privacy or intellectual property
                            rights.
                        </Text>
                    </li>
                    <li>
                        <Text as="p">
                            Attempt to gain unauthorized access to the Service, other users'
                            accounts, or Our systems and networks.
                        </Text>
                    </li>
                    <li>
                        <Text as="p">
                            Interfere with or disrupt the Service, including by distributing
                            malware, launching denial-of-service attacks, or placing unreasonable
                            load on Our infrastructure.
                        </Text>
                    </li>
                    <li>
                        <Text as="p">
                            Reverse engineer, decompile, or attempt to extract the source code of
                            the Service, except where such restriction is prohibited by law.
                        </Text>
                    </li>
                    <li>
                        <Text as="p">
                            Use automated means to access the Service in a manner that exceeds
                            reasonable use or circumvents technical protections.
                        </Text>
                    </li>
                    <li>
                        <Text as="p">
                            Impersonate any person or entity, or misrepresent Your affiliation with
                            a person or entity.
                        </Text>
                    </li>
                </ul>
                <Text as="p">
                    We may investigate and take appropriate action, including suspending or
                    terminating Your Account, if You violate these Terms.
                </Text>
            </VStack>

            <VStack gap={3}>
                <Heading level={2}>Our Intellectual Property</Heading>
                <Text as="p">
                    The Service, including its software, design, text, graphics, logos, and
                    trademarks, is owned by the Company or its licensors and is protected by
                    intellectual property laws. These Terms do not grant You any right to use Our
                    name, logo, or branding without Our prior written permission.
                </Text>
                <Text as="p">
                    Subject to these Terms, We grant You a limited, non-exclusive, non-transferable,
                    revocable license to access and use the Service for Your personal or internal
                    business purposes.
                </Text>
            </VStack>

            <VStack gap={3}>
                <Heading level={2}>Third-Party Services</Heading>
                <Text as="p">
                    The Service relies on third-party providers for hosting, infrastructure, error
                    monitoring, and related services. The Service may also contain links to
                    third-party websites or services that We do not own or control. We are not
                    responsible for the content, policies, or practices of any third party, and Your
                    use of third-party services is at Your own risk.
                </Text>
            </VStack>

            <VStack gap={3}>
                <Heading level={2}>Availability and Changes to the Service</Heading>
                <Text as="p">
                    We aim to keep the Service available, but We do not guarantee uninterrupted or
                    error-free operation. We may modify, suspend, or discontinue all or part of the
                    Service at any time, including to perform maintenance, address security issues,
                    or improve features. We will make reasonable efforts to provide notice of
                    material changes where practicable.
                </Text>
            </VStack>

            <VStack gap={3}>
                <Heading level={2}>Termination</Heading>
                <Text as="p">
                    You may stop using the Service at any time, and You may request deletion of Your
                    Account by contacting Us. We may suspend or terminate Your access to the Service
                    immediately, without prior notice, if You breach these Terms, if required by
                    law, or if We reasonably believe Your use poses a risk to the Service or other
                    users.
                </Text>
                <Text as="p">
                    Upon termination, Your right to use the Service ends. Sections that by their
                    nature should survive termination, including ownership, disclaimers, limitation
                    of liability, indemnification, and governing law, will continue to apply.
                </Text>
            </VStack>

            <VStack gap={3}>
                <Heading level={2}>Disclaimers</Heading>
                <Text as="p">
                    The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any
                    kind, whether express, implied, or statutory, including implied warranties of
                    merchantability, fitness for a particular purpose, title, and non-infringement.
                    We do not warrant that the Service will be secure, accurate, complete, or free
                    of errors, or that defects will be corrected.
                </Text>
                <Text as="p">
                    Some jurisdictions do not allow the exclusion of certain warranties, so some of
                    the above exclusions may not apply to You.
                </Text>
            </VStack>

            <VStack gap={3}>
                <Heading level={2}>Limitation of Liability</Heading>
                <Text as="p">
                    To the maximum extent permitted by applicable law, the Company and its officers,
                    directors, employees, and agents will not be liable for any indirect,
                    incidental, special, consequential, or punitive damages, or for any loss of
                    profits, data, goodwill, or business opportunity, arising out of or relating to
                    Your use of or inability to use the Service.
                </Text>
                <Text as="p">
                    To the maximum extent permitted by applicable law, the Company's total aggregate
                    liability for all claims arising out of or relating to these Terms or the
                    Service will not exceed the greater of (a) the amount You paid Us for the
                    Service in the twelve months preceding the claim or (b) INR 1,000.
                </Text>
                <Text as="p">
                    Nothing in these Terms limits any liability that cannot be limited under
                    applicable law.
                </Text>
            </VStack>

            <VStack gap={3}>
                <Heading level={2}>Indemnification</Heading>
                <Text as="p">
                    You agree to indemnify, defend, and hold harmless the Company and its officers,
                    directors, employees, and agents from and against any claims, liabilities,
                    damages, losses, and expenses, including reasonable legal fees, arising out of
                    or in any way connected with Your User Content, Your use of the Service, or Your
                    breach of these Terms.
                </Text>
            </VStack>

            <VStack gap={3}>
                <Heading level={2}>Governing Law and Disputes</Heading>
                <Text as="p">
                    These Terms are governed by and construed in accordance with the laws of India,
                    without regard to its conflict of law principles. You agree to submit to the
                    exclusive jurisdiction of the courts located in West Bengal, India, for the
                    resolution of any dispute arising out of or relating to these Terms or the
                    Service.
                </Text>
            </VStack>

            <VStack gap={3}>
                <Heading level={2}>Changes to These Terms</Heading>
                <Text as="p">
                    We may update these Terms from time to time. If We make material changes, We
                    will post the new Terms on this page and update the "Last updated" date above.
                    Where required by law, We will provide additional notice. Your continued use of
                    the Service after the changes take effect means You accept the revised Terms.
                </Text>
            </VStack>

            <VStack gap={3}>
                <Heading level={2}>Contact Us</Heading>
                <Text as="p">If You have any questions about these Terms, You can contact Us:</Text>
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