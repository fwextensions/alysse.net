import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const collections = {
	endorsements: defineCollection({
		loader: glob({
			pattern: "endorsements.json",
			base: "src/content/endorsements"
		}),
		schema: z.array(z.object({
			category: z.string(),
			endorsements: z.array(
				z.object({
					name: z.string(),
					title: z.string()
				})
			)
		}))
	}),
	endorsementsGallery: defineCollection({
		loader: glob({
			pattern: "endorsements-gallery.json",
			base: "src/content/endorsements"
		}),
		schema: ({ image }) => z.array(z.object({
			name: z.string(),
			title: z.string(),
			photo: image()
		}))
	})
};
