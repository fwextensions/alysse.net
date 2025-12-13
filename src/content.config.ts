import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// endorsement schema shared across category singletons
const endorsementSchema = z.object({
	endorsements: z.array(z.object({
		name: z.string(),
		title: z.string(),
	})),
});

export const collections = {
	// endorsement category singletons
	endorsementsAlamedaCountyLeaders: defineCollection({
		loader: glob({ pattern: "alameda-county-leaders.json", base: "src/content/endorsements" }),
		schema: endorsementSchema,
	}),
	endorsementsCityStateLeaders: defineCollection({
		loader: glob({ pattern: "city-state-leaders.json", base: "src/content/endorsements" }),
		schema: endorsementSchema,
	}),
	endorsementsEducationLeaders: defineCollection({
		loader: glob({ pattern: "education-leaders.json", base: "src/content/endorsements" }),
		schema: endorsementSchema,
	}),
	endorsementsEducation: defineCollection({
		loader: glob({ pattern: "education.json", base: "src/content/endorsements" }),
		schema: endorsementSchema,
	}),
	endorsementsTeachersAssociations: defineCollection({
		loader: glob({ pattern: "teachers-associations.json", base: "src/content/endorsements" }),
		schema: endorsementSchema,
	}),
	endorsementsFormerAcoeLeaders: defineCollection({
		loader: glob({ pattern: "former-acoe-leaders.json", base: "src/content/endorsements" }),
		schema: endorsementSchema,
	}),
	endorsementsPoliticalOrganizations: defineCollection({
		loader: glob({ pattern: "political-organizations.json", base: "src/content/endorsements" }),
		schema: endorsementSchema,
	}),
	endorsementsElectedOfficials: defineCollection({
		loader: glob({ pattern: "elected-officials.json", base: "src/content/endorsements" }),
		schema: endorsementSchema,
	}),
	endorsementsLabor: defineCollection({
		loader: glob({ pattern: "labor.json", base: "src/content/endorsements" }),
		schema: endorsementSchema,
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
