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

		// general pages like About
		pages: collection({
			label: "Pages",
			slugField: "title",
			path: "src/content/pages/*/",
			format: { contentField: "content", data: "yaml" },
			entryLayout: "content",
			schema: {
				title: fields.slug({ name: { label: "Title" } }),
				content: fields.markdoc({ label: "Content" }),
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
				categoryOrder: fields.array(
					fields.relationship({
						label: "Category",
						collection: "endorsementCategories",
					}),
					{
						label: "Category Order",
						itemLabel: (props) => props.value || "Select a category",
					}
				),
			},
		}),
	},
});
