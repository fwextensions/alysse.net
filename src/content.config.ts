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
			order2026: z.array(z.string()),
			order2022: z.array(z.string()).optional(),
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

	// general pages collection (block-based JSON)
	pages: defineCollection({
		loader: glob({ pattern: "*/index.json", base: "src/content/pages" }),
		schema: z.object({
			name: z.string(),
			sections: z.array(z.discriminatedUnion("discriminant", [
				z.object({
					discriminant: z.literal("hero"),
					value: z.object({
						title: z.string(),
						subtitle: z.string().optional(),
						centered: z.boolean().optional(),
					}),
				}),
				z.object({
					discriminant: z.literal("textSection"),
					value: z.object({
						heading: z.string().optional(),
						backgroundColor: z.enum(["white", "gray"]).optional(),
						maxWidth: z.enum(["small", "medium", "large"]).optional(),
						content: z.string().optional(),
					}),
				}),
				z.object({
					discriminant: z.literal("htmlBlock"),
					value: z.object({
						html: z.string(),
					}),
				}),
				z.object({
					discriminant: z.literal("cta"),
					value: z.object({
						heading: z.string(),
						description: z.string().optional(),
						backgroundColor: z.enum(["gradient", "white", "gray"]).optional(),
						primaryButtonText: z.string().optional(),
						primaryButtonLink: z.string().optional(),
						secondaryButtonText: z.string().optional(),
						secondaryButtonLink: z.string().optional(),
					}),
				}),
			])).optional(),
		}),
	}),
};
