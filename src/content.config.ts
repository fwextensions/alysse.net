import { defineCollection, z } from "astro:content";
import { glob } from 'astro/loaders';

export const collections = {
    endorsements: defineCollection({
        loader: glob({ pattern: "**/*.json", base: "./src/content/endorsements" }),
        schema: z.array(z.object({
            category: z.string(),
            endorsements: z.array(
                z.object({
                    name: z.string(),
                    title: z.string()
                })
            )
        }))
    })
};
