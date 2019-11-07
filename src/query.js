const { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } = require('graphql')

const { select } = require('./sql')
const types = require('./types')

module.exports = new GraphQLObjectType({
    name: 'Query',
    fields: {
        singer: {
            type: types.singerType,
            args: { id: { type: new GraphQLNonNull(GraphQLString) } },
            resolve: (obj, args, root, ast) => {
                const fieldNode = ast.fieldNodes[0]
                const fields = fieldNode.selectionSet.selections.map(selection => selection.name.value);
                if (!fields.length) { fields.push('*') }

                return select('singers', ['id'], [args.id], fields).then(res => res[0])
            }
        },
        singers: {
            type: new GraphQLList(types.singerType),
            resolve: (obj, args, root, ast) => {
                const fieldNode = ast.fieldNodes[0]
                const fields = fieldNode.selectionSet.selections.map(selection => selection.name.value);
                if (!fields.length) { fields.push('*') }

                return select('singers', [], [], fields)
            }
        },
        album: {
            type: types.albumType,
            args: { id: { type: new GraphQLNonNull(GraphQLString) } },
            resolve: (obj, args, root, ast) => {
                const fieldNode = ast.fieldNodes[0]
                const fields = fieldNode.selectionSet.selections.map(selection => selection.name.value);
                if (!fields.length) { fields.push('*') }

                return select('albums', ['id'], [args.id], fields).then(res => res[0])
            }
        },
        albums: {
            type: new GraphQLList(types.albumType),
            resolve: (obj, args, root, ast) => {
                const fieldNode = ast.fieldNodes[0]
                const fields = fieldNode.selectionSet.selections.map(selection => selection.name.value);
                if (!fields.length) { fields.push('*') }

                return select('albums', [], [], fields)
            }
        },
        music: {
            type: types.musicType,
            args: { id: { type: new GraphQLNonNull(GraphQLString) } },
            resolve: (obj, args, root, ast) => {
                const fieldNode = ast.fieldNodes[0]
                const fields = fieldNode.selectionSet.selections.map(selection => selection.name.value);
                if (!fields.length) { fields.push('*') }

                return select('musics', ['id'], [args.id], fields).then(res => res[0])
            }
        },
        musics: {
            type: new GraphQLList(types.musicType),
            resolve: (obj, args, root, ast) => {
                const fieldNode = ast.fieldNodes[0]
                const fields = fieldNode.selectionSet.selections.map(selection => selection.name.value);
                if (!fields.length) { fields.push('*') }

                return select('musics', [], [], fields)
            }
        }
    },
})
