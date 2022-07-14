
import styles from './styles.module.css'
import { Button, Row, Col, Form } from 'react-bootstrap'
import { useState } from 'react'

import { storeCategoria, setEditar } from "../ReduxSlices/CategoriaSlice";
import { serverUrl } from '../../config';

export default function Categoria() {
    
    const [_id, setId] = useState("");
    const [nome, setNome] = useState("");

    const [method, setMethod] = useState("POST");
    const [btnText, setBtnText] = useState("Cadastrar Categoria");

    const [msg, setMsg] = useState("");
    const [color, setColor] = useState("");

    const changeNome = (e) => {
        setNome(e.target.value);
    }

    const limparForm = () => {

        setId("");
        setNome("");
    }

    const enviar = async (e) => {

        e.preventDefault();

        let obj = {
            _id: _id,
            nome: nome
        }

        const res = await fetch('/api/categorias/categoria/'+_id, {
            body: JSON.stringify(obj),
            headers: {
              'Content-Type': 'application/json'
            },
            method: method
        });
      
        const result = await res.json();
        setMsg(result.msg);
        setColor(result.color);

        storeCategoria.getState().getCategorias();
        if (method == "POST") limparForm();
    }

    const getCategorias = async (_id) => {
        
        const res = await fetch(serverUrl + '/api/categorias/categoria/'+_id);

        const result = await res.json();
        setId(result._id);
        setNome(result.nome);
    }

    if (storeCategoria.getState().editar == "limpar") {

        limparForm();
        setMsg("");
        setMethod("POST");
        setBtnText("Cadastrar Categoria");

        storeCategoria.dispatch(setEditar(false));
    }

    if (storeCategoria.getState().editar) {

        setMethod("PUT");
        setBtnText("Editar Categoria");

        getCategorias(storeCategoria.getState().editar);
        storeCategoria.dispatch(setEditar(false));
    }

    return(
    <Form onSubmit={enviar}>
        <Form.Group controlId="nome">
            <Form.Label>Nome</Form.Label>
            <Form.Control type="text" placeholder="Nome" name="nome"
            onChange={changeNome} value={nome} />
        </Form.Group>

        <Button type="submit" className={styles.btn} variant="danger">
            {btnText}
        </Button>
        <p style={{color: color}}>{msg}</p>
    </Form>
    )

}