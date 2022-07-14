
import { useRouter } from 'next/router';
import { useState } from 'react';

import { Col, Container, Image, Row, Button } from 'react-bootstrap';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { serverUrl } from '../../config';

import styles from './[_id].module.css';
import {storeCarrinho, set} from '../../components/ReduxSlices/CarrinhoSlice';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';

export default function P () {

    const router = useRouter();
    const { _id } = router.query;

    const [produto, setProduto] = useState(null);
    const [didMount, setDidMount] = useState(false);
    const [idRefresh, setIdRefresh] = useState(_id);

    const getProduto = async () => {

        const p = await fetch(serverUrl + "/api/produtos/produto/"+ _id);
        const result = await p.json();

        setIdRefresh(_id);
        renderProduto(result);
        //setPages(result.pages);
    }

    if (_id != idRefresh) {
        getProduto();
    }

    if (!didMount) {

        if (typeof _id != "undefined") {

            setDidMount(true);
            getProduto();
        }
    }

    const renderProduto = (produto, indexImg = 0, link = false) => {

        let carrinho = [...storeCarrinho.getState().carrinho];
        let carrinhoStored = [];

        if (typeof localStorage.carrinho != "undefined") carrinhoStored = JSON.parse(localStorage.carrinho);

        if (carrinho.length != carrinhoStored.length)
            carrinho = carrinhoStored;

        const changeImg = (e) => {

            let index = e.target.id;

            renderProduto(produto, index, false);
        }

        const changeImgLinkExterno = (e) => {

            let index = e.target.id;
            renderProduto(produto, index, true);
        }

        const btnCarrinho = (_id) => {

            const remove = (e) => {
            
                for (let i = 0; i < carrinho.length; i++) {
                    
                    if (carrinho[i]._id == _id)  carrinho.splice(i, 1);
                }
            
                storeCarrinho.dispatch(set(carrinho));
                localStorage.carrinho = JSON.stringify(carrinho);

                renderProduto(produto, indexImg, link);
            }
            
            const add = (e) => {
            
                for (let i = 0; i < carrinho.length; i++) {
                    
                    if (carrinho[i]._id == _id) return;
                }
            
                carrinho.push({_id: _id, qtd: 1});
                storeCarrinho.dispatch(set(carrinho));
                localStorage.carrinho = JSON.stringify(carrinho);

                renderProduto(produto, indexImg, link);
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

        let temp = [];
        let imgs = [];

        if (typeof produto.imagens != "undefined" && produto.imagens != null) {

            for (let i = 0; i < produto.imagens.length; i++) {
                imgs.push(
                    <Image 
                        onClick={changeImg} id={i} 
                        className={styles.pointer}
                        src={"/imgsProdutos/"+produto.imagens[i]} fluid />
                );
            }
        }

        if (typeof produto.linksExterno != "undefined" && produto.linksExterno != null) {

            for (let i = 0; i < produto.linksExterno.length; i++) {
                imgs.push(
                    <Image 
                        onClick={changeImgLinkExterno} id={i} 
                        className={styles.pointer}
                        src={produto.linksExterno[i]} fluid />
                );
            }
        }


        let src = "/imgsProdutos/"+produto.imagens[indexImg];

        if (link) src = produto.linksExterno[indexImg];


        temp.push(
        <Container fluid className={styles.space}>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <Image src="/logo.png" className={styles.logo} fluid />
                </Col>
            </Row>
            <Row>
                <Col xs="auto" md="2">
                    {imgs}
                </Col>
                <Col xs="auto" md="4">
                    <Image className={styles.img} src={src} fluid />
                </Col>
                <Col xs="auto" md="6" /*className={"text-center"}*/ className="text-center">
                    
                    
                   
                        
                    <h3>{produto.nome}</h3>
                    <p>{produto.descricao}</p>
                    <h3>R$ {produto.preco}</h3>
                    {btnCarrinho(produto._id)}
                </Col>
            </Row>
        </Container>
        );

        setProduto(temp);
    }



    //return <p>Post: {produto}</p>

    return (
        <>
        <Navbar />
        {produto}
        <Footer />
        </>
    );

}