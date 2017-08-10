import {
    GraphQLNonNull,
    GraphQLString
} from 'graphql'

import Stats from "./Stats";

class StatsConnection {

    constructor(statsKey, parentKey) {

        return {
            type: Stats,
            args: {
                'from': {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'left boundary'
                },
                'to': {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'right boundary'
                }
            },
            where: (table, args, context, sqlASTNode) => {

                // odd way of implementing groupBy, but seems to be the only feasible approach
                // climb up sqlAstNode, build up group by fields (ids at this time) and push into context.groupBy
                // TODO find a way to handle sqlBatch between grouped sqlBatch
                let node = sqlASTNode, groupBy = []
                while (node.parent) {

                    console.log("node.parent.name", node.parent.name)

                    let mapping = {
                        posts: 'post_id',
                        authors: 'author_id',
                        accounts: 'author_id',
                    };

                    if(typeof mapping[node.parent.name] != "undefined") {
                        groupBy.push(mapping[node.parent.name])
                    }
                    node = node.parent
                }

                if(groupBy.length > 0) {
                    // having an array as groupBy allows for multiple groupBy in one grapQL query
                    // groupBys are shifted() in fetch.js
                    // TODO: implement proper way of groupBy
                    context.groupBy.push(groupBy)
                }

                return `${table}.date between '${args.from}' and '${args.to}'`
            },
            sqlBatch: {
                thisKey: statsKey,
                parentKey: parentKey
            }
        }
    }
}

export default StatsConnection