import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

const HTML_PATH = 'c:/Projects/Alysse/alysse.net/wix/www.alysse.net/endorsements.html';
const OUTPUT_PATH = 'c:/Projects/Alysse/alysse.net/astro-site/src/content/endorsements/endorsements.json';

function extractEndorsements() {
    const html = fs.readFileSync(HTML_PATH, 'utf-8');
    const $ = cheerio.load(html);

    const endorsements = {
        education_leaders: [],
        alameda_county_leaders: [],
        city_and_state_leaders: [],
        organizations: [],
        elected_officials: [],
        labor: [],
        community_leaders: [],
        testimonials: []
    };

    // Remove script and style tags to avoid noise
    $('script, style, noscript, iframe, svg').remove();

    // Get text and clean it up
    const textContent = $('body').text();

    // Replace non-breaking spaces with regular spaces
    const cleanText = textContent.replace(/\u00A0/g, ' ');

    // Split by newlines, trim, and filter empty lines
    const lines = cleanText.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 1);

    let currentCategory = null;

    const headerMap = {
        "Education Leaders:": "education_leaders",
        "Alameda County Leaders:": "alameda_county_leaders",
        "City and State Leaders:": "city_and_state_leaders",
        "Political organizations": "organizations",
        "Elected and appointed officials": "elected_officials",
        "Labor": "labor"
    };

    for (const line of lines) {
        // Check for headers
        if (headerMap[line]) {
            currentCategory = headerMap[line];
            continue;
        }

        // Stop conditions
        if (line.startsWith("Endorsements:") || line === "top of page") {
            currentCategory = null;
            continue;
        }

        // Special handling for Community Leaders section
        if (line.includes("...and community leaders")) {
            currentCategory = "community_leaders";
            continue;
        }

        if (currentCategory === "community_leaders") {
            // Just collect raw lines for this section as they are variable length
            endorsements.community_leaders.push(line);
            continue;
        }

        if (currentCategory) {
            let name = line;
            let title = "";

            if (line.includes(',')) {
                const parts = line.split(',');
                name = parts[0].trim();
                title = parts.slice(1).join(',').trim();
            } else if (line.includes('—')) {
                const parts = line.split('—');
                name = parts[0].trim();
                title = parts.slice(1).join('—').trim();
            }

            // Filter out some noise if needed
            if (name.length > 1 && !name.includes('{') && !name.includes('}')) {
                endorsements[currentCategory].push({ name, title });
            }
        }
    }

    // Extract Images
    const imageDestDir = path.join(path.dirname(OUTPUT_PATH), '../../assets/images/gallery');
    if (!fs.existsSync(imageDestDir)) {
        fs.mkdirSync(imageDestDir, { recursive: true });
    }

    const processedImages = new Set();
    let imgIndex = 1;

    $('img').each((i, el) => {
        const src = $(el).attr('src');
        // Filter for gallery images (heuristic: usually in media/ folder and not small icons)
        if (src && src.includes('media/') && !processedImages.has(src)) {
            processedImages.add(src);

            // Resolve path
            const relativePath = src.replace(/^\.\.\//, '');
            const absoluteSrcPath = path.join(path.dirname(HTML_PATH), '..', relativePath);
            const decodedSrcPath = decodeURIComponent(absoluteSrcPath);

            if (fs.existsSync(decodedSrcPath)) {
                copyImage(decodedSrcPath, imageDestDir, imgIndex++);
            } else {
                // Try to find it in the directory if it's a directory
                const potentialDir = decodedSrcPath.split('/v1/')[0];
                if (fs.existsSync(potentialDir) && fs.lstatSync(potentialDir).isDirectory()) {
                    const files = findFilesRecursively(potentialDir);
                    if (files.length > 0) {
                        copyImage(files[0], imageDestDir, imgIndex++);
                    }
                }
            }
        }
    });

    return endorsements;
}

function findFilesRecursively(dir) {
    let results = [];
    try {
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            file = path.join(dir, file);
            const stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                results = results.concat(findFilesRecursively(file));
            } else {
                if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
                    results.push(file);
                }
            }
        });
    } catch (e) {
        // Ignore errors
    }
    return results;
}

function copyImage(srcPath, destDir, index) {
    const ext = path.extname(srcPath) || '.jpg';
    const destName = `gallery-image-${index}${ext}`;
    const destPath = path.join(destDir, destName);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${srcPath} to ${destPath}`);
}

function main() {
    console.log("Starting extraction...");
    try {
        const data = extractEndorsements();

        const dir = path.dirname(OUTPUT_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Successfully extracted data to ${OUTPUT_PATH}`);
    } catch (error) {
        console.error("Error extracting data:", error);
    }
}

main();
