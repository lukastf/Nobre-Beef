
import { useState } from "react";
import { Row, Col, Tab, ListGroup, Button, InputGroup, FormControl, Form } from "react-bootstrap";
//import { serverUrl } from '../../config' ;
import { serverUrl } from '../../config';
import Pagination from '../Pagination/Pagination';

import { storeCategoria, set, setEditar } from "../ReduxSlices/CategoriaSlice";
import { storePainelAdmin } from "../ReduxSlices/PainelAdminSlice";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function Categorias () {

    const [pages, setPages] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriasDetalhes, setCategoriasDetalhes] = useState([]);
    const [searchProp, setSearchProp] = useState("nome");

    const [didMount, setDidMount] = useState(false);

    const getCategorias = async (page = 0) => {

        const res = await fetch(serverUrl + '/api/categorias/categoriasPages/10/' + page, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'GET'
        });

        const result = await res.json();

        montarCategorias(result.categorias);
        setPages(result.pages);
    }

    const editarCategoria = async (e) => {

        e.preventDefault();

        let val = e.target.id;

        storeCategoria.dispatch(setEditar(val));
        storePainelAdmin.getState().displayCompsHandler({target: {name:"cadastrarCategoria"}});
    }

    const excluirCategoria = async (e) => {

        e.preventDefault();

        let val = e.target.id;

        const res = await fetch(serverUrl + '/api/categorias/categoria/'+ val, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'DELETE'
        });

        const result = await res.json();
        getCategorias();
    }

    

    if (!didMount) {

        setDidMount(true);
        getCategorias();

        //store.dispatch(setCategorias(getCategorias))
        storeCategoria.dispatch(set(getCategorias));
    }

    const montarCategorias = (categorias) => {

        let temp1 = [];
        let temp2 = [];

        for (let i = 0; i < categorias.length; i++) {

            temp1.push(
            <ListGroup.Item key={categorias[i]._id} action href={"#"+ categorias[i]._id} onClick={(e)=>e.preventDefault()}>
                {categorias[i].nome}
            </ListGroup.Item>
            );

            temp2.push(
            <Tab.Pane key={categorias[i]._id} eventKey={"#"+ categorias[i]._id}>
                <Button variant="warning" id={categorias[i]._id} onClick={editarCategoria}>Editar</Button>
                <Button variant="danger" id={categorias[i]._id} onClick={excluirCategoria}>Excluir</Button>
                <p>_id: {categorias[i]._id}</p>
                <p>nome: {categorias[i].nome}</p>
            </Tab.Pane>
            );
        }

        setCategorias(temp1);
        setCategoriasDetalhes(temp2);
    }

    const pesquisar = async (e) => {

        let val = e.target.value;

        const res = await fetch(serverUrl + '/api/categorias/categoriasPages/10/0/searchProp/'+ searchProp +'/search/' + val, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: "GET"
        });

        const result = await res.json();

        montarCategorias(result.categorias);
        setPages(result.pages);

        if (val == "") getCategorias();
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
                    </Form.Control>
                </Form.Group>
            </Col>
        </Row>
        <Pagination {...{pages: pages, get: getCategorias}} />
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
            <Row>
                <Col sm={4}>
                    <ListGroup>
                        {categorias}
                    </ListGroup>
                </Col>
                <Col sm={8}>
                    <Tab.Content>
                        {categoriasDetalhes}
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
        </>
    )
}