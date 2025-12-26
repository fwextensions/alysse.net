import Markdoc from "@markdoc/markdoc";

/**
 * Renders a Markdoc string to HTML
 * HTML tags in the content are unescaped to allow inline HTML
 * @param content - The Markdoc content string
 * @returns HTML string
 */
export function renderMarkdoc(content: string): string {
	if (!content) return "";

	const ast = Markdoc.parse(content);
	const transformed = Markdoc.transform(ast);
	const html = Markdoc.renderers.html(transformed);

	// unescape HTML entities to allow inline HTML tags
	return html
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, "&");
}
