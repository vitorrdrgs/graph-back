import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: 'postgres://root:root@postgres:5432/db',
})

pool.on('connect', () => {
  console.log('Base de dados conectado com sucesso!')
})

pool.on('error', (err) => {
  console.log('Error ', err)
})

export function query(text, params) {
  return pool.query(text, params)
}

export { pool }

