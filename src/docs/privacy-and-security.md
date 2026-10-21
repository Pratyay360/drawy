# Privacy and security

Drawy keeps your drawings private by default. This page summarises how data is
handled. See the full [Privacy Policy](/privacy) and [Cookie Policy](/cookies)
for details.

## What is stored

- Your username and a password hash. Passwords are hashed with scrypt and a
  per-user salt — the original password is never stored.
- The canvases you create: their content, title, and version history (the newest
  50 snapshots per canvas).
- Sharing information: the usernames a canvas is shared with, and whether a
  public link is enabled.
- Assets you upload while drawing, such as images, in the project's Supabase
  Storage bucket.

Libraries are the exception: saved libraries and library items live in your
browser's local storage, not on the server.

## What is not stored

- No email address is required or collected.
- No advertising cookies or cross-site tracking.

## Third-party services

Two services run alongside the app and may set their own cookies or storage:

- **Microsoft Clarity** — usage analytics.
- **Sentry** — error and performance monitoring, including a sampled session
  replay.

Neither is used for advertising. The [Cookie Policy](/cookies) explains what is
collected.

## Session cookie

Drawy sets a single `drawy-session` cookie. It is `httpOnly`, `SameSite=Lax`, and
lasts seven days. The value is sealed with AES-256-GCM using the server's
`SESSION_SECRET`, so it cannot be read or forged by a client. Signing out
deletes it.

## Deleting your data

Deleting a canvas from the sidebar removes the canvas, its version history, and
its uploaded assets. To delete your account and everything attached to it,
contact us through the [contact page](/contact).

## Reporting a vulnerability

If you find a security issue, please report it privately through the
[contact page](/contact) rather than opening a public issue. Include steps to
reproduce it and we will get back to you.
