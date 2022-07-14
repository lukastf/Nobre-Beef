
import styles from './PainelAdmin.module.css'
import { Button, Row, Col, Form } from 'react-bootstrap'
import { useState } from 'react'

import ListarUsuarios from '../Listar/Usuarios'
import ListarCategorias from '../Listar/Categorias'
import ListarProdutos from '../Listar/Produtos'
import ListarProdutosComprados from '../Listar/Compras'

import Conta from '../Forms/Conta'
import Categoria from '../Forms/Categoria'
import Produto from '../Forms/Produto'

import { storePainelAdmin, set } from "../ReduxSlices/PainelAdminSlice"
import { storeCategoria, setEditar as setEditarCategoria } from '../ReduxSlices/CategoriaSlice'
import { storeProduto, setEditar as setEditarProduto } from '../ReduxSlices/ProdutoSlice'
import { storeUsuario, setEditar as setEditarUsuario } from '../ReduxSlices/UsuarioSlice'

export default function PainelAdmin() {

    const [displayBtns, setDisplayBtns] = useState(["", "d-none", "d-none"]);
    const [displayComps, setDisplayComps] = useState(["", "d-none", "d-none", "d-none", "d-none", "d-none", "d-none"]);

    const displayBtnsHandler = (e) => {

        let name = e.target.name;
        //let d = [...displayBtns];
        let d = ["d-none", "d-none", "d-none"];

        if (name == "usuarios") {
            d[0] = [""];
            displayCompsHandler({target: {name:"listarUsuarios"}});
        }
        if (name == "produtos") {
            d[1] = [""];
            displayCompsHandler({target: {name:"listarProdutos"}});
        }
        if (name == "categorias") {
            d[2] = [""];
            displayCompsHandler({target: {name:"listarCategorias"}});
        }

        setDisplayBtns(d);
    }

    const displayCompsHandler = (e) => {

        let name = e.target.name;
        let d = ["d-none", "d-none", "d-none", "d-none", "d-none", "d-none", "d-none"];

        if (name == "listarUsuarios") d[0] = [""];
        if (name == "cadastrarUsuario") {
            d[1] = [""];
            if(!storeUsuario.getState().editar)
            storeUsuario.dispatch(setEditarUsuario("limpar"));
        }

        if (name == "listarProdutos") d[2] = [""];
        if (name == "cadastrarProduto") {
            d[3] = [""];
            if(!storeProduto.getState().editar)
            storeProduto.dispatch(setEditarProduto("limpar"));
        }
        if (name == "listarProdutosComprados") d[6] = [""];

        if (name == "listarCategorias") d[4] = [""];

        if (name == "cadastrarCategoria") {
            d[5] = [""];
            if(!storeCategoria.getState().editar)
            storeCategoria.dispatch(setEditarCategoria("limpar"));
        }

        setDisplayComps(d)
    }

    const [didMount, setDidMount] = useState(false);

    if (!didMount) {

        setDidMount(true);

        storePainelAdmin.dispatch(set(displayCompsHandler));
    }

    return(
        <>
        <Row className="justify-content-center">
            <Col xs="auto" className="my-5">
                <h1>
                    Painel do Admin
                </h1>
            </Col>
        </Row>
        <Row className="justify-content-center">
            <Col xs="4" md="auto">
                <Button type="button" className={styles.btn} variant="danger" 
                name="usuarios" onClick={displayBtnsHandler}>
                    Usuarios
                </Button>
            </Col>
            <Col xs="4" md="auto">
                <Button type="button" className={styles.btn} variant="danger" 
                name="produtos" onClick={displayBtnsHandler}>
                    Produtos
                </Button>
            </Col>
            <Col xs="4" md="auto">
                <Button type="button" className={styles.btn} variant="danger" 
                name="categorias" onClick={displayBtnsHandler}>
                    Categorias
                </Button>
            </Col>
        </Row>
        <Row className={"justify-content-center mt-3 "+ displayBtns[0]}>
            <Col xs="5" md="auto">
                <Button type="button" className={styles.btn} variant="danger"
                name="listarUsuarios" onClick={displayCompsHandler}>
                    Listar Usuarios
                </Button>
            </Col>
            <Col xs="5" md="auto">
                <Button type="button" className={styles.btn} variant="danger"
                name="cadastrarUsuario" onClick={displayCompsHandler}>
                    Cadastrar Usuario
                </Button>
            </Col>
        </Row>
        <Row className={"justify-content-center mt-3 " + displayBtns[1]}>
            <Col xs="4" md="auto">
                <Button type="button" className={styles.btn} variant="danger"
                name="listarProdutos" onClick={displayCompsHandler}>
                    Listar Produtos
                </Button>
            </Col>
            <Col xs="4" md="auto">
                <Button type="button" className={styles.btn} variant="danger"
                name="cadastrarProduto" onClick={displayCompsHandler}>
                    Cadastrar Produto
                </Button>
            </Col>
            <Col xs="4" md="auto">
                <Button type="button" className={styles.btn} variant="danger"
                name="listarProdutosComprados" onClick={displayCompsHandler}>
                    Listar Produtos Comprados
                </Button>
            </Col>
        </Row>
        <Row className={"justify-content-center mt-3 " + displayBtns[2]}>
            <Col xs="5" md="auto">
                <Button type="button" className={styles.btn} variant="danger"
                name="listarCategorias" onClick={displayCompsHandler}>
                    Listar Categorias
                </Button>
            </Col>
            <Col xs="5" md="auto">
                <Button type="button" className={styles.btn} variant="danger"
                name="cadastrarCategoria" onClick={displayCompsHandler}>
                    Cadastrar Categoria
                </Button>
            </Col>
        </Row>
        <Row className={"justify-content-center " + displayComps[0]}>
            <Col xs="10 my-5">
                <ListarUsuarios />
            </Col>
        </Row>
        <Row className={"justify-content-center " + displayComps[1]}>
            <Col xs="10 my-5"  md="6">
                <Conta {...{admin: true}} />
            </Col>
        </Row>
        <Row className={"justify-content-center " + displayComps[2]}>
            <Col xs="10 my-5">
                <ListarProdutos />
            </Col>
        </Row>
        <Row className={"justify-content-center " + displayComps[3]}>
            <Col xs="10 my-5"  md="6">
                <Produto />
            </Col>
        </Row>
        <Row className={"justify-content-center " + displayComps[4]}>
            <Col xs="10 my-5">
                <ListarCategorias />
            </Col>
        </Row>
        <Row className={"justify-content-center " + displayComps[5]}>
            <Col xs="10 my-5" md="6">
                <Categoria />
            </Col>
        </Row>
        <Row className={"justify-content-center " + displayComps[6]}>
            <Col xs="10 my-5">
                <ListarProdutosComprados />
            </Col>
        </Row>
        </>
    )
}