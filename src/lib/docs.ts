/**
 * Static documentation content bundled at build time.
 *
 * Markdown files live in `src/docs/*.md`. The first `# Heading` of each file
 * becomes its title; the file name (without extension) becomes its slug.
 */
const modules = import.meta.glob("/src/docs/*.md", {
	query: "?raw",
	import: "default",
	eager: true,
}) as Record<string, string>;

export type Doc = {
	slug: string;
	title: string;
	content: string;
};

function titleFromContent(content: string, slug: string): string {
	const match = content.match(/^#\s+(.+)$/m);
	return match ? match[1].trim() : slug;
}

export const docs: Array<Doc> = Object.entries(modules)
	.map(([path, content]) => {
		const slug = path.split("/").pop()!.replace(/\.md$/, "");
		return { slug, title: titleFromContent(content, slug), content };
	})
	.sort((a, b) => a.title.localeCompare(b.title));

export function getDoc(slug: string): Doc | undefined {
	return docs.find((doc) => doc.slug === slug);
}
