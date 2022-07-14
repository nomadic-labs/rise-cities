const path = require("path");

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
      graphql(
        `
          {
          allPages(filter: {template: { in: ["article.js", "event.js", "fellowship.js"]}, deleted: { ne: true } }) {
            edges {
              node {
                id
                title
                description
                slug
                externalLink
                template
                content
                category
                featured
                author
                date
                next
                head
                deleted
                registration
                livestream
              }
            }
          }
        }
        `
      ).then(result => {
        if (result.errors) {
          console.log("ERROR CREATING PAGES", result.errors);
          reject(result.errors);
        }

        result.data.allPages.edges.forEach(edge => {
          const template = path.resolve(
            `src/templates/${edge.node.template}`
          );

          console.log("CREATING PAGE", edge.node.title);
          createPage({
            path: edge.node.slug, // required
            component: template,
            layout: "default",
            context: {
              slug: edge.node.slug
            }
          });
        });

        resolve();
      })
  });
};


exports.onCreateWebpackConfig = ({ stage, loaders, actions, getConfig }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /react-rte/,
            use: loaders.null(),
          },
          {
            test: /react-rte/,
            use: loaders.null(),
          },
        ],
      }
    })
  }
}