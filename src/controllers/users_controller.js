/* global process */
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import Graph from '../models/graph.js'

/**
 * Realiza o registro do usuário, verificando nome, e-mail e senha.
 *
 * @param {import('express').Request} req - Objeto da requisição Express, contendo `name`, `email` e `password` no corpo.
 * @param {import('express').Response} res - Objeto da resposta Express usado para retornar o resultado do cadastro.
 * @returns {Promise<void>} Resposta HTTP com status e mensagem de erro ou sucesso.
 */
const register = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || name.trim().length < 3) {
    return res
      .status(400)
      .json({ erro: 'Nome deve ter pelo menos 3 caracteres.' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ erro: 'E-mail inválido.' })
  }

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ erro: 'A senha deve ter pelo menos 6 caracteres.' })
  }

  try {
    const existingUser = await User.get_user_by_email(email)
    if (existingUser) {
      return res.status(409).json({ erro: 'E-mail já está em uso.' })
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = new User(name, email, hash)
    console.log(hash)
    await user.create()

    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.' })
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno ao registrar usuário.' })
  }
}

/**
 * Realiza o login do usuário, verificando e-mail e senha.
 *
 * @param {import('express').Request} req - Objeto da requisição Express, contendo `email` e `senha` no corpo.
 * @param {import('express').Response} res - Objeto da resposta Express usado para retornar o resultado do login.
 * @returns {Promise<void>} Resposta HTTP com status e mensagem de erro ou sucesso.
 */
const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.get_user_by_email(email)

    if (!user) {
      return res.status(401).json({ erro: 'Usuário não encontrado.' })
    }

    const match = await bcrypt.compare(password, user.password)

    if (match) {
      const id = user.id
      const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 300,
      })
      return res.status(200).json({
        auth: true,
        token: token,
        mensagem: 'Login bem-sucedido.',
      })
    } else {
      return res.status(401).json({ erro: 'Senha incorreta.' })
    }
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
}

const grafos = async (req, res) => {
  const { id } = req.user_info

  try {
    const graphs = await Graph.get_graphs_by_user_id(id)
    const grafos_formatados = graphs.map((g) => g.to_object())

    return res.status(200).json({ grafos: grafos_formatados })
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
}

export default {
  register,
  login,
  grafos,
}
