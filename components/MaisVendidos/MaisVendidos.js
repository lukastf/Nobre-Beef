
import { useState } from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import styles from './MaisVendidos.module.css'

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { serverUrl } from "../../config";
import {storeCarrinho, set} from '../ReduxSlices/CarrinhoSlice';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";

export default function MaisVendidos() {

    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 5
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 4
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
    };

    const [didMount, setDidMount] = useState(false);
    const [maisVendidos, setMaisVendidos] = useState([]);
    const [renderMaisVendidos, setRenderMaisVendidos] = useState([]);

    const mountMaisVendidos = (maisVendidos, displayIndex = 0) => {

        let mudarImgtriGatilho = false;
        let carrinho = [...storeCarrinho.getState().carrinho];
        let carrinhoStored = [];

        if (typeof localStorage.carrinho != "undefined") carrinhoStored = JSON.parse(localStorage.carrinho);

        if (carrinho.length != carrinhoStored.length)
            carrinho = carrinhoStored;

        const mudarImagem = (e) => {

            if (maisVendidos.length < 1) return;
            if (mudarImgtriGatilho) return;
            mudarImgtriGatilho = true;
    
            let val = parseInt(e.target.id);
            
            mountMaisVendidos(maisVendidos, val);
        }

        const btnCarrinho = (_id) => {

            const remove = (e) => {
            
                for (let i = 0; i < carrinho.length; i++) {
                    
                    if (carrinho[i]._id == _id)  carrinho.splice(i, 1);
                }
            
                storeCarrinho.dispatch(set(carrinho));
                localStorage.carrinho = JSON.stringify(carrinho);
            
                mountMaisVendidos(maisVendidos, displayIndex);
            }
            
            const add = (e) => {
            
                for (let i = 0; i < carrinho.length; i++) {
                    
                    if (carrinho[i]._id == _id) return;
                }
            
                carrinho.push({_id: _id, qtd: 1});
            
                storeCarrinho.dispatch(set(carrinho));
                localStorage.carrinho = JSON.stringify(carrinho);
            
                maisVendidos(maisVendidos, displayIndex);
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

        for (let i = 0; i < maisVendidos.length; i++) {

            if(displayIndex == i){
                tempDisplayImg1.push("d-none");
                tempDisplayImg2.push("");
            } else {
                tempDisplayImg1.push("");
                tempDisplayImg2.push("d-none");
            }

            let src = getSrc(maisVendidos[i].imagens, maisVendidos[i].linksExterno);
            let produtoEsgotado = getProdutoEsgotado(maisVendidos[i].quantidade);

            if (produtoEsgotado != "d-none") {

                temp.push(
                <div className={styles.carouselItem + " " + produtoEsgotado}>
                    <Link href={"/produto/" + maisVendidos[i]._id}>
                        <Image onMouseEnter={mudarImagem} onMouseLeave={mudarImagem} id={i} 
                        className={tempDisplayImg1[i] + " " + styles.pointer + " " + styles.imgCarousel} 
                        src={src[0]} 
                        fluid draggable="false" />
                    </Link>
    
                    <Link href={"/produto/" + maisVendidos[i]._id}>
                        <Image onMouseEnter={mudarImagem} onMouseLeave={mudarImagem}
                        className={tempDisplayImg2[i] + " " + styles.pointer + " " + styles.imgCarousel} 
                        src={src[1]} 
                        fluid draggable="false"/>
                    </Link>
                    <p> {maisVendidos[i].nome} </p>
                    <p> {maisVendidos[i].descricao} </p>
                    <h5 className={styles.bold}> R$ {maisVendidos[i].preco} </h5>
                    {btnCarrinho(maisVendidos[i]._id)}
                </div>
                );
            }
        }

        mudarImgtriGatilho = false;
        setRenderMaisVendidos(temp);
    }

    const getMaisVendidos = async () => {

        const a = await fetch(serverUrl + "/api/produtos/produtos/15/0/sort/+vendidos/break/15");
        //const a = await fetch(serverUrl + "/api/produtos/produtos/2/0");
        const b = await a.json();

        setMaisVendidos(b.produtos);
        mountMaisVendidos(b.produtos);
    }

    if (!didMount) {

        if (typeof window !== 'undefined') {

            setDidMount(true);
            getMaisVendidos();
        }
    }

    return(
    <Container fluid>
        <Row className="justify-content-center">
            <Col xs="auto">
                <Image src="logo.png" className={styles.logo} fluid />
            </Col>
        </Row>
        <Row className="justify-content-center">
            <Col xs="auto">
                <h1 className={styles.h1}>Mais Vendidos</h1>
            </Col>
        </Row>
        <Carousel 
            swipeable={true}
            draggable={true}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={3000}
        >
            {renderMaisVendidos}
        </Carousel>
    </Container>
    )
}