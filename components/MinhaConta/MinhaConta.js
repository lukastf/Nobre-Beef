
import { signOut } from 'next-auth/client'
import Link from 'next/link'
import { Container, Row, Col, Button } from 'react-bootstrap'
import Conta from '../Forms/Conta'

import styles from './MinhaConta.module.css'

import { useSession } from 'next-auth/client'

export default function MinhaConta () {

    const [ session, loading ] = useSession();

    return(
        <Container fluid>
            <Row className="mt-5 justify-content-end">
                
                {session.user.email == "admin@nobreBeef" && <Col xs="auto" md="3">
                    <Link href="/painel-admin">
                        <Button variant="warning" className="mb-3">
                            Painel do Admin
                        </Button>
                    </Link>
                </Col>}
                <Col xs="auto" md="3">
                    <Link href="/produtos-comprados">
                        <Button className={styles.btn} variant="danger">
                            Produtos Comprados
                        </Button>
                    </Link>
                </Col>
                <Col xs="auto" md="3">
                    <Button onClick={() => signOut()} className={styles.btn} variant="danger">
                        Sair da Conta
                    </Button>
                </Col>
            </Row>
            <Row className="mt-5 justify-content-center">
                <Col xs="12" md="4">
                    <h3 className="text-center"> Alterar Conta </h3>
                    <Conta {...{editar: true}} />
                </Col>
            </Row>
        </Container>
    )
}