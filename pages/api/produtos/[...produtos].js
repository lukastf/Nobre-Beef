
import dm from '../../../DirectMongo'
import { getSession } from 'next-auth/client'
import Correios from 'node-correios'

const produto = (p, converter) => {

    return {
        _id: p._id,
        nome: p.nome,
        preco: converter(p.preco),
        quantidade: converter(p.quantidade),
        categoria: p.categoria,
        comprimento: converter(p.comprimento),
        largura: converter(p.largura),
        altura: converter(p.altura),
        peso: converter(p.peso),
        diametro: converter(p.diametro),
        formato: converter(p.formato),
        descricao: p.descricao,
        imagens: p.imagens,
        premium: p.premium,
        linksExterno: p.linksExterno
    }
}

const produtoGet = (p) => {

    const converter = (v) => {
        v = String(v);
        if (v.includes(".")) v = v.replace(".", ",");
        //v = parseFloat(v);
        return v;
    }

    return produto(p, converter);

    /*return {
        _id: p._id,
        nome: p.nome,
        preco: converter(p.preco),
        quantidade: converter(p.quantidade),
        categoria: p.categoria,
        comprimento: converter(p.comprimento),
        largura: converter(p.largura),
        altura: converter(p.altura),
        peso: converter(p.peso),
        diametro: converter(p.diametro),
        formato: converter(p.formato),
        descricao: p.descricao,
        imagens: p.imagens,
        premium: p.premium,
        linksExterno: p.linksExterno
    }*/
}

const produtoPost = (p) => {

    const converter = (v) => {
        v = String(v);
        if (v.includes(",")) v = v.replace(",", ".");
        v = parseFloat(v);
        if (isNaN(v)) v = 0;
        return v;
    }

    return produto(p, converter);

    /*return {
        _id: p._id,
        nome: p.nome,
        preco: converter(p.preco),
        quantidade: converter(p.quantidade),
        categoria: p.categoria,
        comprimento: converter(p.comprimento),
        largura: converter(p.largura),
        altura: converter(p.altura),
        peso: converter(p.peso),
        diametro: converter(p.diametro),
        formato: converter(p.formato),
        descricao: p.descricao,
        imagens: p.imagens,
        premium: p.premium,
        linksExterno: p.linksExterno
    }*/
}

export default async (req, res) => {

    const session = await getSession({ req });
    
    if (req.method === 'GET' && req.query.produtos[0] === "produtos") {

        let itensPage = parseInt(req.query.produtos[1]);
        let page = parseInt(req.query.produtos[2]);

        let params = {
            itensPage: itensPage,
            page: page
        };

        if (typeof req.query.produtos[3] != "undefined") {

            let isKey = true;
            let key = "";

            for (let i = 3; i < req.query.produtos.length; i++) {

                if (isKey) {
                    key = req.query.produtos[i];
                } else {
                    params[key] = req.query.produtos[i];
                    if(params[key] == 'true') params[key] = true;
                    if(params[key] == 'false') params[key] = false;
                }

                isKey = !isKey;
            }
        }

        const pages = await dm.getManyPagination("produtos", params);
        if (!pages) { res.status(200).json({ pages: [], produtos: [] }); return; }

        params.itensPage = itensPage;

        if (typeof req.query.produtos[2] == "undefined") params.pageId = pages[0];
        else params.pageId = pages[page];

        let produtos = await dm.getMany("produtos", params);

        for (let i = 0; i < produtos.length; i++) {

            produtos[i] = produtoGet(produtos[i]);
        }

        res.status(200).json({ pages: pages, produtos: produtos });
        return;
    }

    if (req.method === 'GET' && req.query.produtos[0] === "produto") {

        let params = {
            _id: req.query.produtos[1]
        }
    
        let produto = await dm.getOne("produtos", params);
        produto = produtoGet(produto);

        res.status(200).json(produto);
        return;
    }

    if (req.method === 'POST' && req.query.produtos[0] === "frete") {

        /*res.setHeader('Access-Control-Allow-Credentials', true)
        res.setHeader('Access-Control-Allow-Origin', '*')
        // another common pattern
        // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
        res.setHeader(
            'Access-Control-Allow-Headers',
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
        )*/

        /*res.status(200).json({
            valor: "5,00",
            prazoEntrega: "4"
        });
        return;*/

        let correios = new Correios();

        console.log(req.body);

        //let result = {};

        correios.calcPrecoPrazo(req.body)
        .then(result => {

            let resposta = {
                valor: result[0].Valor,
                prazoEntrega: result[0].PrazoEntrega
            }

            if (resposta.valor != '0,00') 
            res.status(200).json(resposta);
            else 
            res.status(400);
        })
        .catch(error => {
            console.log(error);
        });
    }

    if (req.method === 'POST' && req.query.produtos[0] === "finalizarCompra") {

        //const session = await getSession({ req });
    
        if (session) {

            let usuario = await dm.getOne("usuarios", {email: session.user.email});
            let usuarioId = usuario._id.toString();
            delete usuario._id;

            let carrinho = req.body.carrinho;
            let frete = req.body.frete;
            let fretesSelecionados = req.body.fretesSelecionados;
            let total = req.body.total;
            let retirarNaLoja = req.body.retirarNaLoja;
            let produtos = [];
    
            if(
                typeof carrinho == "undefined" ||
                typeof frete == "undefined" ||
                typeof fretesSelecionados == "undefined" ||
                typeof total == "undefined" ||
                typeof retirarNaLoja == "undefined"
            ) {
                res.status(400).json({ code: 400 });
                return;
            }
    
            let params = {};
    
            for (let i = 0; i < carrinho.length; i++) {

                if (typeof carrinho[i].qtd == "undefined" || 
                carrinho[i].qtd == "" || carrinho[i].qtd == null || 
                isNaN(parseInt(carrinho[i].qtd))) carrinho[i].qtd = 1;
    
                params = {
                    _id: carrinho[i]._id
                }
    
                let produto = await dm.getOne("produtos", params);
                let quantidade = parseInt(carrinho[i].qtd);
    
                produto.quantidade -= quantidade;

                if (typeof produto.vendidos == "undefined") produto.vendidos = quantidade;
                else produto.vendidos += quantidade;
                
                await dm.putOne("produtos", produto);

                produto = produtoGet(produto);

                let precoFrete = 0;

                if (fretesSelecionados[i] == "pac") precoFrete = frete[i].pac.valor;
                if (fretesSelecionados[i] == "sedex") precoFrete = frete[i].sedex.valor;

                produtos.push({
                    nome: produto.nome,
                    quantidade: quantidade,
                    preco: produto.preco,
                    tipoFrete: fretesSelecionados[i],
                    precoFrete: precoFrete
                });
            }

            let compra = {
                produtos: produtos,
                usuario: usuario,
                usuarioId: usuarioId,
                total: total,
                retirarNaLoja: retirarNaLoja,
                statusPedido: "Aguardando Confirmação",
                dia: new Date()
            }
            
            await dm.postOne("compras", compra);
            res.status(200).json({ code: 200 });
        }
    }

    if (req.method === 'GET' && req.query.produtos[0] === "comprasSession") {

        if (session) {

            let usuario = await dm.getOne("usuarios", {email: session.user.email});
            let itensPage = parseInt(req.query.produtos[1]);
            let page = parseInt(req.query.produtos[2]);
            
            let params = {
                itensPage: itensPage,
                page: page
            };

            if (typeof req.query.produtos[3] != "undefined") {
    
                let isKey = true;
                let key = "";
    
                for (let i = 3; i < req.query.produtos.length; i++) {
    
                    if (isKey) {
                        key = req.query.produtos[i];
                    } else {
                        params[key] = req.query.produtos[i];
                        if(params[key] == 'true') params[key] = true;
                        if(params[key] == 'false') params[key] = false;
                    }
    
                    isKey = !isKey;
                }
            }
    
            const pages = await dm.getManyPagination("compras", params);
            if (!pages) { res.status(200).json({ pages: [], compras: [] }); return; }

            params.itensPage = itensPage;
    
            if ( typeof req.query.produtos[2] == "undefined") params.pageId = pages[0];
            else params.pageId = pages[page];
            
            params.usuarioId = usuario._id.toString();
    
            const compras = await dm.getMany("compras", params);
    
            res.status(200).json({ pages: pages, compras: compras });
            return;
        }
    }

    //admin
    
    if (session) {
        
        let usuario = await dm.getOne("usuarios", {email: session.user.email});

        if (!usuario.admin) return;

        if (req.method === 'GET' && req.query.produtos[0] === "compras") {

            let itensPage = parseInt(req.query.produtos[1]);
            let page = parseInt(req.query.produtos[2]);

            let params = {
                itensPage: itensPage,
                page: page
            };

            if (typeof req.query.produtos[3] != "undefined") {
    
                let isKey = true;
                let key = "";
    
                for (let i = 3; i < req.query.produtos.length; i++) {
    
                    if (isKey) {
                        key = req.query.produtos[i];
                    } else {
                        params[key] = req.query.produtos[i];
                        if(params[key] == 'true') params[key] = true;
                        if(params[key] == 'false') params[key] = false;
                    }
    
                    isKey = !isKey;
                }
            }
    
            const pages = await dm.getManyPagination("compras", params);
            if (!pages) { res.status(200).json({ pages: [], compras: [] }); return; }

            params.itensPage = itensPage;
    
            if ( typeof req.query.produtos[2] == "undefined") params.pageId = pages[0];
            else params.pageId = pages[page];
    
            const compras = await dm.getMany("compras", params);
    
            res.status(200).json({ pages: pages, compras: compras });
            return;
        }

        if(req.method === 'POST' && req.query.produtos[0] === "produto") {

            let p = produtoPost(req.body);

            dm.postOne("produtos", p);
            res.status(200).json({ color:"green", msg: 'Produto Cadastrado', code: 200 });

            return;
        }

        if(req.method === 'PUT' && req.query.produtos[0] === "produto") {

            let p = produtoPost(req.body);

            dm.putOne("produtos", p);
            res.status(200).json({ color:"green", msg: 'Produto Alterado', code: 200 });

            return;
        }

        if(req.method === 'PUT' && req.query.produtos[0] === "compras") {

            //let p = produtoPost(req.body);

            dm.putOne("compras", req.body);
            res.status(200).json({ color:"green", msg: 'Compra Alterada', code: 200 });

            return;
        }

        if(req.method === 'DELETE' && req.query.produtos[0] === "produto") {

            await dm.deleteOne("produtos", {_id: req.query.produtos[1]});
            res.status(200).json({ color:"green", msg: 'Produto Excluido', code: 200 });

            return;
        }

        if(req.method === 'DELETE' && req.query.produtos[0] === "compras") {

            await dm.deleteOne("compras", {_id: req.query.produtos[1]});
            res.status(200).json({ color:"green", msg: 'Compra Excluida', code: 200 });

            return;
        }
    }
}