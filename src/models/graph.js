import { query } from '../db/db.js'

export default class Graph {
  id
  name
  date_modified
  user_id

  constructor(name, user_id, id = null, date_modified = null) {
    this.id = id
    this.name = name
    this.user_id = user_id
    this.date_modified = date_modified
  }

  async create() {
    try {
      const res = await query(
        'INSERT INTO graphs (name, user_id) VALUES ($1, $2) RETURNING *',
        [this.name, this.user_id]
      )
      const row = res.rows[0]
      this.id = row.id
      this.date_modified = row.date_modified
      return this
    } catch (err) {
      console.error('Erro ao criar grafo:', err)
      return null
    }
  }

  async update() {
    try {
      const res = await query(
        'UPDATE graphs SET name = $1, date_modified = NOW() WHERE id = $2 RETURNING *',
        [this.name, this.id]
      )
      const row = res.rows[0]
      this.date_modified = row.date_modified
      return this
    } catch (err) {
      console.error('Erro ao atualizar grafo:', err)
      return null
    }
  }

  static async get_graph_by_id(id) {
    const res = await query('SELECT * FROM graphs WHERE id = $1', [id])
    return this.#from_row(res)
  }

  static async get_all_graphs() {
    const res = await query('SELECT * FROM graphs')
    return res.rows.map(
      (row) => new Graph(row.name, row.user_id, row.id, row.date_modified)
    )
  }

  static async get_graphs_by_user_id(user_id) {
    const res = await query('SELECT * FROM graphs WHERE user_id = $1', [
      user_id,
    ])
    return res.rows.map(
      (row) => new Graph(row.name, row.user_id, row.id, row.date_modified)
    )
  }

  static #from_row(res) {
    const row = res.rows[0]
    if (!row) return null
    return new Graph(row.name, row.user_id, row.id, row.date_modified)
  }

  to_object() {
    return {
      id: this.id,
      name: this.name,
      date_modified: this.date_modified,
      user_id: this.user_id,
    }
  }

  to_json() {
    return JSON.stringify(this.to_object())
  }
}
