import { Heading } from "@astryxdesign/core/Heading";
import { Link } from "@astryxdesign/core/Link";
import { VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "#/components/public-page";

export const Route = createFileRoute("/privacy")({
    head: () => ({
        meta: [
            { title: "Privacy Policy — Drawy" },
            {
                name: "description",
                content:
                    "How Drawy collects, uses and protects your data. Read the full privacy policy.",
            },
        ],
    }),
    component: PrivacyPage,
});

function PrivacyPage() {
    return (
        <PublicPage>
            <VStack gap={3}>
                <Heading level={1}>Privacy Policy</Heading>
                <Text as="p">Last updated: October 06, 2026</Text>
                <Text as="p">
                    This Privacy Policy describes Our policies and procedures on the collection, use
                    and disclosure of Your information when You use the Service and tells You about
                    Your privacy rights and how the law protects You.
                </Text>
                <Text as="p">
                    We use Your Personal Data to provide and improve the Service. We collect, use,
                    and disclose Your information as described in this Privacy Policy and, where
                    required by applicable law, only where We have a valid legal basis to do so,
                    including Your consent (where consent is required). This Privacy Policy has been
                    created with the help of the{" "}
                    <Link isExternalLink href="https://www.termsfeed.com/privacy-policy-generator/">
                        Privacy Policy Generator
                    </Link>
                    .
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
                <Text as="p">For the purposes of this Privacy Policy:</Text>
                <ul className="list-disc ps-5 space-y-2">
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>Account</strong> means a unique account created for You to
                            access Our Service or parts of Our Service.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>Affiliate</strong> means an entity that controls, is controlled
                            by, or is under common control with a party, where "control" means
                            ownership of 50% or more of the shares, equity interest or other
                            securities entitled to vote for election of directors or other managing
                            authority.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>Application</strong> refers to drawy, the software program
                            provided by the Company.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>Company</strong> (referred to as either "the Company", "We",
                            "Us" or "Our" in this Privacy Policy) refers to drawy.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>Cookies</strong> are small files that are placed on Your
                            computer, mobile device or any other device by a website, containing the
                            details of Your browsing history on that website, among its many uses.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>Country/State</strong> refers to: West Bengal, India.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>Device</strong> means any device that can access the Service,
                            such as a computer, a cell phone or a digital tablet.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>Personal Data</strong> (or "Personal Information") is any
                            information that relates to an identified or identifiable individual.
                        </Text>
                        <Text as="p">
                            We use "Personal Data" and "Personal Information" interchangeably unless
                            a law uses a specific term.
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
                            <strong>Service Provider</strong> means any natural or legal person who
                            processes the data on behalf of the Company. It refers to third-party
                            companies or individuals employed by the Company to facilitate the
                            Service, to provide the Service on behalf of the Company, to perform
                            services related to the Service or to assist the Company in analyzing
                            how the Service is used.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>Usage Data</strong> refers to data collected automatically,
                            either generated by the use of the Service or from the Service
                            infrastructure itself (for example, the duration of a page visit).
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>User</strong> means any individual who accesses or uses the
                            Service.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>Website</strong> refers to drawy, accessible from{" "}
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
                <Heading level={2}>Collecting and Using Your Personal Information</Heading>
                <Heading level={3}>Types of Data Collected</Heading>
                <Heading level={4}>Personal Data</Heading>
                <Text as="p">
                    While using Our Service, We may ask You to provide Us with certain personally
                    identifiable information that can be used to contact or identify You. Personally
                    identifiable information may include, but is not limited to:
                </Text>
                <ul className="list-disc ps-5 space-y-2">
                    <li>
                        <Text as="p">Email address</Text>
                    </li>
                </ul>
                <Heading level={4}>Usage Data</Heading>
                <Text as="p">Usage Data is collected automatically when using the Service.</Text>
                <Text as="p">
                    Usage Data may include information such as Your Device's Internet Protocol
                    address (e.g. IP address), browser type, browser version, the pages of Our
                    Service that You visit, the time and date of Your visit, the time spent on those
                    pages, unique device identifiers and other diagnostic data.
                </Text>
                <Text as="p">
                    When You access the Service by or through a mobile device, We may collect
                    certain information automatically, including, but not limited to, the type of
                    mobile device You use, Your mobile device's unique ID, the IP address of Your
                    mobile device, Your mobile operating system, the type of mobile Internet browser
                    You use, unique device identifiers and other diagnostic data.
                </Text>
                <Text as="p">
                    We may also collect information that Your browser sends whenever You visit Our
                    Service or when You access the Service by or through a mobile device.
                </Text>
                <Heading level={4}>Tracking Technologies and Cookies</Heading>
                <Text as="p">
                    We use tracking technologies (such as cookies) to track the activity and to
                    improve Our Service. The technologies We use may include:
                </Text>
                <ul className="list-disc ps-5 space-y-2">
                    <li>
                        <Text as="p">
                            <strong>Cookies or Browser Cookies.</strong> A cookie is a small file
                            placed on Your Device. You can instruct Your browser to refuse all
                            Cookies or to indicate when a Cookie is being sent. However, if You do
                            not accept Cookies, You may not be able to use some parts of Our
                            Service.
                        </Text>
                    </li>
                    <li>
                        <Text as="p">
                            <strong>Web Beacons.</strong> Certain sections of Our Service may
                            contain small electronic files known as web beacons (also referred to as
                            clear gifs, pixel tags, and single-pixel gifs) that permit the Company,
                            for example, to count users who have visited those pages and for other
                            related website statistics (for example, recording the popularity of a
                            certain section and verifying system and server integrity).
                        </Text>
                    </li>
                </ul>
                <Text as="p">
                    Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on
                    Your personal computer or mobile device when You go offline, while Session
                    Cookies are deleted as soon as You close Your web browser.
                </Text>
                <Text as="p">
                    Where required by law, We use non-essential cookies (that is, Cookies other than
                    the Necessary / Essential Cookies described below) only with Your consent. You
                    can withdraw or change Your consent at any time using Our cookie preferences
                    tool (if available) or through Your browser/device settings. Withdrawing consent
                    does not affect the lawfulness of processing based on consent before its
                    withdrawal.
                </Text>
                <Text as="p">
                    We use both Session and Persistent Cookies for the purposes set out below:
                </Text>
                <ul className="list-disc ps-5 space-y-2">
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>Necessary / Essential Cookies</strong>
                        </Text>
                        <Text as="p">Type: Session Cookies</Text>
                        <Text as="p">Administered by: Us</Text>
                        <Text as="p">
                            Purpose: These Cookies are essential to provide You with services
                            available through the Website and to enable You to use some of its
                            features. They help to authenticate users and prevent fraudulent use of
                            user accounts. Without these Cookies, the services that You have asked
                            for cannot be provided, and We only use these Cookies to provide You
                            with those services.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>Cookies Policy / Notice Acceptance Cookies</strong>
                        </Text>
                        <Text as="p">Type: Persistent Cookies</Text>
                        <Text as="p">Administered by: Us</Text>
                        <Text as="p">
                            Purpose: These Cookies identify whether users have accepted the use of
                            cookies on the Website and record the consent choices You have made, so
                            that We can honor those choices on future visits.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>Functionality Cookies</strong>
                        </Text>
                        <Text as="p">Type: Persistent Cookies</Text>
                        <Text as="p">Administered by: Us</Text>
                        <Text as="p">
                            Purpose: These Cookies allow Us to remember choices You make when You
                            use the Website, such as remembering Your Account login details or
                            language preference. The purpose of these Cookies is to provide You with
                            a more personal experience and to avoid You having to re-enter Your
                            preferences every time You use the Website.
                        </Text>
                    </li>
                </ul>
                <Heading level={3}>Use of Your Personal Data</Heading>
                <Text as="p">The Company may use Personal Data for the following purposes:</Text>
                <ul className="list-disc ps-5 space-y-2">
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>To provide and maintain Our Service</strong>, including to
                            monitor the usage of Our Service.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>To manage Your Account:</strong> to manage Your registration as
                            a user of the Service. The Personal Data You provide can give You access
                            to different functionalities of the Service that are available to You as
                            a registered user.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>For the performance of a contract:</strong> the development,
                            compliance and undertaking of the purchase contract for the products,
                            items or services You have purchased or of any other contract with Us
                            through the Service.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>To contact You:</strong> To contact You by email, telephone
                            calls, SMS, or other equivalent forms of electronic communication, such
                            as a mobile application's push notifications regarding updates or
                            informative communications related to the functionalities, products or
                            contracted services, including the security updates, when necessary or
                            reasonable for their implementation.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>To provide You</strong> with news, special offers, and general
                            information about other goods, services and events which We offer that
                            are similar to those that You have already purchased or inquired about.
                            We send such marketing communications only where permitted by applicable
                            law: where prior consent is required (for example, under the laws
                            applicable in the EEA and the UK), We will send them only with Your
                            consent; otherwise, We may send them until You opt out. You may opt out
                            or withdraw Your consent at any time by using the unsubscribe link in
                            any marketing email We send or by contacting Us.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>To manage Your requests:</strong> To attend and manage Your
                            requests to Us.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>For business transfers:</strong> We may use Your Personal Data
                            to evaluate or conduct a merger, divestiture, restructuring,
                            reorganization, dissolution, or other sale or transfer of some or all of
                            Our assets, whether as a going concern or as part of bankruptcy,
                            liquidation, or similar proceeding, in which Personal Data held by Us
                            about Our Service users is among the assets transferred.
                        </Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            <strong>For other purposes</strong>: We may use Your information for
                            other purposes, such as data analysis, identifying usage trends,
                            determining the effectiveness of Our promotional campaigns, and
                            evaluating and improving Our Service, products, services, marketing and
                            Your experience.
                        </Text>
                    </li>
                </ul>
                <Text as="p">We may share Your Personal Data in the following situations:</Text>
                <ul className="list-disc ps-5 space-y-2">
                    <li>
                        <Text as="p">
                            <strong>With Service Providers:</strong> We may share Your Personal Data
                            with Service Providers to monitor and analyze the use of Our Service,
                            and to contact You.
                        </Text>
                    </li>
                    <li>
                        <Text as="p">
                            <strong>For business transfers:</strong> We may share or transfer Your
                            Personal Data in connection with, or during negotiations of, any merger,
                            sale of Company assets, financing, or acquisition of all or a portion of
                            Our business to another company.
                        </Text>
                    </li>
                    <li>
                        <Text as="p">
                            <strong>With Affiliates:</strong> We may share Your Personal Data with
                            Our affiliates, in which case We will require those affiliates to honor
                            this Privacy Policy. Affiliates include Our parent company and any other
                            subsidiaries, joint venture partners or other companies that We control
                            or that are under common control with Us.
                        </Text>
                    </li>
                    <li>
                        <Text as="p">
                            <strong>With other users:</strong> If Our Service offers public areas,
                            when You share Personal Data or otherwise interact in the public areas
                            with other users, such information may be viewed by all users and may be
                            publicly distributed outside the Service.
                        </Text>
                    </li>
                    <li>
                        <Text as="p">
                            <strong>With Your consent</strong>: We may disclose Your Personal Data
                            for any other purpose with Your consent.
                        </Text>
                    </li>
                </ul>
                <Heading level={4}>Text Messages Privacy Notice</Heading>
                <Text as="p">
                    You have the option to receive text (SMS) messages from Us. If You opt in to
                    text messages, We will send You updates, notifications, and other communications
                    as described below. When You opt in, We will collect and store the information
                    You provide in connection with text messaging, such as Your phone number, the
                    date and method of Your consent, and message delivery and read information.
                </Text>
                <Text as="p">
                    No mobile information will be shared with or sold to third parties or affiliates
                    for marketing or promotional purposes. The phone numbers and consent records We
                    collect for texting are never shared with anyone for any purpose, except the
                    Service Providers that technically have to handle them to deliver the texts.
                </Text>
                <Text as="p">
                    Consent to receive text messages is not a condition of any purchase or use of
                    Our Service. If You consent to receive SMS from Us, You agree to receive text
                    messages from Us related to:
                </Text>
                <ul className="list-disc ps-5 space-y-2">
                    <li>
                        <Text as="p">Customer care and support</Text>
                    </li>
                    <li>
                        <Text as="p">
                            Account notifications, such as activity, status, or renewal reminders
                        </Text>
                    </li>
                    <li>
                        <Text as="p">
                            Delivery notifications and updates on the status of a delivery
                        </Text>
                    </li>
                    <li>
                        <Text as="p">
                            Authentication messages, such as one-time passwords (OTP) and passcodes
                        </Text>
                    </li>
                    <li>
                        <Text as="p">
                            Security alerts, such as suspicious login attempts or unusual account
                            activity
                        </Text>
                    </li>
                    <li>
                        <Text as="p">
                            Marketing and promotional offers, discounts, and other promotional
                            content
                        </Text>
                    </li>
                </ul>
                <Text as="p">
                    Reply STOP to opt-out. Reply HELP for support. Message & data rates may apply.
                    Messaging frequency may vary. Carriers are not liable for delayed or undelivered
                    messages.
                </Text>
                <Heading level={3}>Retention of Your Personal Data</Heading>
                <Text as="p">
                    The Company will retain Your Personal Data only for as long as is necessary for
                    the purposes set out in this Privacy Policy. We will retain and use Your
                    Personal Data to the extent necessary to comply with Our legal obligations (for
                    example, if We are required to retain Your data to comply with applicable laws),
                    resolve disputes, and enforce Our legal agreements and policies.
                </Text>
                <Text as="p">
                    Where possible, We apply shorter retention periods and/or reduce identifiability
                    by deleting, aggregating, or anonymizing data. Unless otherwise stated, the
                    retention periods below are maximum periods ("up to") and We may delete or
                    anonymize data sooner when it is no longer needed for the relevant purpose. We
                    apply different retention periods to different categories of Personal Data based
                    on the purpose of processing and legal obligations:
                </Text>
                <ul className="list-disc ps-5 space-y-2">
                    <li className="space-y-2">
                        <Text as="p">Account Information</Text>
                        <ul className="list-disc ps-5 space-y-2">
                            <li>
                                <Text as="p">
                                    User Accounts: retained for the duration of Your Account
                                    relationship plus up to 24 months after account closure to
                                    handle any post-termination issues or resolve disputes.
                                </Text>
                            </li>
                        </ul>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">Customer Support Data</Text>
                        <ul className="list-disc ps-5 space-y-2">
                            <li>
                                <Text as="p">
                                    Support tickets and correspondence: up to 24 months from the
                                    date of ticket closure to resolve follow-up inquiries, track
                                    service quality, and defend against potential legal claims.
                                </Text>
                            </li>
                            <li>
                                <Text as="p">
                                    Chat transcripts: up to 24 months for quality assurance and
                                    staff training purposes.
                                </Text>
                            </li>
                        </ul>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">Usage Data</Text>
                        <ul className="list-disc ps-5 space-y-2">
                            <li className="space-y-2">
                                <Text as="p">
                                    Website analytics data (cookies, IP addresses, device
                                    identifiers): up to 24 months from the date of collection, which
                                    allows us to analyze trends while respecting privacy principles.
                                </Text>
                            </li>
                            <li className="space-y-2">
                                <Text as="p">
                                    Application usage statistics: up to 24 months to understand
                                    feature adoption and service improvements.
                                </Text>
                            </li>
                            <li className="space-y-2">
                                <Text as="p">
                                    Server logs (IP addresses, access times): up to 24 months for
                                    security monitoring and troubleshooting purposes.
                                </Text>
                            </li>
                        </ul>
                    </li>
                </ul>
                <Text as="p">
                    Usage Data is retained in accordance with the retention periods described above,
                    and may be retained longer only where necessary for security, fraud prevention,
                    or legal compliance.
                </Text>
                <Text as="p">
                    We may retain Personal Data beyond the periods stated above for different
                    reasons:
                </Text>
                <ul className="list-disc ps-5 space-y-2">
                    <li>
                        <Text as="p">
                            Legal obligation: We are required by law to retain specific data (e.g.,
                            financial records for tax authorities).
                        </Text>
                    </li>
                    <li>
                        <Text as="p">
                            Legal claims: Data is necessary to establish, exercise, or defend legal
                            claims.
                        </Text>
                    </li>
                    <li>
                        <Text as="p">
                            Your explicit request: You ask Us to retain specific information.
                        </Text>
                    </li>
                    <li>
                        <Text as="p">
                            Technical limitations: Data exists in backup systems that are scheduled
                            for routine deletion.
                        </Text>
                    </li>
                </ul>
                <Text as="p">
                    You may request information about how long We will retain Your Personal Data by
                    contacting Us.
                </Text>
                <Text as="p">
                    When retention periods expire, We securely delete or anonymize Personal Data
                    according to the following procedures:
                </Text>
                <ul className="list-disc ps-5 space-y-2">
                    <li>
                        <Text as="p">
                            Deletion: Personal Data is removed from Our systems and no longer
                            actively processed.
                        </Text>
                    </li>
                    <li>
                        <Text as="p">
                            Backup retention: Residual copies may remain in encrypted backups for a
                            limited period consistent with Our backup retention schedule and are not
                            restored except where necessary for security, disaster recovery, or
                            legal compliance.
                        </Text>
                    </li>
                    <li>
                        <Text as="p">
                            Anonymization: In some cases, We convert Personal Data into anonymous
                            statistical data that cannot be linked back to You. This anonymized data
                            may be retained indefinitely for research and analytics.
                        </Text>
                    </li>
                </ul>
                <Heading level={3}>Transfer of Your Personal Data</Heading>
                <Text as="p">
                    Your information, including Personal Data, is processed at the Company's
                    operating offices and in any other places where the parties involved in the
                    processing are located. This means that this information may be transferred to —
                    and maintained on — computers located outside of Your state, province, country
                    or other governmental jurisdiction where the data protection laws may differ
                    from those of Your jurisdiction.
                </Text>
                <Text as="p">
                    Where required by applicable law, We will ensure that international transfers of
                    Your Personal Data are subject to appropriate safeguards and, where relevant,
                    supplementary measures. The Company will take all steps reasonably necessary to
                    ensure that Your data is treated securely and in accordance with this Privacy
                    Policy and no transfer of Your Personal Data will take place to an organization
                    or a country unless there are adequate controls in place, including the security
                    of Your data and other personal information.
                </Text>
                <Heading level={3}>Delete Your Personal Data</Heading>
                <Text as="p">
                    You have the right to delete or request that We assist in deleting the Personal
                    Data that We have collected about You.
                </Text>
                <Text as="p">
                    Our Service may give You the ability to delete certain information about You
                    from within the Service.
                </Text>
                <Text as="p">
                    You may update, amend, or delete Your information at any time by signing in to
                    Your Account, if You have one, and visiting the account settings section that
                    allows You to manage Your personal information. You may also contact Us to
                    request access to, correct, or delete any Personal Data that You have provided
                    to Us.
                </Text>
                <Text as="p">
                    Please note, however, that We may need to retain certain information when We
                    have a legal obligation or lawful basis to do so.
                </Text>
                <Heading level={3}>Disclosure of Your Personal Data</Heading>
                <Heading level={4}>Business Transactions</Heading>
                <Text as="p">
                    If the Company is involved in a merger, acquisition or asset sale, Your Personal
                    Data may be transferred. We will provide notice before Your Personal Data is
                    transferred and becomes subject to a different Privacy Policy.
                </Text>
                <Heading level={4}>Law Enforcement</Heading>
                <Text as="p">
                    Under certain circumstances, the Company may disclose Your Personal Data if
                    required to do so by law or in response to valid requests by public authorities
                    (e.g. a court or a government agency).
                </Text>
                <Heading level={4}>Other Legal Requirements</Heading>
                <Text as="p">
                    The Company may disclose Your Personal Data in the good-faith belief that such
                    action is necessary to:
                </Text>
                <ul className="list-disc ps-5 space-y-2">
                    <li>
                        <Text as="p">Comply with a legal obligation</Text>
                    </li>
                    <li>
                        <Text as="p">Protect and defend the rights or property of the Company</Text>
                    </li>
                    <li>
                        <Text as="p">
                            Prevent or investigate possible wrongdoing in connection with the
                            Service
                        </Text>
                    </li>
                    <li>
                        <Text as="p">
                            Protect the personal safety of Users of the Service or the public
                        </Text>
                    </li>
                    <li>
                        <Text as="p">Protect against legal liability</Text>
                    </li>
                </ul>
                <Heading level={3}>Security of Your Personal Data</Heading>
                <Text as="p">
                    The security of Your Personal Data is important to Us, but remember that no
                    method of transmission over the Internet, or method of electronic storage, is
                    100% secure. While We strive to use commercially reasonable means to protect
                    Your Personal Data, We cannot guarantee its absolute security.
                </Text>
            </VStack>
            <VStack gap={3}>
                <Heading level={2}>Children's and Minors' Privacy</Heading>
                <Text as="p">
                    The Service is not directed to, and We do not knowingly collect Personal
                    Information from, anyone under the age of 16.
                </Text>
                <Text as="p">
                    If You are a parent or guardian and You believe Your child has provided Us with
                    Personal Information, please contact Us. If We become aware that We have
                    collected Personal Information from anyone under the age of 16, We will take
                    steps to remove that information from Our servers as soon as reasonably
                    possible.
                </Text>
                <Text as="p">
                    Some countries and states set a higher age at which an individual can consent to
                    the processing of their own Personal Information. Where We rely on consent as a
                    legal basis and the law applicable to a User sets an age higher than 16, We may
                    require the consent of that User's parent or guardian before We collect and use
                    their Personal Information.
                </Text>
            </VStack>
            <VStack gap={3}>
                <Heading level={2}>Links to Other Websites</Heading>
                <Text as="p">
                    Our Service may contain links to other websites that are not operated by Us. If
                    You click on a third-party link, You will be directed to that third party's
                    site. We strongly advise You to review the Privacy Policy of every site You
                    visit.
                </Text>
                <Text as="p">
                    We have no control over and assume no responsibility for the content, privacy
                    policies or practices of any third-party sites or services.
                </Text>
            </VStack>
            <VStack gap={3}>
                <Heading level={2}>Changes to this Privacy Policy</Heading>
                <Text as="p">
                    We may update Our Privacy Policy from time to time. We will notify You of any
                    changes by posting the new Privacy Policy on this page.
                </Text>
                <Text as="p">
                    We will let You know via email and/or a prominent notice on Our Service, prior
                    to the change becoming effective and update the "Last updated" date at the top
                    of this Privacy Policy.
                </Text>
                <Text as="p">
                    You are advised to review this Privacy Policy periodically for any changes.
                    Changes to this Privacy Policy are effective when they are posted on this page.
                </Text>
            </VStack>
            <VStack gap={3}>
                <Heading level={2}>Contact Us</Heading>
                <Text as="p">
                    If You have any questions about this Privacy Policy, You can contact Us:
                </Text>
                <ul className="list-disc ps-5 space-y-2">
                    <li className="space-y-2">
                        <Text as="p">By email: pratyaymustafi@outlook.com</Text>
                    </li>
                    <li className="space-y-2">
                        <Text as="p">
                            By visiting this page on Our Website:{" "}
                            <Link isExternalLink href="https://app.youform.com/forms/moki0tve">
                                https://app.youform.com/forms/moki0tve
                            </Link>
                        </Text>
                    </li>
                </ul>
            </VStack>
        </PublicPage>
    );
}