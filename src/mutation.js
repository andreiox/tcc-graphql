const { GraphQLObjectType } = require('graphql')

const types = require('./types')

module.exports = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        createSinger: {
            type: types.singerType,
            args: { singer: { type: types.singerTypeInput } },
            resolve: (value, { singer }) => {
                singer.id = uuid()
                singer.created_at = new Date()
                // TODO
            }
        }
    })
})