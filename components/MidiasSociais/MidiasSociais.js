import { Container, Row, Col, Image } from "react-bootstrap";
import styles from './MidiasSociais.module.css'

export default function MidiasSociais() {

    return(
        <Container fluid>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <Image src="logo.png" className={styles.logo} fluid />
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <h1 className={styles.h1}>Midias Sociais</h1>
                </Col>
            </Row>
            <Row className="mx-auto">
                <Col xs="12" md="12" className={styles.elementos}>
                    <Image src="https://picsum.photos/200/300?random=1" fluid draggable="false"/>
                    <Image src="https://picsum.photos/200/300?random=2" fluid draggable="false"/>
                    <Image src="https://picsum.photos/200/300?random=3" fluid draggable="false"/>
                    <Image src="https://picsum.photos/200/300?random=4" fluid draggable="false"/>
                    <Image src="https://picsum.photos/200/300?random=5" fluid draggable="false"/>
                    <Image src="https://picsum.photos/200/300?random=6" fluid draggable="false"/>
                    <Image src="https://picsum.photos/200/300?random=7" fluid draggable="false"/>
                    <Image src="https://picsum.photos/200/300?random=8" fluid draggable="false"/>
                    <Image src="https://picsum.photos/200/300?random=9" fluid draggable="false"/>
                    <Image src="https://picsum.photos/200/300?random=10" fluid draggable="false"/>
                    <Image src="https://picsum.photos/200/300?random=11" fluid draggable="false"/>
                    <Image src="https://picsum.photos/200/300?random=12" fluid draggable="false"/>
                </Col>
            </Row>
            {/*<Row>
                <Col xs="6" md="3" className={styles.elemento}>
                    <Image src="https://picsum.photos/200/300?random=1" fluid draggable="false"/>
                </Col>
                <Col xs="6" md="3" className={styles.elemento}>
                    <Image src="https://picsum.photos/200/300?random=2" fluid draggable="false"/>
                </Col>
                <Col xs="6" md="3" className={styles.elemento}>
                    <Image src="https://picsum.photos/200/300?random=3" fluid draggable="false"/>
                </Col>
                <Col xs="6" md="3" className={styles.elemento}>
                    <Image src="https://picsum.photos/200/300?random=4" fluid draggable="false"/>
                </Col>
                <Col xs="6" md="3" className={styles.elemento}>
                    <Image src="https://picsum.photos/200/300?random=5" fluid draggable="false"/>
                </Col>
                <Col xs="6" md="3" className={styles.elemento}>
                    <Image src="https://picsum.photos/200/300?random=6" fluid draggable="false"/>
                </Col>
                <Col xs="6" md="3" className={styles.elemento}>
                    <Image src="https://picsum.photos/200/300?random=7" fluid draggable="false"/>
                </Col>
                <Col xs="6" md="3" className={styles.elemento}>
                    <Image src="https://picsum.photos/200/300?random=8" fluid draggable="false"/>
                </Col>
                <Col xs="6" md="3" className={styles.elemento}>
                    <Image src="https://picsum.photos/200/300?random=9" fluid draggable="false"/>
                </Col>
                <Col xs="6" md="3" className={styles.elemento}>
                    <Image src="https://picsum.photos/200/300?random=10" fluid draggable="false"/>
                </Col>
            </Row>*/}
        </Container>
    )
}