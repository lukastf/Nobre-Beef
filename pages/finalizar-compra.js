
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
//import PaymentCard from 'react-payment-card-component';
import {storeCarrinho, set, setTotalCompra} from '../components/ReduxSlices/CarrinhoSlice';
import { Col, Row, Container, Image, Form, Button } from 'react-bootstrap';
import styles from './finalizar-compra.module.css';

import { useSession } from 'next-auth/client';
import Conta from '../components/Forms/Conta';
import { useState } from 'react';
import { dataMask, numberMask } from '../components/Utils/masks';
import { serverUrl } from '../config';

export default function FNC () {

    const [ session, loading ] = useSession();

    if (!session) return (
        <>
        <Navbar />
        <Container fluid>
            <Row className="justify-content-center mt-5">
                <Col xs="auto">
                    <Conta /*{...{finalizarCompra: true}}*/ />
                </Col>
            </Row>
        </Container>
        <Footer />
        </>
    );

    if (typeof localStorage.total == "undefined" || localStorage.total == 0) return(
        <>
        <Navbar />
        <Container fluid>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <h1 className="mt-5">Compra Invalida passe pelo "meu carrinho" primeiro</h1>
                </Col>
            </Row>
        </Container>
        <Footer />
        </>
    );

    //storeCarrinho.dispatch(setTotalCompra(total));

    const [nomeCartao, setNomeCartao] = useState("");
    const [numeroCartao, setNumeroCartao] = useState("");
    const [validade, setValidade] = useState("");
    const [codSeguranca, setCodSeguranca] = useState("");

    const [returnScreen, setReturnScreen] = useState(0);

    const changeNomeCartao = (e) => {

        let nome = e.target.value;
        setNomeCartao(nome);
    }

    const changeNumeroCartao = (e) => {

        let numero = numberMask(e.target.value);
        setNumeroCartao(numero);
    }

    const changeValidade = (e) => {

        let validade = dataMask(e.target.value);
        setValidade(validade);
    }

    const changeCodSeguranca = (e) => {

        let codSeguranca = numberMask(e.target.value);
        setCodSeguranca(codSeguranca);
    }

    const finalizar = () => {

        let obj = {
            nomeCartao: nomeCartao,
            numeroCartao: numeroCartao,
            validade: validade,
            codSeguranca: codSeguranca
        }

        setReturnScreen(1);

        //console.log(obj);
    }

    const [didMount, setDidMount] = useState(false);
    const [produtos, setProdutos] = useState([]);
    const [carrinho, setCarrinho] = useState([]);
    const [frete, setFrete] = useState([]);
    const [fretesSelecionados, setFretesSelecionados] = useState([]);
    const [total, setTotal] = useState([]);
    const [retirarNaLoja, setRetirarNaLoja] = useState(false);

    const [renderProdutos, setRenderProdutos] = useState([]);

    const getProdutos = async () => {
    
        let carrinho = [...storeCarrinho.getState().carrinho];
        let carrinhoStored = [];

        if (typeof localStorage.carrinho != "undefined") carrinhoStored = JSON.parse(localStorage.carrinho);

        if (carrinho.length != carrinhoStored.length)
            carrinho = carrinhoStored;

        let temp = [];

        for (let i = 0; i < carrinho.length; i++) {
            
            const p = await fetch(serverUrl + "/api/produtos/produto/"+ carrinho[i]._id);
            let produto = await p.json();
            //produto.quantidade = carrinho[i].qtd;
            temp.push(produto);
        }

        setProdutos(temp);
        setCarrinho(carrinho);

        //renderTotal(temp, carrinho);
        //setPages(result.pages);
        
        let frete = JSON.parse(localStorage.frete);
        let fretesSelecionados = JSON.parse(localStorage.fretesSelecionados);
        let total = JSON.parse(localStorage.total);
        let retirarNaLoja = JSON.parse(localStorage.retirarNaLoja);
        
        setFrete(frete);
        setFretesSelecionados(fretesSelecionados);
        setTotal(total);
        setRetirarNaLoja(retirarNaLoja);

        renderProdutosFunc(temp, carrinho, frete, fretesSelecionados, total, retirarNaLoja);
    }

    const renderProdutosFunc = (produtos, carrinho, frete, fretesSelecionados, total, retirarNaLoja) => {

        const getFrete = (a, b) => {

            let valor = 0;
            let tipo = "";

            if (b == "pac") {
                valor = a.pac.valor;
                tipo = "PAC"
            }
            if (b == "sedex") {
                valor = a.sedex.valor;
                tipo = "SEDEX";
            }

            return valor + " " + tipo;
        }

        let temp = [];

        for (let i = 0; i < carrinho.length; i++) {
           carrinho[i];

           temp.push(<p>{produtos[i].nome} - x {carrinho[i].qtd} - frete 
           {getFrete(frete[i], fretesSelecionados[i])} </p>);
            
        }

        temp.push(<h3>Total: R$ {total}</h3>);

        //console.log(retirarNaLoja)

        let fz = <p>Voçe escolheu entregar o(s) produto(s) no cep </p>;
        if (retirarNaLoja) fz = <p>Voçe escolheu retirar o(s) produto(s) na loja </p>;

        temp.push(fz);

        setRenderProdutos(temp);

    }

    const confirmar = async () => {


        let obj = {
            carrinho: carrinho,
            frete: frete,
            fretesSelecionados: fretesSelecionados,
            total: total,
            retirarNaLoja: retirarNaLoja
        }

        //console.log(obj);

        const res = await fetch(serverUrl + '/api/produtos/finalizarCompra', {
            body: JSON.stringify(obj),
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'POST'
        });

        const result = await res.json();
        if (result.code == 200) setReturnScreen(2);
        if (result.code == 400) setReturnScreen(3);

        storeCarrinho.dispatch(set([]));
        storeCarrinho.dispatch(setTotalCompra(0));
        localStorage.carrinho = JSON.stringify([]);
        localStorage.frete = JSON.stringify([]);
        localStorage.fretesSelecionados = JSON.stringify([]);
        localStorage.total = 0;
        localStorage.retirarNaLoja = JSON.stringify(false);
    }

    if (!didMount) {

        if (typeof window !== 'undefined') {
            
            setDidMount(true);
            getProdutos();
        }
    }

    if (returnScreen == 0) {

        return(
            <>
            <Navbar />
            <Container fluid>
                <Row className="justify-content-center">
                    <Col xs="auto">
                        <Image src="logo.png" className={styles.logo} fluid />
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs="auto">
                        <h1 /*className={styles.h1}*/>Finalizar Compra</h1>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs="auto">
    
                        <Form.Group controlId="nomeCartao">
                            <Form.Label>Nome no Cartão</Form.Label>
                            <Form.Control type="text" placeholder="Nome no Cartão" name="nomeCartao"
                            onChange={changeNomeCartao} value={nomeCartao} />
                        </Form.Group>
    
                        <Form.Group controlId="numeroCartao">
                            <Form.Label>Numero do Cartão</Form.Label>
                            <Form.Control type="text" placeholder="Numero do Cartão" name="numeroCartao"
                            onChange={changeNumeroCartao} value={numeroCartao} />
                        </Form.Group>
    
                        <Form.Group controlId="validade">
                            <Form.Label>Validade</Form.Label>
                            <Form.Control type="text" placeholder="Validade" name="validade"
                            onChange={changeValidade} value={validade} maxLength="5" />
                        </Form.Group>
    
                        <Form.Group controlId="codSeguranca">
                            <Form.Label>Cod Segurança</Form.Label>
                            <Form.Control type="password" placeholder="Cod segurança" name="codSeguranca"
                            onChange={changeCodSeguranca} value={codSeguranca} />
                        </Form.Group>
    
                        <Button className={styles.btn} variant="danger" onClick={finalizar} > 
                            {/*<FontAwesomeIcon icon={faShoppingBasket} />*/} Enviar
                        </Button>
    
                    </Col>
                </Row>
            </Container>
            <Footer />
            </>
        )
    } else if(returnScreen == 1) {
    
        return(
            <>
            <Navbar />
            <Container fluid>
                <Row className="justify-content-center">
                    <Col xs="auto">
                        <Image src="logo.png" className={styles.logo} fluid />
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs="auto">
                        <h1 /*className={styles.h1}*/>Finalizar Compra</h1>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs="auto">
                        {renderProdutos}
                    </Col>
                    <Col xs="auto">
                        <Button className={styles.btn} variant="danger" onClick={confirmar} > 
                            Confirmar
                        </Button>
                    </Col>
                </Row>
            </Container>
            <Footer />
            </>
        );

    } else if(returnScreen == 2) {
    
        return(
            <>
            <Navbar />
            <Container fluid>
                <Row className="justify-content-center">
                    <Col xs="auto">
                        <Image src="logo.png" className={styles.logo} fluid />
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs="auto">
                        <h1 /*className={styles.h1}*/>Finalizar Compra</h1>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs="auto">
                        <h1 className="mt-5">Compra Finalizada com Sucesso</h1>
                    </Col>
                </Row>
            </Container>
            <Footer />
            </>
        );
    } else if(returnScreen == 3) {
    
        return(
            <>
            <Navbar />
            <Container fluid>
                <Row className="justify-content-center">
                    <Col xs="auto">
                        <Image src="logo.png" className={styles.logo} fluid />
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs="auto">
                        <h1 /*className={styles.h1}*/>Finalizar Compra</h1>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs="auto">
                        <h1 className="mt-5">Falha ao concluir compra</h1>
                    </Col>
                </Row>
            </Container>
            <Footer />
            </>
        );
    }

}