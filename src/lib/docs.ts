/**
 * Static documentation content bundled at build time.
 *
 * Markdown files live in `src/docs/*.md`. Each file starts with a front matter
 * block that carries the title, a one line summary and the position of the
 * guide in the sidebar:
 *
 * ```md
 * ---
 * title: Getting started
 * description: Create an account and draw your first canvas.
 * order: 1
 * ---
 * ```
 *
 * The file name (without extension) is the slug, so `/docs/getting-started`
 * serves `src/docs/getting-started.md`.
 */
const modules = import.meta.glob("/src/docs/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
}) as Record<string, string>;

export type Doc = {
    slug: string;
    title: string;
    description: string;
    order: number;
    content: string;
};

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/** Parse the `key: value` pairs of a front matter block. */
function parseFrontMatter(block: string): Record<string, string> {
    const fields: Record<string, string> = {};
    for (const line of block.split("\n")) {
        const match = line.match(/^([a-zA-Z]+):\s*(.+)$/);
        if (match) {
            fields[match[1]] = match[2].trim();
        }
    }
    return fields;
}

/**
 * Drop the leading `# Title` heading. The title is rendered by the page, not by
 * the markdown body, so the body starts at `##` and the document keeps a
 * single `h1`.
 */
function stripTitle(content: string): string {
    return content.replace(/^#\s+.+\r?\n+/, "");
}

function parseDoc(path: string, raw: string): Doc {
    const slug = path.split("/").pop()!.replace(/\.md$/, "");
    const match = raw.match(FRONT_MATTER);
    const fields = match ? parseFrontMatter(match[1]) : {};
    const body = match ? raw.slice(match[0].length) : raw;
    const title = fields.title ?? slug;

    return {
        slug,
        title,
        description: fields.description ?? "",
        order: Number.parseInt(fields.order ?? "", 10) || 0,
        content: stripTitle(body).trim(),
    };
}

export const docs: Array<Doc> = Object.entries(modules)
    .map(([path, content]) => parseDoc(path, content))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

export function getDoc(slug: string): Doc | undefined {
    return docs.find((doc) => doc.slug === slug);
}

/** The guide before and after `slug`, for the previous/next footer. */
export function getDocNeighbours(slug: string): {
    previous?: Doc;
    next?: Doc;
} {
    const index = docs.findIndex((doc) => doc.slug === slug);
    if (index === -1) return {};
    return {
        previous: index > 0 ? docs[index - 1] : undefined,
        next: index < docs.length - 1 ? docs[index + 1] : undefined,
    };
}