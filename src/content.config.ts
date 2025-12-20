import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const collections = {
	// endorsement categories collection (dynamic)
	endorsementCategories: defineCollection({
		loader: glob({ pattern: "*/index.json", base: "src/content/endorsement-categories" }),
		schema: z.object({
			name: z.string(),
			endorsements: z.array(z.object({
				name: z.string(),
				title: z.string(),
			})),
		}),
	}),

	// endorsements page config singleton
	endorsementsPage: defineCollection({
		loader: glob({ pattern: "config.json", base: "src/content/endorsements-page" }),
		schema: z.object({
			categoryOrder: z.array(z.string()),
		}),
	}),

	// endorsements gallery singleton
	endorsementsGallery: defineCollection({
		loader: glob({ pattern: "list.json", base: "src/content/endorsements-gallery" }),
		schema: ({ image }) => z.object({
			endorsements: z.array(z.object({
				name: z.string(),
				title: z.string(),
				photo: image(),
			})),
		}),
	}),

	// featured endorsements collection (MDX)
	featuredEndorsements: defineCollection({
		loader: glob({ pattern: "*/index.mdoc", base: "src/content/featured-endorsements" }),
		schema: ({ image }) => z.object({
			author: z.string(),
			title: z.string(),
			photo: image(),
		}),
	}),

	// issues collection (MDX)
	issues: defineCollection({
		loader: glob({ pattern: "*/index.mdoc", base: "src/content/issues" }),
		schema: ({ image }) => z.object({
			heading: z.string(),
			image: image(),
			imageAlt: z.string(),
		}),
	}),

	// issues page config singleton
	issuesPage: defineCollection({
		loader: glob({ pattern: "config.json", base: "src/content/issues-page" }),
		schema: z.object({
			heroTitle: z.string(),
			heroSubtitle: z.string(),
			issueOrder: z.array(z.string()),
		}),
	}),

	// general pages collection (MDX)
	pages: defineCollection({
		loader: glob({ pattern: "*.md", base: "src/content/pages" }),
		schema: z.object({
			title: z.string().optional(),
		}),
	}),
};
