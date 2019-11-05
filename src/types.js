const { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLInputObjectType, GraphQLString } = require('graphql')

const { select } = require('./sql')

const singerType = new GraphQLObjectType({
    name: 'Singer',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        artistic_name: { type: GraphQLString },
        birthday: { type: GraphQLString },
        country: { type: GraphQLString },
        age: { type: GraphQLInt },
        created_at: { type: GraphQLString }
    }
})

const musicType = new GraphQLObjectType({
    name: 'Music',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        album_id: { type: GraphQLString },
        length_in_seconds: { type: GraphQLInt },
        created_at: { type: GraphQLString },
        singer: {
            type: singerType,
            resolve: (obj) => {
                return select('singers', ['id'], [obj.singer_id]).then(res => res[0])
            }
        }
    }
})

const albumType = new GraphQLObjectType({
    name: 'Album',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        release_date: { type: GraphQLString },
        created_at: { type: GraphQLString },
        singer: {
            type: singerType,
            resolve: (obj) => {
                return select('singers', ['id'], [obj.singer_id]).then(res => res[0])
            }
        },
        musics: {
            type: new GraphQLList(musicType),
            args: { limit: { type: GraphQLInt } },
            resolve: (obj, args) => {
                return select('musics', ['album_id'], [obj.id])
            }
        }
    }
})

const singerTypeInput = new GraphQLInputObjectType({
    name: 'SingerInput',
    fields: {
        name: { type: GraphQLString },
        artistic_name: { type: GraphQLString },
        birthday: { type: GraphQLString },
        country: { type: GraphQLString },
        age: { type: GraphQLInt }
    }
})

const musicTypeInput = new GraphQLInputObjectType({
    name: 'MusicInput',
    fields: {
        name: { type: GraphQLString },
        album_id: { type: GraphQLString },
        length_in_seconds: { type: GraphQLInt },
        signer_id: { type: GraphQLString }
    }
})

const albumTypeInput = new GraphQLInputObjectType({
    name: 'AlbumInput',
    fields: {
        name: { type: GraphQLString },
        release_date: { type: GraphQLString },
        singer_id: { type: GraphQLString },
    }
})

module.exports = { singerType, singerTypeInput, albumType, albumTypeInput, musicType, musicTypeInput }
