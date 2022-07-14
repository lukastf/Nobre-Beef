
import { useState, useCallback } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { signIn } from 'next-auth/client'

import styles from './styles.module.css'
import Link from 'next/link';
import { celularMask, cepMask, cpfMask, numberMask } from '../Utils/masks';
import { serverUrl } from '../../config';

import { storeUsuario, setEditar } from "../ReduxSlices/UsuarioSlice";

export default function Conta(props) {

    const [msg, setMsg] = useState("");
    const [color, setColor] = useState("");
    const [method, setMethod] = useState("POST");
    const [btnText, setBtnText] = useState("Cadastrar");
    const [checkDisabled, setCheckDisabled] = useState(true);

    const [didMount, setDidMount] = useState(false);

    const getContaSession = async () => {

        const res = await fetch(serverUrl + '/api/usuarios/usuarioSession', {
            headers: {
              'Content-Type': 'application/json'
            },
            method: "GET"
        });

        const result = await res.json();
        setInputs(result);
    }

    if (!didMount) {
        
        setDidMount(true);

        if (props.editar) {

            setBtnText("Alterar");

            setMethod("PUT");
            getContaSession();
        }
    }

    const getEnderecoBaseCep = async (cep) => {

        const res = await fetch('https://viacep.com.br/ws/'+cep+'/json/unicode/', {
            headers: {
              'Content-Type': 'application/json'
            },
            method: "GET"
        });

        const result = await res.json();
        
        setInputs(state => ({ ...state,
            estado: result.uf,
            cidade: result.localidade,
            bairro: result.bairro,
            endereco: result.logradouro
        }), []);

    }

    const [inputs,setInputs] = useState({});
    const onChangeHandler = useCallback(
        ({target:{name,value}}) => {

            if (name == "cpf") value = cpfMask(value)
            if (name == "celular") value = celularMask(value)
            if (name == "cep") value = cepMask(value)
            if (name == "numero") value = numberMask(value)
            if (name == "check") setCheckDisabled(!checkDisabled)

            setInputs(state => ({ ...state, [name]:value }), []);
            if (name == "cep" && value.length > 8) getEnderecoBaseCep(value);
        }
    );

    const criarOuAlterarConta = async event => {

        event.preventDefault();
        
        const res = await fetch(serverUrl + '/api/usuarios/usuario', {
          body: JSON.stringify(inputs),
          headers: {
            'Content-Type': 'application/json'
          },
          method: method
        });
    
        const result = await res.json();
        setMsg(result.msg);
        setColor(result.color);
        
        if (result.code == 200 && !props.editar && !props.admin /*&& !props.finalizarCompra*/) {
            signIn('credentials', { 
                email: event.target.email.value, 
                senha: event.target.senha.value 
            });
        }

        if (props.admin) {
            storeUsuario.getState().getUsuarios();
        }
        
        if (method == "POST") limparForm();
    }

    const getUsuarios = async (_id) => {
        
        const res = await fetch(serverUrl + '/api/usuarios/usuario/'+_id);

        const result = await res.json();
        setInputs(result);
    }

    const limparForm = () => {

        setInputs({
            _id: "",
            email: "",
            senha: "",
            repetirSenha: "",
            cpf: "",
            celular: "",
            cep: "",
            endereco: "",
            numero: "",
            complemento: "",
            bairro: "",
            cidade: "",
            estado: ""
        });

    }

    if (storeUsuario.getState().editar == "limpar") {

        limparForm();
        setMethod("POST");
        setBtnText("Cadastrar");

        storeUsuario.dispatch(setEditar(false));
    }

    if (storeUsuario.getState().editar) {

        setMethod("PUT");
        setBtnText("Alterar");

        getUsuarios(storeUsuario.getState().editar);
        storeUsuario.dispatch(setEditar(false));
    }

    return(
        <Form onSubmit={criarOuAlterarConta}>
            <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Email" name="email"
                onChange={onChangeHandler} value={inputs.email} />
            </Form.Group>

            <Form.Group controlId="senha">
                <Form.Label>Senha</Form.Label>
                <Form.Control type="password" placeholder="Senha" name="senha"
                onChange={onChangeHandler} value={inputs.senha} />
            </Form.Group>

            <Form.Group controlId="repetirSenha">
                <Form.Label>Repetir Senha</Form.Label>
                <Form.Control type="password" placeholder="Repetir Senha" name="repetirSenha"
                onChange={onChangeHandler} value={inputs.repetirSenha} />
            </Form.Group>

            <Form.Group controlId="cpf">
                <Form.Label>CPF</Form.Label>
                <Form.Control type="text" placeholder="CPF" name="cpf"
                onChange={onChangeHandler} value={inputs.cpf} />
            </Form.Group>

            <Row>
                <Col md="6">
                    <Form.Group controlId="celular">
                        <Form.Label>Celular com DDD</Form.Label>
                        <Form.Control type="text" placeholder="Celular com DDD" name="celular"
                        onChange={onChangeHandler} value={inputs.celular} />
                    </Form.Group>
                </Col>

                <Col md="6">
                    <Form.Group controlId="cep">
                        <Form.Label>CEP</Form.Label>
                        <Form.Control type="text" placeholder="Cep" name="cep"
                        onChange={onChangeHandler} value={inputs.cep} />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md="6">
                    <Form.Group controlId="endereco">
                        <Form.Label>Endereço</Form.Label>
                        <Form.Control type="text" placeholder="Endereço" name="endereco"
                        onChange={onChangeHandler} value={inputs.endereco} />
                    </Form.Group>
                </Col>
                <Col md="6">
                    <Form.Group controlId="numero">
                        <Form.Label>Numero</Form.Label>
                        <Form.Control type="text" placeholder="Numero" name="numero"
                        onChange={onChangeHandler} value={inputs.numero} />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md="6">
                    <Form.Group controlId="complemento">
                        <Form.Label>Complemento</Form.Label>
                        <Form.Control type="text" placeholder="Complemento" name="complemento"
                        onChange={onChangeHandler} value={inputs.complemento} />
                    </Form.Group>
                </Col>
                <Col md="6">
                    <Form.Group controlId="bairro">
                        <Form.Label>Bairro</Form.Label>
                        <Form.Control type="text" placeholder="Bairro" name="bairro"
                        onChange={onChangeHandler} value={inputs.bairro} />
                    </Form.Group>
                </Col>
            </Row>
            
            <Row>
                <Col md="6">
                    <Form.Group controlId="cidade">
                        <Form.Label>Cidade</Form.Label>
                        <Form.Control type="text" placeholder="Cidade" name="cidade"
                        onChange={onChangeHandler} value={inputs.cidade} />
                    </Form.Group>
                </Col>
                <Col md="6">
                    <Form.Group controlId="estado">
                        <Form.Label>Estado</Form.Label>
                        <Form.Control as="select" name="estado"
                        onChange={onChangeHandler} value={inputs.estado}>

                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <p style={{color: color}}>{msg}</p>
            </Row>

            <Form.Group controlId="check">
                    <Form.Check type="checkbox"  >
                        <Form.Check.Input type="checkbox" name="check"
                            onChange={onChangeHandler} /*value={inputs.check}*/ />
                        <Form.Check.Label>Aceito 
                            <Link href="/termos-de-uso-polica-privacidade">
                                <span className="btn-link"> Termos de Uso</span>
                            </Link>
                        </Form.Check.Label>
                    </Form.Check>
                    
            </Form.Group>

            <Button type="submit" className={styles.btn} variant="danger" disabled={checkDisabled}>
                {btnText}
            </Button>
        </Form>
    )
}