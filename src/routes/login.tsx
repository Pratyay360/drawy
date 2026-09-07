import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Center } from "@astryxdesign/core/Center";
import { Heading } from "@astryxdesign/core/Heading";
import { Icon } from "@astryxdesign/core/Icon";
import { VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { createFileRoute, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { LockKeyhole, PenTool, User } from "lucide-react";
import { useState } from "react";
import { getCurrentUser, signIn, signUp } from "#/lib/session";
import { normalizeUsername, usernameError } from "#/lib/username";

type Mode = "signin" | "signup";

export const Route = createFileRoute("/login")({
    beforeLoad: async () => {
        const user = await getCurrentUser();
        if (user) throw redirect({ to: "/" });
    },
    component: LoginPage,
});

function LoginPage() {
    const router = useRouter();
    const navigate = useNavigate();

    const [mode, setMode] = useState<Mode>("signin");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [usernameTouched, setUsernameTouched] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    function switchMode(next: Mode) {
        setMode(next);
        setError(null);
    }

    const usernameInvalid = usernameError(username);
    const showUsernameError = (usernameTouched || submitAttempted) && usernameInvalid;

    async function handleSubmit() {
        setBusy(true);
        setError(null);
        setSubmitAttempted(true);

        const invalidUsername = usernameError(username);
        if (invalidUsername) {
            setError(invalidUsername);
            setBusy(false);
            return;
        }

        try {
            const displayUsername = normalizeUsername(username);
            if (mode === "signup") {
                await signUp({ data: { username: displayUsername, password } });
            } else {
                await signIn({ data: { username: displayUsername, password } });
            }

            await router.invalidate();
            await navigate({ to: "/" });
        } catch (cause) {
            setError(
                cause instanceof Error ? cause.message : "Something went wrong. Please try again.",
            );
        } finally {
            setBusy(false);
        }
    }

    return (
        <Center height="100vh" padding={4}>
            <Card width={380} padding={6}>
                <VStack gap={5}>
                    <VStack gap={1} hAlign="center">
                        <Icon icon={PenTool} size="lg" />
                        <Heading level={1}>Drawy</Heading>
                        <Text type="supporting">
                            {mode === "signin"
                                ? "Sign in to access your drawings"
                                : "Create your Drawy account"}
                        </Text>
                    </VStack>

                    <VStack gap={3}>
                        <TextInput
                            label="Username"
                            value={username}
                            onChange={(value) => {
                                setUsername(value);
                                setUsernameTouched(true);
                            }}
                            onBlur={() => setUsernameTouched(true)}
                            onEnter={handleSubmit}
                            hasAutoFocus
                            placeholder="your_username"
                            startIcon={<Icon icon={User} size="sm" />}
                            isRequired
                            status={
                                showUsernameError
                                    ? { type: "error", message: usernameInvalid }
                                    : undefined
                            }
                        />
                        <TextInput
                            label="Password"
                            type="password"
                            value={password}
                            onChange={setPassword}
                            onEnter={handleSubmit}
                            placeholder="••••••••"
                            startIcon={<Icon icon={LockKeyhole} size="sm" />}
                            isRequired
                            status={error ? { type: "error", message: error } : undefined}
                        />
                    </VStack>

                    <Button
                        label={mode === "signin" ? "Sign in" : "Create an account"}
                        onClick={handleSubmit}
                        isLoading={busy}
                        width="100%"
                    />
                    <Button
                        label={
                            mode === "signin"
                                ? "New here? Create an account"
                                : "Already have an account? Sign in"
                        }
                        variant="ghost"
                        onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
                        isDisabled={busy}
                        width="100%"
                    />
                </VStack>
            </Card>
        </Center>
    );
}