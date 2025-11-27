import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

const PAGES = [
    {
        input: 'c:/Projects/Alysse/alysse.net/wix/www.alysse.net/alysse.html',
        output: 'c:/Projects/Alysse/alysse.net/astro-site/src/content/pages/about.md'
    },
    {
        input: 'c:/Projects/Alysse/alysse.net/wix/www.alysse.net/issues-1.html',
        output: 'c:/Projects/Alysse/alysse.net/astro-site/src/content/pages/issues.md'
    }
];

function extractPageContent(inputPath, outputPath) {
    const html = fs.readFileSync(inputPath, 'utf-8');
    const $ = cheerio.load(html);

    // Remove noise
    $('script, style, noscript, iframe, svg').remove();

    // Clean text
    // Replace non-breaking spaces with regular spaces
    // Replace multiple spaces/newlines with a single space to get a continuous flow
    // This is a heuristic. Ideally we'd preserve block level elements.
    // Let's try to get text from paragraphs.

    let content = "";
    $('p, h1, h2, h3, h4, h5, h6, li').each((i, el) => {
        const text = $(el).text().replace(/\s+/g, ' ').trim();
        if (text.length > 0) {
            content += text + "\n\n";
        }
    });

    if (content.length === 0) {
        // Fallback if no semantic tags found
        content = $('body').text().replace(/\s+/g, ' ').trim();
    }

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, content, 'utf-8');
    console.log(`Extracted content to ${outputPath}`);
}

function main() {
    console.log("Starting page extraction...");
    for (const page of PAGES) {
        try {
            extractPageContent(page.input, page.output);
        } catch (error) {
            console.error(`Error extracting ${page.input}:`, error);
        }
    }
}

main();
