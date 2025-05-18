import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgres://root:root@postgres:5432/db',
  max: 20, // max clients in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('Base de dados conectado com sucesso!');
});

pool.on('error', (err) => {
  console.error('Database error:', err);
});

export async function query(text, params) {
  return pool.query(text, params);
}

export { pool };
