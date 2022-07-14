
import { useState } from 'react'
import { Row, Image } from 'react-bootstrap';
import styles from './Footer.module.css'
import Link from 'next/link'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faAngleRight } from '@fortawesome/free-solid-svg-icons'

export default function MidiasSociais() {

    const [didMount, setDidMount] = useState(false);
    const [year, setYear] = useState("");

    if (!didMount) {

        setDidMount(true);

        let d = new Date();
        let year = d.getFullYear();

        setYear(year);
    }

    return(
    <div className={"text-left col-12 row ml-0 " + styles.footer}>
        <Row>
            <div className="col-md-4">
                <Image src="/logo.png" className={styles.logo} fluid />
            </div>
            <div className="col-md-3 my-5">
                <h4>WhatsApp</h4>
                <p>999999999</p>
                <h4 className="mt-4">Email</h4>
                <p>email@email</p>
                <h4 className="mt-4">Telefone</h4>
                <p>9999999</p>
            </div>
            <div className={"col-md-3 my-5 " + styles.links}>
                <h4>Institucional</h4>
                <p>
                    <Link href="#/o-cara-da-carne">
                        <a> <FontAwesomeIcon icon={faAngleRight} /> O Cara da Carne</a>
                    </Link>
                </p>
                <p>
                    <Link href="#/franquias">
                        <a> <FontAwesomeIcon icon={faAngleRight} /> Franquias</a>
                    </Link>
                </p>
                <p>
                    <Link href="#/store">
                        <a> <FontAwesomeIcon icon={faAngleRight} /> Store</a>
                    </Link>
                </p>
                <p>
                    <Link href="#/varejo">
                        <a> <FontAwesomeIcon icon={faAngleRight} /> Varejo</a>
                    </Link>
                </p>
                <p>
                    <Link href="#/encontre-no-supermercado">
                        <a> <FontAwesomeIcon icon={faAngleRight} /> Encontre no Supermercado</a>
                    </Link>
                </p>
                <p>
                    <Link href="#/steak-bar">
                        <a> <FontAwesomeIcon icon={faAngleRight} /> Steak Bar</a>
                    </Link>
                </p>
                <p>
                    <Link href="#/picanha-fest">
                        <a> <FontAwesomeIcon icon={faAngleRight} /> Picanha Fest</a>
                    </Link>
                </p>
                <p>
                    <Link href="#/parcerias">
                        <a> <FontAwesomeIcon icon={faAngleRight} /> Parcerias</a>
                    </Link>
                </p>
                <p>
                    <Link href="#/midia">
                        <a> <FontAwesomeIcon icon={faAngleRight} /> Midia</a>
                    </Link>
                </p>
            </div>
            <div className={"col-md-2 my-5 " + styles.links}>
                <h4>Termos</h4>
                <p>
                    <Link href="/politicas-de-trocas-e-devolucoes">
                        <a> <FontAwesomeIcon icon={faAngleRight} /> Politica de Trocas e Devoluções</a>
                    </Link>
                </p>
                <p>
                    <Link href="/termos-de-uso-polica-privacidade">
                        <a> <FontAwesomeIcon icon={faAngleRight} /> Termos de Uso e Politica de Privacidade</a>
                    </Link>
                </p>
            </div>
        </Row>
        <Row>
            <div className="col-md-6" style={{borderRight:"solid"}}>
                <p>
                    Copyright © 2021-{year}
                </p>
                <p>
                    CNPJ: 36.983.467/0001-46 / R JOAO JOSE LUCANIA FERNANDES 115, BAIRRO: SÃO
                    DEOCLECIANO, Sala 3 - SÃO JOSÉ DO RIO PRETO/SP CEP: 15.057-200 - -20.786824, -49.343464
                </p>
                <p>
                    EMPRESA LIMITADA - TODOS OS DIREITOS RESERVADOS POR ESTA.
                </p>
            </div>
            <div className="col-md-6">
                <img src="/site_protegido.png" alt="site-protegido" style={{width: "15rem", marginTop: "2rem"}} />
                <img src="/selo-ssl-blindado.png" alt="site-protegido" style={{width: "8rem", marginTop: "2rem", marginLeft: "3rem"}} />
                <img src="/credit-cards.png" alt="site-protegido" style={{width: "8rem", marginTop: "2rem", marginLeft: "3rem"}} />
            </div>
        </Row>
    </div>
    )
}