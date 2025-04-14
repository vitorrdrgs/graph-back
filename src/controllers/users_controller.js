import bcrypt from 'bcrypt';

 /**
 * Realiza o registro do usuário, verificando nome, e-mail e senha.
 *
 * @param {import('express').Request} req - Objeto da requisição Express, contendo `nome`, `email` e `senha` no corpo.
 * @param {import('express').Response} res - Objeto da resposta Express usado para retornar o resultado do cadastro.
 * @returns {Promise<void>} Resposta HTTP com status e mensagem de erro ou sucesso.
 */
const register = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || nome.trim().length < 3) {
        return res.status(400).json({ erro: 'Nome deve ter pelo menos 3 caracteres.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ erro: 'E-mail inválido.' });
    }

    if (!senha || senha.length < 6) {
        return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    try {
        const existingUser = await db.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ erro: 'E-mail já está em uso.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(senha, salt);

        await db.insertUser({ nome, email, password_hash: hash });

        return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ erro: 'Erro interno ao registrar usuário.' });
    }
};

 /**
 * Realiza o login do usuário, verificando e-mail e senha.
 *
 * @param {import('express').Request} req - Objeto da requisição Express, contendo `email` e `senha` no corpo.
 * @param {import('express').Response} res - Objeto da resposta Express usado para retornar o resultado do login.
 * @returns {Promise<void>} Resposta HTTP com status e mensagem de erro ou sucesso.
 */
const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await db.getUserByEmail(email);

        if (!user) {
            return res.status(401).json({ erro: 'Usuário não encontrado.' });
        }

        const match = await bcrypt.compare(senha, user.password_hash);

        if (match) {
            return res.status(200).json({ mensagem: 'Login bem-sucedido.' });
            // Aqui você pode gerar um JWT ou criar uma sessão
        } else {
            return res.status(401).json({ erro: 'Senha incorreta.' });
        }
    } catch (error) {
        return res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
}

export default {
    register,
    login
}
