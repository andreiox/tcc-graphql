// require dotenv
require('dotenv').config()

// require express
const express = require('express')
const app = express()

// require graphql
const {
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
} = require('graphql')
const graphqlHTTP = require('express-graphql')

// require postgres
const pg = require('pg')
const pgpool = new pg.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
})

// set up schema
const singerType = new GraphQLObjectType({
	name: 'Singer',
	fields: {
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		artistic_name: { type: GraphQLString },
		birthday: { type: GraphQLString },
		country: { type: GraphQLString },
		age: { type: GraphQLInt }
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
				return pgpool.query('SELECT * FROM singers WHERE id = $1', [obj.singer_id])
					.then(result => result.rows[0])
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
				return pgpool.query(` SELECT * FROM singers WHERE id = $1`, [obj.singer_id])
					.then((result) => result.rows[0])
			}
		},
		musics: {
			type: new GraphQLList(musicType),
			args: { limit: { type: GraphQLInt } },
			resolve: (obj, args) => {
				return pgpool.query('SELECT * FROM musics WHERE album_id = $1 LIMIT $2', [obj.id, args.limit])
					.then(result => result.rows)
			}
		}
	}
})

const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'RootQuery',
		fields: {
			singer: {
				type: singerType,
				args: { id: { type: new GraphQLNonNull(GraphQLString) } },
				resolve: (obj, args) => {
					return pgpool.query(`SELECT * FROM singers WHERE id = $1`, [args.id])
						.then(result => result.rows[0])
				}
			},
			singers: {
				type: new GraphQLList(singerType),
				resolve: () => {
					return pgpool.query(`SELECT * FROM singers`, []).then(result => result.rows)
				}
			},
			album: { 
				type: albumType,
				args: { id: { type: new GraphQLNonNull(GraphQLString) } },
				resolve: (obj, args) => {
					return pgpool.query(`SELECT * FROM albums WHERE id = $1`, [args.id])
						.then((result) => result.rows[0])
				}
			},
			albums: { 
				type: new GraphQLList(albumType),
				resolve: () => {
					return pgpool.query(` SELECT * FROM albums`, []).then((result) => result.rows)
				}
			},
			music: {
				type: musicType,
				args: { id: { type: new GraphQLNonNull(GraphQLString) } },
				resolve: (obj, args) => {
					return pgpool.query(`SELECT * FROM musics WHERE id = $1`, [args.id])
						.then(result => result.rows[0])
				}
			},
			musics: {
				type: new GraphQLList(musicType),
				resolve: () => {
					return pgpool.query(`SELECT * FROM musics`, []).then(result => result.rows)
				}
			}
		},
	}),
})

// set up express
app.use('/', graphqlHTTP({ schema: schema, graphiql: true }))

const PORT = process.env.PORT | 3000
app.listen(PORT, () => { console.log('graphql is running...') })
