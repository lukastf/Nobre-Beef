
import { useState } from "react";
import { Row, Col, Tab, ListGroup, Button, InputGroup, FormControl, Form } from "react-bootstrap";
import { serverUrl } from '../../config';
import Pagination from '../Pagination/Pagination';

import { storeProduto, set, setEditar } from "../ReduxSlices/ProdutoSlice";
import { storePainelAdmin } from "../ReduxSlices/PainelAdminSlice";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function Produtos () {

    const [pages, setPages] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [produtosDetalhes, setProdutosDetalhes] = useState([]);
    const [searchProp, setSearchProp] = useState("nome");

    const [didMount, setDidMount] = useState(false);

    const getProdutos = async (page = 0) => {

        const res = await fetch(serverUrl + '/api/produtos/produtos/10/' + page, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: "GET"
        });

        const result = await res.json();
 
        montarProdutos(result.produtos);
        setPages(result.pages);
    }

    if (!didMount) {

        setDidMount(true);
        getProdutos();

        storeProduto.dispatch(set(getProdutos));
    }

    const editarProduto = async (e) => {

        e.preventDefault();

        let val = e.target.id;

        storeProduto.dispatch(setEditar(val));
        storePainelAdmin.getState().displayCompsHandler({target: {name:"cadastrarProduto"}});
    }

    const excluirProduto = async (e) => {

        e.preventDefault();

        let val = e.target.id;

        const res = await fetch(serverUrl + '/api/produtos/produto/'+ val, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'DELETE'
        });

        const result = await res.json();
        getProdutos();
    }

    const montarProdutos = (produtos) => {

        let temp1 = [];
        let temp2 = [];

        const produtoAcabando = (qtd) => {

            if (qtd < 1)
                return {backgroundColor: "red"}
            if (qtd < 10)
                return {backgroundColor: "yellow"}
            
            return {}
        }

        for (let i = 0; i < produtos.length; i++) {

            let style = produtoAcabando(produtos[i].quantidade);

            temp1.push(
            <ListGroup.Item key={produtos[i]._id} action href={"#"+ produtos[i]._id} style={style}
            onClick={(e)=>e.preventDefault()}>
                {produtos[i].nome}
            </ListGroup.Item>
            );

            let premium = "Não";
            if (produtos[i].premium) premium = "Sim";

            temp2.push(
            <Tab.Pane key={produtos[i]._id} eventKey={"#"+ produtos[i]._id}>
                <Button variant="warning" id={produtos[i]._id} onClick={editarProduto}>Editar</Button>
                <Button variant="danger" id={produtos[i]._id} onClick={excluirProduto}>Excluir</Button>
                <p>_id: {produtos[i]._id}</p>
                <p>nome: {produtos[i].nome}</p>
                <p>preço: {produtos[i].preco}</p>
                <p>quantidade: {produtos[i].quantidade}</p>
                <p>categoria: {produtos[i].categoria}</p>
                <p>comprimento: {produtos[i].comprimento}</p>
                <p>largura: {produtos[i].largura}</p>
                <p>altura: {produtos[i].altura}</p>
                <p>peso: {produtos[i].peso}</p>
                <p>diametro: {produtos[i].diametro}</p>
                <p>formato: {produtos[i].formato}</p>
                <p>descricao: {produtos[i].descricao}</p>
                <p>premium: {premium}</p>
            </Tab.Pane>
            );
        }

        setProdutos(temp1);
        setProdutosDetalhes(temp2);
    }

    const pesquisar = async (e) => {

        let val = e.target.value;

        const res = await fetch(serverUrl + '/api/produtos/produtos/10/0/searchProp/'+ searchProp +'/search/' + val, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: "GET"
        });

        const result = await res.json();

        montarProdutos(result.produtos);
        setPages(result.pages);

        if (val == "") getProdutos();
    }

    const mudarSearchProp = (e) => {

        let val = e.target.value;

        setSearchProp(val);
    }

    return(
        <>
        <Row>
            <Col xs="12" md="4">
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="O que você procura?"
                        aria-label="O que você procura?"
                        aria-describedby="basic-addon2"
                        onChange={pesquisar}
                    />
                    <InputGroup.Append>
                        <Button variant="light"><FontAwesomeIcon icon={faSearch} /></Button>
                    </InputGroup.Append>
                </InputGroup>
            </Col>
        </Row>
        <Row>
            <Col md="4">
                <Form.Group controlId="searchProp">
                    <Form.Label>Propriedade da Pesquisa</Form.Label>
                    <Form.Control as="select" name="searchProp"
                    onChange={mudarSearchProp} value={searchProp}>

                        <option value="nome">Nome</option>
                        <option value="preco">Preço</option>
                        <option value="quantidade">Quantidade</option>
                        <option value="categoria">Categoria</option>
                        <option value="comprimento">Comprimento</option>
                        <option value="largura">Largura</option>
                        <option value="altura">Altura</option>
                        <option value="peso">Peso</option>
                        <option value="diametro">Diametro</option>
                        <option value="formato">Formato</option>
                        <option value="descricao">Descricao</option>
                    </Form.Control>
                </Form.Group>
            </Col>
        </Row>
        <Pagination {...{pages: pages, get: getProdutos}} />
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
            <Row>
                <Col sm={4}>
                    <ListGroup>
                        {produtos}
                    </ListGroup>
                </Col>
                <Col sm={8}>
                    <Tab.Content>
                        {produtosDetalhes}
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
        </>
    )
}