const { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } = require('graphql')

const { select } = require('./sql')
const types = require('./types')

module.exports = new GraphQLObjectType({
    name: 'Query',
    fields: {
        singer: {
            type: types.singerType,
            args: { id: { type: new GraphQLNonNull(GraphQLString) } },
            resolve: (obj, args) => { return select('singers', ['id'], [args.id]).then(res => res[0]) }
        },
        singers: {
            type: new GraphQLList(types.singerType),
            resolve: () => { return select('singers', [], []) }
        },
        album: {
            type: types.albumType,
            args: { id: { type: new GraphQLNonNull(GraphQLString) } },
            resolve: (obj, args) => { return select('albums', ['id'], [args.id]).then(res => res[0]) }
        },
        albums: {
            type: new GraphQLList(types.albumType),
            resolve: () => { return select('albums', [], []) }
        },
        music: {
            type: types.musicType,
            args: { id: { type: new GraphQLNonNull(GraphQLString) } },
            resolve: (obj, args) => { return select('musics', ['id'], [args.id]).then(res => res[0]) }
        },
        musics: {
            type: new GraphQLList(types.musicType),
            resolve: () => { return select('musics', [], []) }
        }
    },
})
