
import { Col, Container, Image, Row, Button, Form, InputGroup, FormControl } from "react-bootstrap";
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
//import Pagination from '../components/Pagination/Pagination';
import {storeCarrinho, set, setTotalCompra} from '../components/ReduxSlices/CarrinhoSlice';
import { useState } from 'react';
import { serverUrl } from '../config';
import styles from './meu-carrinho.module.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket, faMoneyBill } from '@fortawesome/free-solid-svg-icons';

import { cepMask, numberMask } from '../components/Utils/masks';
import Link from "next/link";


const calcularFrete = async (cepDestino, produto) => {

    //if (typeof cepDestino == "undefined" || cepDestino == null) return;

    const res = await fetch(serverUrl + "/api/usuarios/adminCep");
    const adminCep = await res.json();

    const converter = (v) => {
        v = String(v);
        if (v.includes(",")) v = v.replace(",", ".");
        v = parseFloat(v);
        return v;
    }

    let args = {
        //Pac a vista 04510
        //Sedex a vista 04014
        //nCdServico: '04014,04065,04510,04707,40169,40215,40290',
        nCdServico: '04510',
        //sCepOrigem: context.parceiro.cep.replace("-", ""),
        sCepOrigem: adminCep.cep.replace("-", ""),
        sCepDestino: cepDestino.replace("-", ""),
        nVlPeso: converter(produto.peso),
        nCdFormato : converter(produto.formato),
        nVlComprimento: converter(produto.comprimento),
        nVlAltura: converter(produto.altura),
        nVlLargura: converter(produto.largura),
        nVlDiametro: converter(produto.diametro),
        //nVlValorDeclarado  : context.produto.valorNum,
        /*nCdEmpresa         : '',
        sDsSenha           : '',
        sCdMaoPropria      : 'N',
        sCdAvisoRecebimento: 'N'*/
    }

    /*if (context.produto.tipoTamanho === "Metros") {
        
        args.nVlComprimento = args.nVlComprimento * 100;
        args.nVlAltura = args.nVlAltura * 100;
        args.nVlLargura = args.nVlLargura * 100;
        args.nVlDiametro = args.nVlDiametro * 100;
    }*/

    //console.log(args);

    //console.log(context.parceiro.cep);
    //console.log(context.usuario.cep);
    //console.log(args);

    //context.setFretePac("100,50");
    //context.setFreteSedex("170,00");
    //return;

    //console.log(args);

    const res2 = await fetch(serverUrl+"/api/produtos/frete", {
        body: JSON.stringify(args),
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST"
    });

    const fretePac = await res2.json();
    //correios.calcPreco(args)
    
    /*.then(result => {
        context.setFretePac(result.data);
    })
    .catch(error => {
        console.log(error);
    });*/

    let args2 = args;
    args2.nCdServico = '04014';

    const res3 = await fetch(serverUrl+"/api/produtos/frete", {
        body: JSON.stringify(args2),
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST"
    });

    const freteSedex = await res3.json();

    return {
        pac: fretePac,
        sedex: freteSedex
    }

    /*.then(result => {
        context.setFreteSedex(result.data);
    })
    .catch(error => {
        console.log(error);
    });*/
}


export default function meuCarrinho () {

    const [renderProdutos, setRenderProdutos] = useState([]);
    const [total, setTotal] = useState(0);
    const [didMount, setDidMount] = useState(false);
    const [conta, setConta] = useState({});
    const [cepDestino, setCepDestino] = useState("");
    //const [pages, setPages] = useState([]);

    const [produtos, setProdutos] = useState([]);
    const [carrinho, setCarrinho] = useState([]);

    const [btnFinalizarCompra, setBtnFinalizarCompra] = useState([]);
    const [fretesSelecionados, setFretesSelecionados] = useState([]);

    const [travarFreteBtn, setTravarFreteBtn] = useState(false);

    const getProdutos = async (page = 0) => {

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

        renderProdutosFunc(temp, 0, carrinho);
        renderTotal(temp, carrinho);
        //setPages(result.pages);
    }

    const renderProdutosFunc = async (produtos, displayIndex, carrinho, frete = [], fretesSelecionados = []) => {

        let mudarImgtriGatilho = false;
        //let carrinho = [...storeCarrinho.getState().carrinho];

        const mudarImagem = (e) => {

            if (produtos.length < 1) return;
            if (mudarImgtriGatilho) return;
            mudarImgtriGatilho = true;
    
            let val = parseInt(e.target.id);
            
            renderProdutosFunc(produtos, val, carrinho, frete, fretesSelecionados);
        }

        const changeQtd = (e) => {

            //carrinho = [...storeCarrinho.getState().carrinho];
            carrinho = [...carrinho];

            let _id = e.target.id;
            let val = parseInt(numberMask(e.target.value));

            if (isNaN(val)) val = "";

            for (let i = 0; i < carrinho.length; i++) {
                
                if (carrinho[i]._id == _id) {

                    if (val > produtos[i].quantidade) val = produtos[i].quantidade;

                    carrinho[i] = {
                        _id: carrinho[i]._id,
                        qtd: val
                    };
                    //qtd[i] = val;
                }
            }
        
            storeCarrinho.dispatch(set(carrinho));
            localStorage.carrinho = JSON.stringify(carrinho);

            setCarrinho(carrinho);

            renderProdutosFunc(produtos, displayIndex, carrinho, frete, fretesSelecionados);
            renderTotal(produtos, carrinho, frete, fretesSelecionados);
        }

        const remove = (e) => {

            carrinho = [...carrinho];

            let _id = e.target.id;

            console.log(carrinho);
        
            for (let i = 0; i < carrinho.length; i++) {
                
                if (carrinho[i]._id == _id)  carrinho.splice(i, 1);
            }
        
            storeCarrinho.dispatch(set(carrinho));
            localStorage.carrinho = JSON.stringify(carrinho);
        
            //renderProdutosFunc(produtos, displayIndex, carrinho);
            getProdutos();
        }

        const getFrete = (i) => {

            if (typeof frete[i] == "undefined") return;

            if (cepDestino.length < 5) return;
            

            const changeFrete = (val) => {

                let f = [...fretesSelecionados];
                f[i] = val;

                renderProdutosFunc(produtos, displayIndex, carrinho, frete, f);
                renderTotal(produtos, carrinho, frete, f);

                setFretesSelecionados(f);

                for (let i = 0; i < carrinho.length; i++) {

                    if(typeof f[i] == "undefined") return;
                    
                }

                localStorage.frete = JSON.stringify(frete);
                localStorage.fretesSelecionados = JSON.stringify(f);

                setBtnFinalizarCompra(
                    <Row className="justify-content-end">
                        <Col xs="auto">
                            <Link href="/finalizar-compra">
                                <Button variant="success" /*onClick={remove} id={produtos[i]._id}*/> 
                                    <FontAwesomeIcon icon={faMoneyBill} /> Finalizar Compra
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                );
            }

            const changeFretePac = (e) => {
                
                changeFrete("pac");
            }

            const changeFreteSedex = (e) => {

                changeFrete("sedex");
            }

            return(
            <Form.Group>
                <Form.Label className="mr-2">Frete</Form.Label>
                <Form.Check onClick={changeFretePac} inline label="PAC" name={"frete"+i} type="radio" id={"pac"+i} />
                <Form.Check onClick={changeFreteSedex} inline label="SEDEX" name={"frete"+i} type="radio" id={"sedex"+i} />
                <p>PAC R$ {frete[i].pac.valor} em {frete[i].pac.prazoEntrega} dias uteis</p>
                <p>SEDEX R$ {frete[i].sedex.valor} em {frete[i].sedex.prazoEntrega} dias uteis</p>
            </Form.Group>
            )
        }

        const getSrc = (imgs, links) => {

            let link1Usado = false;

            let src = [];

            src[0] = "/imgsProdutos/"+imgs[0];
            src[1] = "/imgsProdutos/"+imgs[1];

            if (typeof imgs == "undefined" || imgs == null) {

                if (typeof links != "undefined" && links != null){

                    src[0] = links[0];
                    link1Usado = true;
                }
                //else
                    //src1 =  
            }

            if (typeof imgs == "undefined" || imgs == null || typeof imgs[1] == "undefined" || imgs[1] == null) {

                if (typeof links != "undefined" && links != null) {

                    if (!link1Usado) src[1] = links[0];
                    else {

                        if (typeof links != "undefined" && links != null)
                        src[1] = links[1];
                    }
                }
                //else
                    //src1 =  
            }

            return src;
        }

        let temp = [];
        let tempDisplayImg1 = [];
        let tempDisplayImg2 = [];

        for (let i = 0; i < produtos.length; i++) {

            if(displayIndex == i){
                tempDisplayImg1.push("d-none");
                tempDisplayImg2.push("");
            } else {
                tempDisplayImg1.push("");
                tempDisplayImg2.push("d-none");
            }
            
            //qtd[i] = carrinho[i].qtd;

            let src = getSrc(produtos[i].imagens, produtos[i].linksExterno);

            temp.push(
            <Col xs="6" md="3" className={styles.produto}>
                <Image onMouseEnter={mudarImagem} onMouseLeave={mudarImagem} 
                id={i} className={tempDisplayImg1[i]} src={src[0]} fluid />
                <Image onMouseEnter={mudarImagem} onMouseLeave={mudarImagem} 
                /*id={i}*/ className={tempDisplayImg2[i]} src={src[1]} fluid />
                <h3>{produtos[i].nome}</h3>
                <p>{produtos[i].descricao}</p>
                <h3>R$ {produtos[i].preco}</h3>
                <Form.Group>
                    <Form.Label>Quantidade:</Form.Label>
                    <Form.Control type="text" placeholder="Quantidade" name="quantidade"
                    id={produtos[i]._id}
                    onChange={changeQtd} value={carrinho[i].qtd} />
                </Form.Group>
                {getFrete(i)}
                <Button variant="success" onClick={remove} id={produtos[i]._id}> 
                    <FontAwesomeIcon icon={faShoppingBasket} /> Remover
                </Button>
            </Col>
            );
        }

        mudarImgtriGatilho = false;
        setRenderProdutos(temp);
    }

    const renderTotal = (produtos, carrinho, frete = [], fretesSelecionados = []) => {

        let total = 0;

        for (let i = 0; i < carrinho.length; i++) {

            let preco = parseFloat(produtos[i].preco.replace(",", "."));
            preco = preco * carrinho[i].qtd;

            if (fretesSelecionados[i] == "pac") 
                preco = preco + parseFloat(frete[i].pac.valor.replace(",", ".")) * carrinho[i].qtd;

            if (fretesSelecionados[i] == "sedex") 
                preco = preco + parseFloat(frete[i].sedex.valor.replace(",", ".")) * carrinho[i].qtd;

            total += preco;
        }

        total = total.toFixed(2);

        total = total.toString();
        total = total.replace(".", ",");

        setTotal(total);

        //checa se todos os fretes foram selecionados

        for (let i = 0; i < carrinho.length; i++) {

            if(typeof fretesSelecionados[i] == "undefined") return;
            
        }

        storeCarrinho.dispatch(setTotalCompra(total));
        localStorage.total = JSON.stringify(total);
    }

    const getCepDestino = async () => {

        const res = await fetch(serverUrl+"/api/usuarios/usuarioSession");
        const result = await res.json();

        if (result) {
            setConta(result);
            setCepDestino(result.cep);
        }

    }

    const changeCepDestino = (e) => {

        let val = cepMask(e.target.value);
        setCepDestino(val);
        setTravarFreteBtn(false);
    }

    const calcularFreteBtn = async () => {

        if (travarFreteBtn) return;
        if (typeof cepDestino == "undefined" || cepDestino == null) return;

        if (
            typeof cepDestino == "undefined" ||
            cepDestino == null || 
            cepDestino.length < 5 ||
            cepDestino == ""
        ) {

            setBtnFinalizarCompra(
                <Row className="justify-content-end">
                    <Col xs="auto">
                        <h5 style={{color: "red"}}>Cep Invalido</h5>
                    </Col>
                </Row>
            );

            renderProdutosFunc(produtos, 0, carrinho);
            return;
        }

        if (carrinho.length < 1) {

            setBtnFinalizarCompra(
                <Row className="justify-content-end">
                    <Col xs="auto">
                        <h5 style={{color: "red"}}>Carrinho Vazio</h5>
                    </Col>
                </Row>
            );
            return;
        }

        if (
            cepDestino[0] != 1 ||
            cepDestino[1] != 5
        ) {

            setBtnFinalizarCompra(
                <Row className="justify-content-end">
                    <Col xs="auto">
                        <h5 style={{color: "red"}}>Ainda não atendemos essa região</h5>
                    </Col>
                </Row>
            );

            renderProdutosFunc(produtos, 0, carrinho);
            return;
        }

        let frete = [];

        for (let i = 0; i < carrinho.length; i++) {

            let f = await calcularFrete(cepDestino, produtos[i]);
            //carrinho[i].qtd
            frete.push(f);
        }

        setBtnFinalizarCompra(
            <Row className="justify-content-end">
                <Col xs="auto">
                    <h5>Selecione o Tipo de frete abaixo dos produtos, PAC ou SEDEX</h5>
                </Col>
            </Row>
        );
        renderProdutosFunc(produtos, 0, carrinho, frete, fretesSelecionados);

        setTravarFreteBtn(true);
    }

    if (!didMount) {

        if (typeof window !== 'undefined') {

            localStorage.retirarNaLoja = JSON.stringify(false);
            
            setDidMount(true);
            getProdutos();
            getCepDestino();
        }
    }
    
    const [retirarNaLoja, setRetirarNaLoja] = useState(false);

    const retirarNaLojaF = () => {

        let val = !retirarNaLoja;

        setRetirarNaLoja(val);

        localStorage.retirarNaLoja = JSON.stringify(val);
    }
    
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
                    <h1 className={styles.h1}>Meu Carrinho</h1>
                </Col>
            </Row>
            <Row className="justify-content-end">
                <Col xs="auto">
                    <h3>Total: R$ {total}</h3>
                    <h3></h3>
                </Col>
            </Row>
            <Row className="justify-content-end">
                <Col xs="auto">
                    <InputGroup className="mb-3">
                        <p className="mr-3">Cep de Entrega</p>
                        <FormControl
                        placeholder="Cep de Entrega"
                        //aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                        value={cepDestino}
                        onChange={changeCepDestino}
                        maxLength="10"
                        />
                        <InputGroup.Append>
                            <Button onClick={calcularFreteBtn} variant="outline-secondary">Calcular</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Col>
            </Row>
            <Row className="justify-content-end mb-3">
                <Col xs="auto">
                    <Form.Check 
                        onChange={retirarNaLojaF}
                        inline label="Retirar na Loja"
                        //name={"frete"+i}
                        checked={retirarNaLoja}
                        type="checkbox"
                        //id={"pac"+i}
                    />
                </Col>
            </Row>
            {btnFinalizarCompra}
            {/*<Row className="justify-content-center">
                <Col xs="auto">
                    <Pagination {...{pages: pages, get: getProdutos}} />
                </Col>
            </Row>*/}
            <Row>
                {renderProdutos}
            </Row>
        </Container>
        <Footer />
        </>
    );
} 