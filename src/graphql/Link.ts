import { extendType, objectType, nonNull, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
    // The name option defines the name of the type
    name: "Link",
    // Inside the definition, you can add different fields that get added to the type
    definition(t) {
        t.nonNull.int("id")
        t.nonNull.string("description")
        t.nonNull.string("url")
    },
});

// The links variable is used to store the links at runtime. For now, everything is stored only in-memory rather than being persisted in a database. You’re also using the Link interface generated by Nexus to define the type of the links variable as an array of Link objects.
let links: NexusGenObjects["Link"][] = [
    {
        id: 1,
        url: "www.howtographql.com",
        description: "Fullstack tutorial for GraphQl",
    },
    {
        id: 2,
        url: "graphql.org",
        description: "GraphQL official website",
    },
];

// You are extending the Query root type and adding a new root field to it called feed.
export const LinkQuery = extendType({
    type: "Query",
    definition(t) {
        // You define the return type of the feed query as a not nullable array of link type objects (In the SDL the return type will look like this: [Link!]!).
        t.nonNull.list.nonNull.field("feed", {
            type: "Link",
            // resolve is the name of the resolver function of the feed query. A resolver is the implementation for a GraphQL field. Every field on each type (including the root types) has a resolver function which is executed to get the return value when fetching that type. For now, our resolver implementation is very simple, it just returns the links array. The resolve function has four arguments, parent, args, context and info.
            resolve(parent, args, context, info) {
                return links;
            },
        });
    },
});

// You’re extending the Mutation type to add a new root field. You did something similar in the last chapter with the Query type.
export const LinkMutation = extendType({
    type: "Mutation",
    definition(t){
        // The name of the mutation is defined as post and it returns a (non nullable) link object.
        t.nonNull.field("post", {
            type: "Link",
            // Here you define the arguments to your mutation. You can pass arguments to your GraphQL API endpoints (just like in REST). In this case, the two arguments you need to pass are description and url. Both arguments mandatory (hence the nonNull()) because both are needed to create a new link.
            args: {
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
            },

            // You’re now using the second argument that’s passed into all resolver functions: args. Any guesses what it’s used for? … Correct! 💡 It carries the arguments for the operation – in this case the url and description of the link to be created.
            resolve(parent, args, context) {
                const {description, url} = args;

                // idCount serves as a very rudimentary way to generate new id values for our link objects. Finally, you add your new link object to the links array and return the newly created object.
                let idCount = links.length + 1;
                const link = {
                    id: idCount,
                    description: description,
                    url: url,
                };
                links.push(link);
                return link;
            }
        })
    }
})