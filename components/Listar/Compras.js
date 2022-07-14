
import { useState } from "react";
import { Row, Col, Tab, ListGroup, Button, InputGroup, FormControl, Form } from "react-bootstrap";
import { serverUrl } from '../../config';
import Pagination from '../Pagination/Pagination';

import { storeCompra, set, setEditar } from "../ReduxSlices/ComprasSlice";
import { storePainelAdmin } from "../ReduxSlices/PainelAdminSlice";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function Compras () {

    const [pages, setPages] = useState([]);
    const [compras, setCompras] = useState([]);
    const [comprasDetalhes, setComprasDetalhes] = useState([]);
    const [searchProp, setSearchProp] = useState("total");

    //const [pesquisaStr, setPesquisaStr] = useState("");

    const [didMount, setDidMount] = useState(false);

    const getCompras = async (page = 0) => {

        const res = await fetch(serverUrl + '/api/produtos/compras/10/' + page, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: "GET"
        });

        const result = await res.json();
 
        montarCompras(result.compras);
        setPages(result.pages);
    }

    if (!didMount) {

        setDidMount(true);
        getCompras();

        storeCompra.dispatch(set(getCompras));
    }

    /*const editarProduto = async (e) => {

        e.preventDefault();

        let val = e.target.id;

        storeProduto.dispatch(setEditar(val));
        storePainelAdmin.getState().displayCompsHandler({target: {name:"cadastrarProduto"}});
    }*/

    const excluirCompra = async (e) => {

        e.preventDefault();

        let val = e.target.id;

        const res = await fetch(serverUrl + '/api/produtos/compras/'+ val, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'DELETE'
        });

        const result = await res.json();
        getCompras();
    }

    const montarCompras = (compras, pesquisaStr = "") => {

        let temp1 = [];
        let temp2 = [];

        const pinkFloyd = (p) => {

            let prog = [];

            prog.push(
                <h3>Dados do Usuario</h3>,
                <p>email do usuario: {p.email}</p>,
                <p>cpf: {p.cpf}</p>,
                <p>celular: {p.celular}</p>,
                <p>cep: {p.cep}</p>,
                <p>endereco: {p.endereco}</p>,
                <p>numero: {p.numero}</p>,
                <p>complemento: {p.complemento}</p>,
                <p>bairro: {p.bairro}</p>,
                <p>cidade: {p.cidade}</p>,
                <p>estado: {p.estado}</p>
            );

            return prog;
        }

        const ramones = (p) => {

            let punk = [
                <h3>Produtos Comprados</h3>
            ];

            for (let i = 0; i < p.length; i++) {
                p[i];

                punk.push(
                <p>nome: {p[i].nome}</p>,
                <p>quantidade: {p[i].quantidade}</p>,
                <p>preço do produto: {p[i].preco}</p>,
                <p>tipo do frete: {p[i].tipoFrete}</p>,
                <p>preço do frete: {p[i].precoFrete}</p>,
                <hr/>
                );
                
            }

            return punk;
        }

        const convertDate = (inputFormat) => {
            const pad = (s) => { return (s < 10) ? '0' + s : s; }
            var d = new Date(inputFormat)
            return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
        }

        const enviarOuRetirarNaLoja = (retirarNaLoja) => {

            let fz = <option value="Enviado">Enviado</option>;

            if (retirarNaLoja)
            fz = <option value="Aguardando Retirada">Aguardando Retirada</option>;

            return fz;
        }

        

        for (let i = 0; i < compras.length; i++) {

            const mudarStatusPedido = async (e) => {
            
                e.preventDefault();
    
                let id = e.target.id;
                let val = e.target.value;

                compras[i].statusPedido = val;
    
                const res = await fetch(serverUrl + '/api/produtos/compras/'+ id, {
                    body: JSON.stringify(compras[i]),
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    method: 'PUT'
                });
    
                const result = await res.json();
                
                pesquisar({target:{value:pesquisaStr}});
            }


            temp1.push(
            <ListGroup.Item key={compras[i]._id} action href={"#"+ compras[i]._id} 
            onClick={(e)=>e.preventDefault()}>
                <p>email: {compras[i].usuario.email}</p>
                <p>total: R$ {compras[i].total}</p>
                <p>dia: {convertDate(compras[i].dia)}</p>
                <Form.Group>
                    <Form.Label>Status do Pedido</Form.Label>
                    <Form.Control as="select" name="statusPedido" id={compras[i]._id}
                    onChange={mudarStatusPedido} value={compras[i].statusPedido}>

                        <option value="Aguardando Confirmação">Aguardando Confirmação</option>
                        <option value="Confirmado">Confirmado</option>
                        {enviarOuRetirarNaLoja(compras[i].retirarNaLoja)}
                        <option value="Finalizado">Finalizado</option>
                    </Form.Control>
                </Form.Group>
            </ListGroup.Item>
            );

            temp2.push(
            <Tab.Pane key={compras[i]._id} eventKey={"#"+ compras[i]._id}>
                <Button variant="danger" id={compras[i]._id} onClick={excluirCompra}>Excluir</Button>
                <p>_id: {compras[i]._id}</p>
                {pinkFloyd(compras[i].usuario)}
                {ramones(compras[i].produtos)}
                <p>total: {compras[i].total}</p>
                <p>dia: {convertDate(compras[i].dia)}</p>
            </Tab.Pane>
            );
        }

        setCompras(temp1);
        setComprasDetalhes(temp2);
    }

    const pesquisar = async (e) => {

        let val = e.target.value;
        //setPesquisaStr(val);

        if (searchProp == "dia") {

            val = val.replace("/",".");
            val = val.replace("/",".");
        }

        const res = await fetch(serverUrl + '/api/produtos/compras/10/0/searchProp/'+ searchProp +'/search/' + val, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: "GET"
        });

        const result = await res.json();

        montarCompras(result.compras, val);
        setPages(result.pages);

        if (val == "") getCompras();
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
                        //value={pesquisaStr}
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

                        <option value="total">Total</option>
                        <option value="dia">Dia</option>
                        <option value="usuario.email">Email</option>
                        <option value="usuario.cpf">Cpf</option>
                        <option value="usuario.celular">Celular</option>
                        <option value="usuario.cep">Cep</option>
                        <option value="usuario.endereco">Endereco</option>
                        <option value="usuario.numero">Numero</option>
                        <option value="usuario.complemento">Complemento</option>
                        <option value="usuario.bairro">Bairro</option>
                        <option value="usuario.cidade">Cidade</option>
                        <option value="usuario.estado">Estado</option>
                    </Form.Control>
                </Form.Group>
            </Col>
        </Row>
        <Pagination {...{pages: pages, get: getCompras}} />
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
            <Row>
                <Col sm={4}>
                    <ListGroup>
                        {compras}
                    </ListGroup>
                </Col>
                <Col sm={8}>
                    <Tab.Content>
                        {comprasDetalhes}
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
        </>
    )
}