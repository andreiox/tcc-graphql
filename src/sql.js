const dotenv = require('dotenv')
const pg = require('pg')
const uuid = require('uuid/v4')

dotenv.config()

const pgpool = new pg.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
})

exports.insert = function insert(table, data) {
    data.id = uuid()
    data.created_at = new Date()

    return pgpool.query(generateInsertSQL(table, data), Object.values(data)).then(result => result.rows[0])
}

exports.update = function update(table, data) {
    const id = data.id
    delete data.id
    delete data.created_at

    const values = Object.values(data)
    values.push(id)

    return pgpool.query(generateUpdateSQL(table, data), values).then(result => result.rows[0])
}

exports.select = function select(table, condition, conditionValues) {
    return pgpool.query(generateSelectSQL(table, condition), conditionValues).then(result => result.rows)
}

exports.delet = function delet(table, id) {
    return pgpool.query(generateDeleteSQL(table), [id]).then(result => true).catch(err => false)
}

function generateInsertSQL(table, data) {
    const columns = Object.keys(data)
    const placehouders = columns.map((column, index) => { return `$${index + 1}` })

    return `INSERT INTO ${table} (${columns.join()}) VALUES (${placehouders}) RETURNING *`
}

function generateUpdateSQL(table, data) {
    const columns = Object.keys(data)
    const placehouders = columns.map((column, index) => { return `${column}=$${index + 1}` })

    return `UPDATE ${table} SET ${placehouders.join()} WHERE id=$${columns.length + 1} RETURNING *`
}

function generateSelectSQL(table, condition, attributesToRetrieve = ['*']) {
    const placehouders = condition.map((field, index) => { return `${field}=$${index + 1}` })

    let sql = `SELECT ${attributesToRetrieve.join()} FROM ${table}`
    if (placehouders.length) {
        sql = sql + ` WHERE ${placehouders.join(' and ')}`
    }

    return sql
}

function generateDeleteSQL(table) {
    return `DELETE FROM ${table} WHERE id=$1`
}
