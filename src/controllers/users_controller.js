import bcrypt from 'bcrypt';

const register = (req, res) => {
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

    // VERIFICAR SE O EMAIL JÁ EXISTE NO BANCO DE DADOS

    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, (err, salt) => {
        if(err){
            return res.status(500).json({ erro: 'Erro ao gerar o salt.' });
        }

        bcrypt.hash(senha, salt, (err_paswd, hash) => {
            if(err_paswd){
                return res.status(500).json({ erro: 'Erro ao gerar o hash da senha.' });
            }

            res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.' });

            // ARMAZENAR O USUÁRIO NO BANCO DE DADOS
        });
    });
}

export default {
    register,
}
