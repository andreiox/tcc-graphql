const dotenv = require('dotenv')
const express = require('express')
const { GraphQLSchema } = require('graphql')
const graphqlHTTP = require('express-graphql')

dotenv.config()

const app = express()

const query = require('./query')
const mutation = require('./mutation')

const schema = new GraphQLSchema({
	query: query,
	mutation: mutation,
})

app.use('/', graphqlHTTP({ schema: schema, graphiql: true }))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => { console.log(`GraphQL is running on port ${PORT}`) })
