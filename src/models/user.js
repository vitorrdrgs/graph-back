import { query } from '../db/db.js'

export default class User {
  id
  name
  email
  password

  constructor(name, email, password, id = null) {
    this.id = id
    this.name = name
    this.email = email
    this.password = password
  }

  async create() {
    try {
      const res = await query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [this.name, this.email, this.password]
      )
      return res.rows[0]
    } catch (err) {
      return null
    }
  }

  async update() {
    try {
      const res = await query(
        'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
        [this.name, this.email, this.password, this.id]
      )

      return res.rows[0]
    } catch (err) {
      return null
    }
  }

  static async get_all_users() {
    const res = await query('SELECT * FROM users')
    return res.rows
  }

  static async get_user_by_id(id) {
    const res = await query('SELECT * FROM users WHERE id = $1', [id])

    const new_user = this.#from_row(res)
    return new_user
  }

  static async get_user_by_email(email) {
    const res = await query('SELECT * FROM users WHERE email = $1', [email])

    const new_user = this.#from_row(res)
    return new_user
  }

  static #from_row(res) {
    const row = res.rows[0]

    if (row == null) {
      return null
    }

    return new User(row.name, row.email, row.password, row.id)
  }

  to_json() {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      email: this.email,
    })
  }

  to_object() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
    }
  }
}
