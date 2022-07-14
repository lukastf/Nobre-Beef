import Link from "next/link";
import { useState } from "react";
import { Col, Container, Image, Row, Button } from "react-bootstrap";
import { serverUrl } from "../../config";

import styles from './Premium.module.css';
import {storeCarrinho, set} from '../ReduxSlices/CarrinhoSlice';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';

export default function Premium() {

    const [renderProdutos, setRenderProdutos] = useState([]);
    
    const [didMount, setDidMount] = useState(false);

    const getProdutos = async () => {
        //renderProdutosFunc([]);
        //return;

        const p = await fetch(serverUrl + "/api/produtos/produtos/8/0/premium/true");
        const result = await p.json();

        renderProdutosFunc(result.produtos);
    }

    const renderProdutosFunc = async (produtos, displayIndex = 0) => {

        let mudarImgtriGatilho = false;
        let carrinho = [...storeCarrinho.getState().carrinho];
        let carrinhoStored = [];

        if (typeof localStorage.carrinho != "undefined") carrinhoStored = JSON.parse(localStorage.carrinho);

        if (carrinho.length != carrinhoStored.length)
            carrinho = carrinhoStored;

        const mudarImagem = (e) => {

            if (produtos.length < 1) return;
            if (mudarImgtriGatilho) return;
            mudarImgtriGatilho = true;
    
            let val = parseInt(e.target.id);
            
            renderProdutosFunc(produtos, val);
        }

        const btnCarrinho = (_id) => {

            const remove = (e) => {
            
                for (let i = 0; i < carrinho.length; i++) {
                    
                    if (carrinho[i]._id == _id)  carrinho.splice(i, 1);
                }
            
                storeCarrinho.dispatch(set(carrinho));
                localStorage.carrinho = JSON.stringify(carrinho);
            
                renderProdutosFunc(produtos, displayIndex);
            }
            
            const add = (e) => {
            
                for (let i = 0; i < carrinho.length; i++) {
                    
                    if (carrinho[i]._id == _id) return;
                }
            
                carrinho.push({_id: _id, qtd: 1});
            
                storeCarrinho.dispatch(set(carrinho));
                localStorage.carrinho = JSON.stringify(carrinho);
            
                renderProdutosFunc(produtos, displayIndex);
            }

            let isOnCarrinho = false;

            for (let i = 0; i < carrinho.length; i++) {
                
                if (carrinho[i]._id == _id) isOnCarrinho = true;
            }

            if (isOnCarrinho) {
                return (
                <Button variant="success" onClick={remove}> 
                    <FontAwesomeIcon icon={faShoppingBasket} /> Remover
                </Button>
                )
            }

            return(
            <Button className={styles.btn} variant="danger" onClick={add}> 
                <FontAwesomeIcon icon={faShoppingBasket} /> Adicionar
            </Button>
            )
        }

        const getSrc = (imgs, links) => {

            //const checkIsNull = (arr) => {

                //if ()
            //}

            //console.log(links);

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

        const getProdutoEsgotado = (qtd) => {

            if (qtd < 1) return "d-none";
            return "";
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

            let src = getSrc(produtos[i].imagens, produtos[i].linksExterno);
            let produtoEsgotado = getProdutoEsgotado(produtos[i].quantidade);

            temp.push(
            <Col xs="6" md="3" className={styles.produto + " " + produtoEsgotado}>

                <Link href={"/produto/" + produtos[i]._id}>
                    <Image onMouseEnter={mudarImagem} onMouseLeave={mudarImagem} id={i} 
                    className={tempDisplayImg1[i] + " " + styles.pointer} src={src[0]} alt="" fluid />
                </Link>

                <Link href={"/produto/" + produtos[i]._id}>
                    <Image onMouseEnter={mudarImagem} onMouseLeave={mudarImagem}
                    className={tempDisplayImg2[i] + " " + styles.pointer} src={src[1]} fluid />
                </Link>


                <p>{produtos[i].nome}</p>
                <p>{produtos[i].descricao}</p>
                <h3>{produtos[i].preco}</h3>
                {btnCarrinho(produtos[i]._id)}
            </Col>
            );
        }

        mudarImgtriGatilho = false;
        setRenderProdutos(temp);
    }

    if (!didMount) {

        if (typeof window !== 'undefined') {

            setDidMount(true);
            getProdutos();
        }
    }

    return (
    <Container fluid>
        <Row className="justify-content-center">
            <Col xs="auto">
                <Image src="logo.png" className={styles.logo} fluid />
            </Col>
        </Row>
        <Row className="justify-content-center">
            <Col xs="auto">
                <h1 className={styles.h1}>Premium</h1>
            </Col>
        </Row>
        <Row>
            {renderProdutos}
        </Row>
    </Container>
    )
}