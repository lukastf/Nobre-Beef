
import dm from '../../../DirectMongo'
import { getSession } from 'next-auth/client'

const conta = (c) => {
    return {
        _id: c._id,
        email: c.email,
        senha: c.senha,
        cpf: c.cpf,
        celular: c.celular,
        cep: c.cep,
        endereco: c.endereco,
        numero: c.numero,
        complemento: c.complemento,
        bairro: c.bairro,
        cidade: c.cidade,
        estado: c.estado
    }
}

export default async (req, res) => {

    if (req.method === 'POST' && req.query.usuarios[0] === "usuario") {

        if (req.body.senha == null || req.body.senha.length < 6) {

            res.status(400).json({ color:"red", msg: 'Senha invalida minimo 6 digitos' });
            return;
        }

        if (req.body.senha != req.body.repetirSenha) {

            res.status(400).json({ color:"red", msg: 'Senha e Repetir Senha diferentes' });
            return;
        }

        let checkEmail = await dm.getOne("usuarios", {email: req.body.email});

        if (checkEmail) {

            res.status(400).json({ color:"red", msg: 'Email já cadastrado' });
            return;
        }

        let c = conta(req.body);
        dm.postOne("usuarios", c);
        res.status(200).json({ color:"green", msg: 'Usuario Cadastrado', code: 200 });
    } 

    if (req.method === 'PUT' && req.query.usuarios[0] === "usuario") {

        const session = await getSession({ req });

        if (session) {

            if (req.body.senha == null || req.body.senha.length < 6) {

                res.status(400).json({ color:"red", msg: 'Senha invalida minimo 6 digitos' });
                return;
            }

            if (req.body.senha != req.body.repetirSenha) {
                
                res.status(400).json({ color:"red", msg: 'Senha e Repetir Senha diferentes' });
                return;
            }
            
            let usuario = await dm.getOne("usuarios", {email: session.user.email});

            if (!usuario.admin)
            if (usuario._id != req.body._id) return;

            if (usuario.email != req.body.email) {

                let checkEmail = await dm.getOne("usuarios", {email: req.body.email});
    
                if (checkEmail) {
    
                    res.status(400).json({ color:"red", msg: 'Email já cadastrado' });
                    return;
                }
            }


            let c = conta(req.body);
            dm.putOne("usuarios", c);
            res.status(200).json({ color:"green", msg: 'Usuario Alterado', code: 200 });
        }
    }

    if (req.method === 'GET' && req.query.usuarios[0] === "usuarioSession") {

        const session = await getSession({ req });
        
        if (session) {

            let usuario = await dm.getOne("usuarios", {email: session.user.email});
            res.status(200).json(usuario);
            return;
        } 

        res.status(400).json({});
    }

    if (req.method === 'GET' && req.query.usuarios[0] === "adminCep") {

        let params = {
            admin: true
        }
    
        let usuario = await dm.getOne("usuarios", params);
 
        if (usuario) res.status(200).json({cep: usuario.cep});
        return;
    }

    const session = await getSession({ req });
    
    if (session) {
        
        let usuario = await dm.getOne("usuarios", {email: session.user.email});

        if (!usuario.admin) return;

        if (req.method === 'GET' && req.query.usuarios[0] === "usuario") {

            let params = {
                _id: req.query.usuarios[1]
            }
        
            let usuario = await dm.getOne("usuarios", params);
            res.status(200).json(usuario);
            return;
        }
        
        if (req.method === 'GET' && req.query.usuarios[0] === "usuarios") {
    
            let itensPage = parseInt(req.query.usuarios[1]);
            let page = parseInt(req.query.usuarios[2]);

            let params = {
                itensPage: itensPage,
                page: page
            };

            if (typeof req.query.usuarios[3] != "undefined") {

                let isKey = true;
                let key = "";
    
                for (let i = 3; i < req.query.usuarios.length; i++) {
    
                    if (isKey) {
                        key = req.query.usuarios[i];
                    } else {
                        params[key] = req.query.usuarios[i];
                        if(params[key] == 'true') params[key] = true;
                        if(params[key] == 'false') params[key] = false;
                    }
    
                    isKey = !isKey;
                }
            }
    
            const pages = await dm.getManyPagination("usuarios", params);
            if (!pages) { res.status(200).json({ pages: [], usuarios: [] }); return; }
    
            if (typeof req.query.usuarios[2] == "undefined") params.pageId = pages[0];
            else params.pageId = pages[page];
            
            params.itensPage = itensPage;
    
            const usuarios = await dm.getMany("usuarios", params);
    
            res.status(200).json({ pages: pages, usuarios: usuarios });
            return;
        }

        if(req.method === 'DELETE' && req.query.usuarios[0] === "usuario") {

            await dm.deleteOne("usuarios", {_id: req.query.usuarios[1]});
            res.status(200).json({ color:"green", msg: 'Usuario Excluido', code: 200 });

            return;
        }
    }
}