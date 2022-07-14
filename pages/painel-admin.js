import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'

import { useSession } from 'next-auth/client'
import { Container, Row, Col } from 'react-bootstrap'
import { useState } from 'react';
import PainelAdmin from '../components/PainelAdmin/PainelAdmin';
import { serverUrl } from '../config';

export default function Page({conta}) {

    const [ session, loading ] = useSession();
    const [isAdmin, setIsAdmin] = useState(false);
    
    const [didMount, setDidMount] = useState(false);

    const getConta = async () => {

        const res = await fetch(serverUrl + '/api/usuarios/usuarioSession', {
            headers: {
              'Content-Type': 'application/json',
              //'Authorization': `Bearer ${miau}`,
            },
            method: "GET"
        });

        const result = await res.json();
        setIsAdmin(result.admin);
    }

    if (!didMount) {

        setDidMount(true);
        getConta();
    }
  
    return (
    <>
    <Navbar />
    <Container fluid>
    {session && isAdmin && <>
        <PainelAdmin />
    </>}
    {(!session || !isAdmin) && <>
        <Row className="justify-content-center">
            <Col xs="auto my-5">
                <h1>
                    Area Restrita
                </h1>
            </Col>
        </Row>
    </>}
    </Container>
    <Footer />
    </>
    )
}
  