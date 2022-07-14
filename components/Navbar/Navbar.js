
import {Navbar, Nav, InputGroup, FormControl, Button, Col, Image, ListGroup} from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUser, faShoppingBasket } from '@fortawesome/free-solid-svg-icons'

import styles from './Navbar.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { serverUrl } from '../../config'


export default function N() {

    const ColoredLine = ({ color }) => (
        <hr
            style={{
                color: color,
                backgroundColor: color,
                height: "0.1rem",
                margin: 0
            }}
        />
    );

    const [categorias, setCategorias] = useState([]);
    const [didMount, setDidMount] = useState(false);

    const getCategorias = async () => {

        const a = await fetch(serverUrl + "/api/categorias/categorias");
        const result = await a.json();

        const limite = 9;
        let navs = result.length/limite;
        navs = navs.toFixed(0);

        let temp = [];
        let temp2 = [];
        let goku = [];

        let c = 0;

        for (let i = 0; i < result.length; i++) {

            c++;

            goku.push(
                <Nav.Link href="#" className={styles.textStyle2 + " mx-3"}>
                    <Link href={"/" + result[i].nome}>
                        <p>{result[i].nome}</p>
                    </Link>
                </Nav.Link>
            );

            if (c > limite) {
                c = 0;
                temp2.push(goku);
                goku = [];
            }
        }

        for(let i = 0; i < navs; i++) {
            
            temp.push(
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href="#"></Navbar.Brand>
                <Navbar.Toggle aria-controls={"responsive-navbar-nav"+i} />
                <Navbar.Collapse id={"responsive-navbar-nav"+i}>
                    <Nav className="ml-auto">
                        {temp2[i]}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            );
        }

        setCategorias(temp);
    }

    const listenToScroll = () => {

        const winScroll =
          document.body.scrollTop || document.documentElement.scrollTop
      
        const height =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight
      
        const scrolled = winScroll / height;

        if (scrolled != 0) limparPesquisa();
    }

    if (!didMount) {

        if (typeof window != "undefined"){

            window.addEventListener('scroll', listenToScroll)

            setDidMount(true);
            getCategorias();
        }
    }

    

    const [pesquisa, setPesquisa] = useState([]);
    const [renderPesquisa, setRenderPesquisa] = useState([]);

    const renderPesquisaF = (pesquisa) => {

        let temp = [];

        for (let i = 0; i < pesquisa.length; i++) {

            temp.push(
                <Link href={"/produto/" + pesquisa[i]._id}>
                    <ListGroup.Item className={styles.pointer}>{pesquisa[i].nome}</ListGroup.Item>
                </Link>
            );
            
        }

        setRenderPesquisa(
            <ListGroup className={styles.pesquisa}>
                {temp}
            </ListGroup>
        );
    }

    const pesquisar = async (e) => {

        //checkScroll(e);

        let val = e.target.value;

        const p = await fetch(serverUrl + "/api/produtos/produtos/5/0/searchProp/nome/search/"+ val);
        const pResult = await p.json(); 

        setPesquisa(pResult.produtos);

        renderPesquisaF(pResult.produtos);
    }

    const limparPesquisa = () => {

        setRenderPesquisa([]);
    }

    const mountRenderPesquisa = (e) => {

        //checkScroll(e);

        renderPesquisaF(pesquisa);
    }
    
    //console.log(window.pageYOffset)
    /*if (typeof window != "undefined"){

        if (window.pageYOffset != 0 && renderPesquisa.length > 0) limparPesquisa();
    }*/

    

    return (
    <>
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="#">
            <Link href="/">
                <Image src="/logo.png" className={styles.logo} fluid />
            </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
                {/*<Row>*/}
                <Col xs={12} md={5} onMouseLeave={limparPesquisa}>
                    <InputGroup className="mt-3">
                        <FormControl
                            placeholder="O que você procura?"
                            aria-label="O que você procura?"
                            aria-describedby="basic-addon2"
                            onChange={pesquisar}
                            
                            onMouseEnter={mountRenderPesquisa}
                            
                        />
                        <InputGroup.Append>
                            <Button variant="light"><FontAwesomeIcon icon={faSearch} /></Button>
                        </InputGroup.Append>
                    </InputGroup>
                    {renderPesquisa}
                </Col>
                {/*</Row>*/}
                <Col xs={12} md={2}>
                    <Nav.Link href="#" className={styles.textStyle}><p>Aplicativo Apple</p></Nav.Link>
                </Col>
                <Col xs={12} md={2}>
                    <Nav.Link href="#" className={styles.textStyle}><p>Aplicativo Android</p></Nav.Link>
                </Col>
                <Col xs={12} md={2}>
                    <Nav.Link className={"mt-3 " + styles.textStyle}>
                        <Link href="/minha-conta">
                            <p><FontAwesomeIcon icon={faUser} /> Minha Conta</p>
                        </Link>
                    </Nav.Link>
                </Col>
                <Col xs={12} md={3}>
                    <Nav.Link href="#" className={"mt-3 " + styles.textStyle}>
                        <Link href="/meu-carrinho">
                            <p><FontAwesomeIcon icon={faShoppingBasket} /> Meu Carrinho</p>
                        </Link>
                    </Nav.Link>
                </Col>
            </Nav>
        </Navbar.Collapse>
        
    </Navbar>
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="#home"></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav2" />
        <Navbar.Collapse id="responsive-navbar-nav2">
            <Nav className="ml-auto">
                    <Nav.Link href="#" className={styles.textStyle2}><p>Dark Operator</p></Nav.Link>
                    <Nav.Link href="#" className={styles.textStyle2 + " mx-3"}><p>Nos Supermercados</p></Nav.Link>
                    <Nav.Link href="#" className={styles.textStyle2 + " mx-3"}><p>Store</p></Nav.Link>
                    <Nav.Link href="#" className={styles.textStyle2 + " mx-3"}><p>Steak Bar</p></Nav.Link>
                    <Nav.Link href="#" className={styles.textStyle2 + " mx-3"}><p>Picanha Fest</p></Nav.Link>
                    <Nav.Link href="#" className={styles.textStyle2 + " mx-3"}><p>Parcerias</p></Nav.Link>
                    <Nav.Link href="#" className={styles.textStyle2 + " mx-3"}><p>Receitas</p></Nav.Link>
                    <Nav.Link href="#" className={styles.textStyle2 + " mx-3"}><p>Midia/Blog</p></Nav.Link>
                    <Nav.Link href="#" className={styles.textStyle2 + " mx-3"}><p>"O Cara da Carne"</p></Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
    <ColoredLine color="#efd9ad" />
    {categorias}
    </>
    )
}