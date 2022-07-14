import { signIn } from 'next-auth/client'
import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

import styles from './styles.module.css'

export default function entrar() {

    const [didMount, setDidMount] = useState(false);
    const [loginError, setLoginError] = useState("");

    if (!didMount) {

        if (typeof window != "undefined") {

            setDidMount(true);
    
            let url_string = window.location.href
            let url = new URL(url_string);
            let loginError = url.searchParams.get("loginError");
            
            if (loginError) {
                setLoginError(<p className={styles.loginError}> 
                Erro ao efetuar o login verifique se os campos estão corretos
                </p>)
            }
        }

    }

    const entrar = async event => {

        event.preventDefault()

        signIn('credentials', {
            email: event.target.emailLogin.value,
            senha: event.target.senhaLogin.value
        })
    }

    return(
    <Form onSubmit={entrar}>
        <Form.Group controlId="emailLogin">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Email" />
        </Form.Group>

        <Form.Group controlId="senhaLogin">
            <Form.Label>Senha</Form.Label>
            <Form.Control type="password" placeholder="Senha" />
        </Form.Group>
        {loginError}
        <Button className={styles.btn} variant="danger" type="submit"> Entrar </Button>
    </Form>
    )
}