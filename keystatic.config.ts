import { config, fields, collection, singleton } from "@keystatic/core";

// helper to create an endorsement category singleton
function createEndorsementCategorySingleton(label: string, path: string) {
	return singleton({
		label,
		path: `src/content/endorsements/${path}`,
		format: { data: "json" },
		schema: {
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
	});
}

export default config({
	storage: {
		kind: "local",
	},
	collections: {
		// featured endorsements with rich text quotes
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

		// individual issues
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

		// endorsement categories as separate singletons
		endorsementsAlamedaCountyLeaders: createEndorsementCategorySingleton(
			"Endorsements: Alameda County Leaders",
			"alameda-county-leaders"
		),
		endorsementsCityStateLeaders: createEndorsementCategorySingleton(
			"Endorsements: City and State Leaders",
			"city-state-leaders"
		),
		endorsementsEducationLeaders: createEndorsementCategorySingleton(
			"Endorsements: Education Leaders",
			"education-leaders"
		),
		endorsementsEducation: createEndorsementCategorySingleton(
			"Endorsements: Education",
			"education"
		),
		endorsementsTeachersAssociations: createEndorsementCategorySingleton(
			"Endorsements: Teachers Associations",
			"teachers-associations"
		),
		endorsementsFormerAcoeLeaders: createEndorsementCategorySingleton(
			"Endorsements: Former ACOE Leaders",
			"former-acoe-leaders"
		),
		endorsementsPoliticalOrganizations: createEndorsementCategorySingleton(
			"Endorsements: Political Organizations",
			"political-organizations"
		),
		endorsementsElectedOfficials: createEndorsementCategorySingleton(
			"Endorsements: Elected and Appointed Officials",
			"elected-officials"
		),
		endorsementsLabor: createEndorsementCategorySingleton(
			"Endorsements: Labor",
			"labor"
		),
	},
});
