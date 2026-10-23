---
title: Privacy and security
description: What Drawy stores, what it deliberately does not, and how to get rid of it.
order: 4
---

Drawy keeps your drawings private by default. This page is the short version;
the [Privacy Policy](/privacy) and [Cookie Policy](/cookies) are the legal
documents.

## What is stored

- **Your account** — the username and a password hash. Passwords are hashed with
  scrypt and a per-user salt, so the original password is never stored and
  cannot be recovered from the database.
- **Your canvases** — their content, title and version history, capped at the
  newest 50 snapshots per canvas.
- **Sharing settings** — the usernames a canvas is shared with, and whether its
  public link is enabled.

## What is not stored

- No email address is required or collected.
- No advertising cookies, and nothing is sold to advertisers.
- No third-party analytics profile is built about you.

## Images

Images you paste or upload while drawing are sent to an external image host
(imgcdn.dev), and only the resulting URL is saved with the canvas. Anything
already on that host is outside our control — ask us through the
[contact page](/contact) if you need something taken down. Self-hosters who
would rather keep images on their own infrastructure can replace the upload
call in `src/lib/s3.ts`.

## Libraries

Libraries are the exception to the rule above: saved libraries and library
items live in your browser's local storage, not on the server. They are not
tied to your account and do not follow you to another device.

## Error monitoring

Sentry collects error and performance data, including a sampled session replay,
so that problems can be diagnosed. It may set its own cookies or storage
entries. The [Cookie Policy](/cookies) explains what is collected and why.

The carbon badge in the sidebar asks the WebsiteCarbon API how much carbon the
page it is on emits, which means that service sees the address of the page you
are reading.

## Session cookie

Drawy sets a single cookie, `drawy-session`. It is `httpOnly`, `SameSite=Lax`,
`Secure` in production, and it lasts seven days. The value is signed with
HMAC-SHA256 using the server's `SESSION_SECRET`, so it cannot be forged or
edited. Signing out deletes it.

## Deleting your data

Deleting a canvas from the sidebar removes the canvas and its version history.
Images already uploaded to imgcdn.dev stay on that host, so use the
[contact page](/contact) if you need them removed. To delete your account and
everything attached to it, use the same page.

## Reporting a vulnerability

If you find a security issue, please report it through the
[vulnerability form](https://app.youform.com/forms/moki0tve) instead of opening
a public issue. Include the steps to reproduce it and we will get back to you.

## Related

- [Sharing and collaboration](/docs/sharing) — who can see a canvas
- [Self-hosting](/docs/selfhost) — keep the data on your own database