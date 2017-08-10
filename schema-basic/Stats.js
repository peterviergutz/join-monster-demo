import {
    GraphQLObjectType,
    GraphQLInt
} from 'graphql'

const Stats = new GraphQLObjectType({
    description: 'view statistics',
    name: 'Stats',
    sqlTable: `(
    select  
        post_id, 
        author_id, 
        strftime('%Y-%m-%d', datetime(c.created_at/1000, 'unixepoch')) date, 
        count(distinct c.id) comments,
        count(l.comment_id) likes
    from
        comments c
    inner join
        likes l
    on
        l.comment_id = c.id
    group by 
        post_id, author_id
    )`,
    uniqueKey: ['post_id', 'author_id', 'date'],
    fields: () => ({
        comments: {
            type: GraphQLInt,
            sqlExpr: (table, args) => `sum(comments)`
        },
        likes: {
            type: GraphQLInt,
            sqlExpr: (table, args) => `sum(likes)`
        }
    })
})

export default Stats