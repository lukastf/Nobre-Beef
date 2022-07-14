import { Container, Row, Col, Image } from "react-bootstrap";
import styles from './ComoComprar.module.css'

export default function ComoComprar() {

    return(
    <Container fluid>
        <Row className="justify-content-center">
            <Col xs="auto">
                <Image src="logo.png" className={styles.logo} fluid />
            </Col>
        </Row>
        <Row className="justify-content-center">
            <Col xs="auto">
                <h1 className={styles.h1}>Como Comprar</h1>
            </Col>
        </Row>
        <Row>
            <Col xs="6" md="3" className={styles.comprar}>
                <Image src="comprar1.png" fluid />
                <p>1. Faça a sua escolha e peça pelo site.</p>
            </Col>
            <Col xs="6" md="3" className={styles.comprar}>
                <Image src="comprar2.png" fluid />
                <p>2. Encaminharemos seu pedido para a separação e pesagem.</p>
            </Col>
            <Col xs="6" md="3" className={styles.comprar + " " + styles.comprar3}>
                <Image src="comprar3.png" fluid />
                <p>3. Após a pesagem debitaremos o valor exato no seu cartão de credito.</p>
            </Col>
            <Col xs="6" md="3" className={styles.comprar + " " + styles.comprar4}>
                <Image src="comprar4.png" fluid />
                <p>4. Seu pedido é enviado para transportadora e entregue em carros refrigerados na sua casa.</p>
            </Col>
        </Row>
    </Container>
    )
}