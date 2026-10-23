import * as Sentry from "@sentry/tanstackstart-react";

/**
 * Helpers for Sentry Agent Tracing conversations.
 *
 * Agent Tracing auto-instruments supported AI SDKs once tracing is enabled
 * (see instrument.client.ts / instrument.server.ts). Conversations group
 * multi-turn AI activity into a single timeline; call `startConversation`
 * before any AI call in a chat session and reuse the same id across turns.
 */

export function startConversation(conversationId: string): void {
    Sentry.setConversationId(conversationId);
}

export function endConversation(): void {
    Sentry.setConversationId(null);
}

export function identifyConversationUser(user: {
    id?: string;
    email?: string;
    username?: string;
}): void {
    Sentry.setUser(user);
}