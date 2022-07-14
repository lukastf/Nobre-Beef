import dm from '../../../DirectMongo'
import { getSession } from 'next-auth/client'

export default async (req, res) => {

    if(req.method === 'GET' && req.query.categorias[0] === "categorias") {

        let params = {itensPage: 0};

        const pages = await dm.getManyPagination("categorias", params);
        if (!pages) return;

        params.pageId = pages[0];

        const categorias = await dm.getMany("categorias", params);

        res.status(200).json(categorias);
        return;
    }

    if (req.method === 'GET' && req.query.categorias[0] === "categoria") {

        let params = {
            _id: req.query.categorias[1]
        }
    
        let categoria = await dm.getOne("categorias", params);
        res.status(200).json(categoria);
        return;
    }

    //admin

    const session = await getSession({ req });
    
    if (session) {
        
        let usuario = await dm.getOne("usuarios", {email: session.user.email});

        if (!usuario.admin) return;

        if (req.method === 'GET' && req.query.categorias[0] === "categoriasPages") {

            let itensPage = parseInt(req.query.categorias[1]);
            let page = parseInt(req.query.categorias[2]);

            let params = {
                itensPage: itensPage,
                page: page
            };

            if (typeof req.query.categorias[3] != "undefined") {

                let isKey = true;
                let key = "";
    
                for (let i = 3; i < req.query.categorias.length; i++) {
    
                    if (isKey) {
                        key = req.query.categorias[i];
                    } else {
                        params[key] = req.query.categorias[i];
                        if(params[key] == 'true') params[key] = true;
                        if(params[key] == 'false') params[key] = false;
                    }
    
                    isKey = !isKey;
                }
            }
    
            const pages = await dm.getManyPagination("categorias", params);
            if (!pages) { res.status(200).json({ pages: [], categorias: [] }); return; }
    
            if ( typeof req.query.categorias[2] == "undefined") params.pageId = pages[0];
            else params.pageId = pages[page];

            params.itensPage = itensPage;
    
            const categorias = await dm.getMany("categorias", params);
    
            res.status(200).json({ pages: pages, categorias: categorias });
            return;
        }

        if(req.method === 'POST' && req.query.categorias[0] === "categoria") {

            if (req.body.nome == null || req.body.nome.length > 100) {

                res.status(400).json({ color:"red", msg: 'Categoria invalida' });
                return;
            }

            let categoria = await dm.getOne("categorias", {nome: req.body.nome});

            if (categoria) {

                res.status(400).json({ color:"red", msg: 'Categoria ja cadastrada' });
                return;
            }

            dm.postOne("categorias", {nome: req.body.nome});
            res.status(200).json({ color:"green", msg: 'Categoria Cadastrada', code: 200 });

            return;
        }

        if(req.method === 'PUT' && req.query.categorias[0] === "categoria") {

            if (req.body.nome == null || req.body.nome.length > 100) {

                res.status(400).json({ color:"red", msg: 'Categoria invalida' });
                return;
            }

            let categoria = await dm.getOne("categorias", {nome: req.body.nome});

            if (categoria) {

                res.status(400).json({ color:"red", msg: 'Categoria ja cadastrada' });
                return;
            }

            let params = {
                _id: req.query.categorias[1],
                nome: req.body.nome
            }

            dm.putOne("categorias", params);
            res.status(200).json({ color:"green", msg: 'Categoria Editada', code: 200 });

            return;
        }

        if(req.method === 'DELETE' && req.query.categorias[0] === "categoria") {

            await dm.deleteOne("categorias", {_id: req.query.categorias[1]});
            res.status(200).json({ color:"green", msg: 'Categoria Excluida', code: 200 });

            return;
        }
    }

}