
import { useState } from "react";
import { Row, Col, Tab, ListGroup, Button, InputGroup, FormControl, Form } from "react-bootstrap";
import { serverUrl } from '../../config';
import Pagination from '../Pagination/Pagination';

import { storeUsuario, set, setEditar } from "../ReduxSlices/UsuarioSlice";
import { storePainelAdmin } from "../ReduxSlices/PainelAdminSlice";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export default function Usuarios () {

    const [pages, setPages] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosDetalhes, setUsuariosDetalhes] = useState([]);
    const [searchProp, setSearchProp] = useState("email");

    const [didMount, setDidMount] = useState(false);

    const getUsuarios = async (page = 0) => {

        const res = await fetch(serverUrl + '/api/usuarios/usuarios/10/' + page, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: "GET"
        });

        const result = await res.json();
        montarUsuarios(result.usuarios);
        setPages(result.pages);
    }

    if (!didMount) {

        setDidMount(true);
        getUsuarios();

        storeUsuario.dispatch(set(getUsuarios));
    }

    const editarUsuario = async (e) => {

        e.preventDefault();

        let val = e.target.id;

        //paro aquiii

        storeUsuario.dispatch(setEditar(val));
        storePainelAdmin.getState().displayCompsHandler({target: {name:"cadastrarUsuario"}});
    }

    const excluirUsuario = async (e) => {

        e.preventDefault();

        let val = e.target.id;

        const res = await fetch(serverUrl + '/api/usuarios/usuario/'+ val, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'DELETE'
        });

        const result = await res.json();
        getUsuarios();
    }

    const montarUsuarios = (usuarios) => {

        let temp1 = [];
        let temp2 = [];

        for (let i = 0; i < usuarios.length; i++) {

            temp1.push(
            <ListGroup.Item key={usuarios[i]._id} action href={"#"+ usuarios[i]._id} 
            onClick={(e)=>e.preventDefault()}>
                {usuarios[i].email}
            </ListGroup.Item>
            );

            temp2.push(
            <Tab.Pane key={usuarios[i]._id} eventKey={"#"+ usuarios[i]._id}>
                <Button variant="warning" id={usuarios[i]._id} onClick={editarUsuario}>Editar</Button>
                <Button variant="danger" id={usuarios[i]._id} onClick={excluirUsuario}>Excluir</Button>
                <p>_id: {usuarios[i]._id}</p>
                <p>email: {usuarios[i].email}</p>
                <p>cpf: {usuarios[i].cpf}</p>
                <p>celular: {usuarios[i].celular}</p>
                <p>cep: {usuarios[i].cep}</p>
                <p>endereco: {usuarios[i].endereco}</p>
                <p>numero: {usuarios[i].numero}</p>
                <p>complemento: {usuarios[i].complemento}</p>
                <p>bairro: {usuarios[i].bairro}</p>
                <p>cidade: {usuarios[i].cidade}</p>
                <p>estado: {usuarios[i].estado}</p>
            </Tab.Pane>
            );
        }

        setUsuarios(temp1);
        setUsuariosDetalhes(temp2);
    }

    const pesquisar = async (e) => {

        let val = e.target.value;

        const res = await fetch(serverUrl + '/api/usuarios/usuarios/10/0/searchProp/'+ searchProp +'/search/' + val, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: "GET"
        });

        const result = await res.json();

        montarUsuarios(result.usuarios);
        setPages(result.pages);

        if (val == "") getUsuarios();
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
                    {/*<DropdownButton
                        variant="outline-secondary"
                        title="Dropdown"
                        id="input-group-dropdown-2"
                        align="end"
                        >
                        <Dropdown.Item href="#">Action</Dropdown.Item>
                        <Dropdown.Item href="#">Another action</Dropdown.Item>
                        <Dropdown.Item href="#">Something else here</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item href="#">Separated link</Dropdown.Item>
                    </DropdownButton>*/}
                </InputGroup>
            </Col>
        </Row>
        <Row>
            <Col md="4">
                <Form.Group controlId="searchProp">
                    <Form.Label>Propriedade da Pesquisa</Form.Label>
                    <Form.Control as="select" name="searchProp"
                    onChange={mudarSearchProp} value={searchProp}>
                        <option value="email">Email</option>
                        <option value="cpf">Cpf</option>
                        <option value="celular">celular</option>
                        <option value="cep">Cep</option>
                        <option value="endereco">Endereco</option>
                        <option value="numero">Numero</option>
                        <option value="complemento">Complemento</option>
                        <option value="bairro">Bairro</option>
                        <option value="cidade">Cidade</option>
                        <option value="estado">Estado</option>
                    </Form.Control>
                </Form.Group>
            </Col>
        </Row>

        <Pagination {...{pages: pages, get: getUsuarios}} />
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
            <Row>
                <Col sm={4}>
                    <ListGroup>
                        {usuarios}
                    </ListGroup>
                </Col>
                <Col sm={8}>
                    <Tab.Content>
                        {usuariosDetalhes}
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
        </>
    )
}