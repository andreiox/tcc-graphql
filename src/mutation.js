const { GraphQLObjectType, GraphQLString } = require('graphql')

const { insert, update, delet } = require('./sql.js')
const types = require('./types')

module.exports = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        createSinger: {
            type: types.singerType,
            args: { singer: { type: types.singerTypeInput } },
            resolve: (value, { singer }) => { return insert('singers', singer) }
        },
        updateSinger: {
            type: types.singerType,
            args: { id: { type: GraphQLString }, singer: { type: types.singerTypeInput } },
            resolve: (value, { id, singer }) => { return update('singers', singer, id) }
        },
        deleteSinger: {
            type: types.singerType,
            args: { id: { type: GraphQLString } },
            resolve: (value, { id }) => { return delet('singers', id) }
        },
        createAlbum: {
            type: types.albumType,
            args: { singer: { type: types.albumTypeInput } },
            resolve: (value, { album }) => { return insert('albums', album) }
        },
        updateAlbum: {
            type: types.albumType,
            args: { id: { type: GraphQLString }, singer: { type: types.albumTypeInput } },
            resolve: (value, { id, album }) => { return update('albums', album, id) }
        },
        deleteAlbum: {
            type: types.albumType,
            args: { id: { type: GraphQLString } },
            resolve: (value, { id }) => { return delet('albums', id) }
        },
        createMusic: {
            type: types.musicType,
            args: { singer: { type: types.musicTypeInput } },
            resolve: (value, { music }) => { return insert('musics', music) }
        },
        updateMusic: {
            type: types.musicType,
            args: { id: { type: GraphQLString }, singer: { type: types.musicTypeInput } },
            resolve: (value, { id, music }) => { return update('musics', music, id) }
        },
        deleteMusic: {
            type: types.musicType,
            args: { id: { type: GraphQLString } },
            resolve: (value, { id }) => { return delet('musics', id) }
        }
    })
})
