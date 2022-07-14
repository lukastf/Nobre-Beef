import { Container, Row, Col, Image, Tab, ListGroup } from 'react-bootstrap'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'

import styles from './produtos-comprados.module.css'
import { useState } from 'react'
import Pagination from '../components/Pagination/Pagination'
import { serverUrl } from '../config'

export default function PComprados () {

    const [pages, setPages] = useState([]);
    const [compras, setCompras] = useState();
    const [comprasDetalhes, setComprasDetalhes] = useState([]);

    const [didMount, setDidMount] = useState(false);

    const getCompras = async (page = 0) => {

        const res = await fetch(serverUrl + '/api/produtos/comprasSession/10/' + page, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: "GET"
        });

        const result = await res.json();
 
        montarCompras(result.compras);
        setPages(result.pages);
    }

    if (!didMount) {

        setDidMount(true);
        getCompras();
    }

    const montarCompras = (compras) => {

        let temp1 = [];
        let temp2 = [];

        const ramones = (p) => {

            let punk = [];

            for (let i = 0; i < p.length; i++) {
                p[i];

                punk.push(
                <p>nome: {p[i].nome}</p>,
                <p>quantidade: {p[i].quantidade}</p>,
                <p>preço do produto: {p[i].preco}</p>,
                <p>tipo do frete: {p[i].tipoFrete}</p>,
                <p>preço do frete: {p[i].precoFrete}</p>,
                <hr/>
                );
                
            }

            return punk;
        }

        const convertDate = (inputFormat) => {
            const pad = (s) => { return (s < 10) ? '0' + s : s; }
            var d = new Date(inputFormat)
            return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
        }

        for (let i = 0; i < compras.length; i++) {

            temp1.push(
            <ListGroup.Item key={compras[i]._id} action href={"#"+ compras[i]._id} 
            onClick={(e)=>e.preventDefault()}>
                <p>total: R$ {compras[i].total}</p>
                <p>dia: {convertDate(compras[i].dia)}</p>
                <p>status do pedido: {compras[i].statusPedido}</p>
            </ListGroup.Item>
            );

            temp2.push(
            <Tab.Pane key={compras[i]._id} eventKey={"#"+ compras[i]._id}>
                <p>_id: {compras[i]._id}</p>
                {
                //pinkFloyd(compras[i].usuario)
                }
                {ramones(compras[i].produtos)}
                <p>total: {compras[i].total}</p>
                <p>dia: {convertDate(compras[i].dia)}</p>
            </Tab.Pane>
            );
        }

        setCompras(temp1);
        setComprasDetalhes(temp2);
    }

    return(
        <>
        <Navbar/>
        <Container fluid>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <Image src="logo.png" className={styles.logo} fluid />
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <h1 className={styles.h1}>Produtos Comprados</h1>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <Pagination {...{pages: pages, get: getCompras}} />
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xs="10 my-5">
                    <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
                        <Row>
                            <Col sm={4}>
                                <ListGroup>
                                    {compras}
                                </ListGroup>
                            </Col>
                            <Col sm={8}>
                                <Tab.Content>
                                    {comprasDetalhes}
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </Col>
            </Row>
        </Container>
        <Footer/>
        </>
    )
}