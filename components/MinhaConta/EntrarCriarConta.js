
import { Container, Row, Col } from 'react-bootstrap'

import Entrar from '../Forms/Entrar'
import Conta from '../Forms/Conta'

export default function EntrarOuCriarConta () {

    return(
        <Container fluid>
            <Row className="mt-5 justify-content-center">
                <Col xs="12" md="4">
                    <h3 className="text-center"> Entrar </h3>
                    <Entrar />
                </Col>
                <Col xs="12" md="4">
                    <h3 className="text-center"> Criar Conta </h3>
                    <Conta />
                </Col>
            </Row>
        </Container>
    )
}