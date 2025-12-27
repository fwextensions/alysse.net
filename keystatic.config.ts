import { config, fields, collection, singleton } from "@keystatic/core";

const isLocal = import.meta.env.PUBLIC_KEYSTATIC_STORAGE === "local";

export default config({
	storage: isLocal
		? { kind: "local" }
		: { kind: "github", repo: "fwextensions/alysse.net" },

	collections: {
		// endorsement categories (dynamic, like issues)
		endorsementCategories: collection({
			label: "Endorsement Categories",
			slugField: "name",
			path: "src/content/endorsement-categories/*/",
			format: { data: "json" },
			schema: {
				name: fields.slug({ name: { label: "Category Name" } }),
				endorsements: fields.array(
					fields.object({
						name: fields.text({ label: "Name", validation: { isRequired: true } }),
						title: fields.text({ label: "Title" }),
					}),
					{
						label: "Endorsements",
						itemLabel: (props) => props.fields.name.value || "New Endorsement",
					}
				),
			},
		}),

		// featured endorsements with rich text quotes and one photo
		featuredEndorsements: collection({
			label: "Featured Endorsements",
			slugField: "author",
			path: "src/content/featured-endorsements/*/",
			format: { contentField: "quote", data: "yaml" },
			entryLayout: "content",
			schema: {
				author: fields.slug({ name: { label: "Author Name" } }),
				title: fields.text({ label: "Title/Role" }),
				photo: fields.image({
					label: "Photo",
					directory: "src/assets/img/endorsements",
					publicPath: "../../../assets/img/endorsements/",
				}),
				quote: fields.markdoc({ label: "Quote" }),
			},
		}),

		// individual issues, each with one image
		issues: collection({
			label: "Issues",
			slugField: "heading",
			path: "src/content/issues/*/",
			format: { contentField: "content", data: "yaml" },
			entryLayout: "content",
			schema: {
				heading: fields.slug({ name: { label: "Heading" } }),
				image: fields.image({
					label: "Image",
					directory: "src/assets/img/issues",
					publicPath: "../../../assets/img/issues/",
				}),
				imageAlt: fields.text({ label: "Image Alt Text" }),
				content: fields.markdoc({ label: "Content" }),
			},
		}),

		// general pages with block-based content
		pages: collection({
			label: "Pages",
			slugField: "name",
			path: "src/content/pages/*/",
			format: { data: "json" },
			schema: {
				name: fields.slug({ name: { label: "Page Title" } }),
				sections: fields.blocks(
					{
						hero: {
							label: "Hero Section",
							schema: fields.object({
								title: fields.text({ label: "Title", validation: { isRequired: true } }),
								subtitle: fields.text({ label: "Subtitle" }),
								centered: fields.checkbox({ label: "Centered", defaultValue: true }),
							}),
						},
						textSection: {
							label: "Text Section",
							schema: fields.object({
								heading: fields.text({ label: "Heading" }),
								backgroundColor: fields.select({
									label: "Background",
									options: [
										{ label: "White", value: "white" },
										{ label: "Gray", value: "gray" },
									],
									defaultValue: "white",
								}),
								maxWidth: fields.select({
									label: "Max Width",
									options: [
										{ label: "Small", value: "small" },
										{ label: "Medium", value: "medium" },
										{ label: "Large", value: "large" },
									],
									defaultValue: "medium",
								}),
								content: fields.markdoc.inline({
									label: "Content",
									description: "Rich text content with Markdoc formatting",
								}),
							}),
						},
						htmlBlock: {
							label: "HTML Block",
							schema: fields.object({
								html: fields.text({
									label: "HTML Content",
									multiline: true,
									description: "Raw HTML with Tailwind classes",
								}),
							}),
						},
						cta: {
							label: "CTA Section",
							schema: fields.object({
								heading: fields.text({ label: "Heading", validation: { isRequired: true } }),
								description: fields.text({ label: "Description" }),
								backgroundColor: fields.select({
									label: "Background",
									options: [
										{ label: "Gradient", value: "gradient" },
										{ label: "White", value: "white" },
										{ label: "Gray", value: "gray" },
									],
									defaultValue: "gradient",
								}),
								primaryButtonText: fields.text({ label: "Primary Button Text" }),
								primaryButtonLink: fields.text({ label: "Primary Button Link" }),
								secondaryButtonText: fields.text({ label: "Secondary Button Text" }),
								secondaryButtonLink: fields.text({ label: "Secondary Button Link" }),
							}),
						},
					},
					{ label: "Page Sections" }
				),
			},
		}),
	},

	singletons: {
		// issues page configuration
		issuesPage: singleton({
			label: "Issues Page",
			path: "src/content/issues-page/config",
			format: { data: "json" },
			schema: {
				heroTitle: fields.text({ label: "Hero Title", validation: { isRequired: true } }),
				heroSubtitle: fields.text({ label: "Hero Subtitle" }),
				issueOrder: fields.array(
					fields.relationship({
						label: "Issue",
						collection: "issues",
					}),
					{
						label: "Issue Order",
						itemLabel: (props) => props.value || "Select an issue",
					}
				),
			},
		}),

		// endorsements gallery (photos on endorsements page)
		endorsementsGallery: singleton({
			label: "Endorsements Gallery",
			path: "src/content/endorsements-gallery/list",
			format: { data: "json" },
			schema: {
				endorsements: fields.array(
					fields.object({
						name: fields.text({ label: "Name", validation: { isRequired: true } }),
						title: fields.text({ label: "Title" }),
						photo: fields.image({
							label: "Photo",
							directory: "src/assets/img/endorsements",
							publicPath: "../../assets/img/endorsements/",
						}),
					}),
					{
						label: "Endorsements",
						itemLabel: (props) => props.fields.name.value || "New Endorsement",
					}
				),
			},
		}),

		// endorsements page configuration
		endorsementsPage: singleton({
			label: "Endorsements Page",
			path: "src/content/endorsements-page/config",
			format: { data: "json" },
			schema: {
				order2026: fields.array(
					fields.relationship({
						label: "Category",
						collection: "endorsementCategories",
					}),
					{
						label: "Category Order",
						itemLabel: (props) => props.value || "Select a category",
					}
				),
				order2022: fields.array(
					fields.relationship({
						label: "Category",
						collection: "endorsementCategories",
					}),
					{
						label: "Previous Category Order (2022)",
						itemLabel: (props) => props.value || "Select a category",
					}
				),
			},
		}),
	},
});
