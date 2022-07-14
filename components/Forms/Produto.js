import { useState, useCallback } from "react";
import { Form, Row, Col, Button, Image } from "react-bootstrap";
import { moneyMask, numberMask } from "../Utils/masks";

import styles from './styles.module.css';

import { storeProduto, setEditar } from "../ReduxSlices/ProdutoSlice";
import { serverUrl } from '../../config';

export default function Produto() {

    const [inputs,setInputs] = useState({});

    const [imagensVal, setImagensVal] = useState("");
    const [imagensPic, setImagensPic] = useState(null);
    const [imagensUrl, setImagensUrl] = useState(null);

    const [checkPremium, setCheckPremium] = useState(false);

    const [categorias, setCategorias] = useState();
    const [msg, setMsg] = useState("");
    const [color, setColor] = useState("");
    const [method, setMethod] = useState("POST");
    const [btnText, setBtnText] = useState("Cadastrar");

    const [inpusImgLinkExterno, setInpusImgLinkExterno] = useState([]);
    const [linksExterno, setLinksExterno] = useState([]);

    const [didMount, setDidMount] = useState(false);

    const getCategorias = async () => {

        const res = await fetch(serverUrl + "/api/categorias/categorias");
        const result = await res.json();

        let temp = [];
        
        for (let i = 0; i < result.length; i++) {

            temp.push(
                <option value={result[i].nome}>{result[i].nome}</option>
            );
        }

        setCategorias(temp);
    }

    

    const getProduto = async (_id) => {

        const res = await fetch(serverUrl + '/api/produtos/produto/' + _id, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: "GET"
        });

        const result = await res.json();

        let p = result;

        setInputs(p);
        setLinksExterno(p.linksExterno);
        setCheckPremium(p.premium);
        mountInpusImgLinkExterno(p.linksExterno, p.imagens);

        let t = [];

        if (typeof p.linksExterno != "undefined" && p.linksExterno != null) {

            for (let i = 0; i < p.linksExterno.length; i++) {
                t.push(p.linksExterno[i]);
            }
        }

        if (typeof p.imagens != "undefined" && p.imagens != null) {

            for (let i = 0; i < p.imagens.length; i++) {
                t.push(p.imagens[i]);
            }
        }


        mostrarImagensEnviadas(t);
    }

    if (!didMount) {

        setDidMount(true);
        getCategorias();
    }

    const limparForm = () => {

        setImagensVal("");
        setImagensPic(null);
        setImagensUrl(null);

        setInputs({
            _id: "",
            nome:"", 
            preco:"",
            quantidade: "",
            categoria: "",
            comprimento: "",
            largura: "",
            altura: "",
            peso: "",
            diametro: "",
            formato: "",
            descricao: "",
            imagens: [],
            premium : false,
            linksExterno: []
        });

    }

    if (storeProduto.getState().editar == "limpar") {
    
        limparForm();
        
        setMsg("");
        setMethod("POST");
        setBtnText("Cadastrar");

        storeProduto.dispatch(setEditar(false));
    }

    if (storeProduto.getState().editar) {

        setMethod("PUT");
        setBtnText("Alterar");

        getProduto(storeProduto.getState().editar);
        storeProduto.dispatch(setEditar(false));
    }

    const mostrarImagensEnviadas = (imagens) => {

        let temp = [];

        for (let i = 0; i < imagens.length; i++) {

            let src = "";

            if (typeof imagens[i] !== "string" /*|| !(imagens[i] instanceof String)*/) 
                src = URL.createObjectURL(imagens[i]);
            else if (imagens[i].includes("upload_")) src = "/imgsProdutos/"+imagens[i];
            else if (imagens[i].includes("http")) src = imagens[i];

            temp.push(
                <Image 
                    id={i} 
                    className={styles.imgEnviada}
                    src={src} fluid />
            );
        }

        setImagensUrl(temp);
    }

    const onChangeHandlerImagens = (e) => {

        setImagensVal(e.target.value);
        setImagensPic(e.target.files);

        let obj = {...inputs}
        //let tempLinksExternos = [];
        let files = [];
        let objImgs = [];

        for (let i = 0; i < e.target.files.length; i++) {
            
            files.push(e.target.files[i]);
            objImgs.push(URL.createObjectURL(e.target.files[i]));
            //objImgs.push("upload_");
        }

        /*for (let i = 0; i < obj.imagens.length; i++) {

            if (obj.imagens[i].includes("upload_")) continue;
            files.push(obj.imagens[i]);
            objImgs.push(obj.imagens[i]);
        }*/

        obj.imagens = objImgs;

        //let imagens = [...inputs.imagens];

        for (let i = 0; i < linksExterno.length; i++) {
            if (typeof linksExterno[i] == "undefined") files.push("");
            else files.push(linksExterno[i]);
        }

        setInputs(obj);
        mostrarImagensEnviadas(files);
        mountInpusImgLinkExterno(linksExterno, obj.imagens);
    }

    const onChangeHandler = useCallback(
        ({target:{name,value}}) => {

            if (name == "quantidade") value == numberMask(value)
            if (name == "preco" || name == "comprimento" || name == "largura"
            || name == "altura" || name == "peso" || name == "diametro") value = moneyMask(value)

            if (name == "premium") value = !value

            setInputs(state => ({ ...state, [name]:value }), []);
        }
    );

    const enviarImagens = async () => {

        let f = new FormData();

        for (let index = 0; index < imagensPic.length; index++) {
            
            f.append("imagens"+index, imagensPic[index]);
        }

        const res = await fetch('/api/produtos/produtoImg', {
            body: f,
            /*headers: {
                'Content-Type': 'multipart/form-data'
            },*/
            method: 'POST'
        });
      
        const result = await res.json();

        return result.nome;
    }

    const checkPremiumHandler = (e) => {

        setCheckPremium(!checkPremium);
    }

    const adicionarOuAlterarProduto = async (e) => {

        e.preventDefault();

        let obj = {...inputs}
        //let tempLinksExternos = [];
        obj.linksExterno = linksExterno;
        obj.premium = checkPremium;

        /*for (let i = 0; i < obj.imagens.length; i++) {

            if (obj.imagens[i].includes("upload_")) continue;
            tempLinksExternos.push(obj.imagens[i]);
        }*/

        if (imagensPic != null) obj.imagens = await enviarImagens();

        /*for (let i = 0; i < tempLinksExternos.length; i++) {

            obj.imagens.push(tempLinksExternos[i]);
        }*/

        const res = await fetch('/api/produtos/produto/' + inputs._id, {
            body: JSON.stringify(obj),
            headers: {
              'Content-Type': 'application/json'
            },
            method: method
        });
      
        const result = await res.json();
        setMsg(result.msg);
        setColor(result.color);

        //atualiza lista
        storeProduto.getState().getProdutos();

        if (method == "POST") limparForm();

    }

    const mountInpusImgLinkExterno = (links = [], imagens = []) => {

        let temp = [];

        if (links == null) links = [];
        
        for (let i = 0; i < links.length; i++) {

            const changeImgs = () => {

                //let imagens = [...inputs.imagens];

                let imgs = [];

                for (let j = 0; j < imagens.length; j++) {
                    imgs.push(imagens[j]);
                }

                //let imagensLinks = imagens;

                //for (let i = 0; i < temp.length; i++) {
                for (let k = 0; k < links.length; k++) {

                    if (typeof links[k] == "undefined") imgs.push("");
                    else imgs.push(links[k]);
                }
                
                mostrarImagensEnviadas(imgs);
            }

            const changeLinkExterno = (e) => {
    
                let val = e.target.value;
                links[i] = val;
        
                if (links[i].includes("http")) {
    
                    changeImgs();
                }
    
                setLinksExterno(links);
                mountInpusImgLinkExterno(links, imagens);
            }

            const removerLink = (e) => {

                //let val = e.target.value;
                //links[i] = val;

                let _id = e.target.id;
        
                for (let i = 0; i < links.length; i++) {
                    
                    if (i == _id)  links.splice(i, 1);
                }

                changeImgs();

                setLinksExterno(links);
                mountInpusImgLinkExterno(links, imagens);
            }
            
            temp.push(
            <Form.Group>
                <Form.Label>Link Externo</Form.Label>
                <Form.Control type="text" placeholder="Link Externo" name="linkExterno"
                onChange={changeLinkExterno} id={i} value={links[i]} />
                <Button onClick={removerLink} id={i} type="button" className={styles.btn} variant="danger">
                    Remover Link
                </Button>
            </Form.Group>
            );
        }

        setInpusImgLinkExterno(temp);
    }

    const addInpusImgLinkExterno = () => {

        let links = [];

        if (typeof linksExterno != "undefined" && linksExterno != null) {

            //try {
                links = [...linksExterno];
            //} catch(e) {
                //links = [];
            //}
        }

        links.push("");
        setLinksExterno(links);
        let obj = {...inputs}
        mountInpusImgLinkExterno(links, obj.imagens);
    }

    return(
        <Form onSubmit={adicionarOuAlterarProduto}>
            <Form.Group controlId="nome">
                <Form.Label>Nome</Form.Label>
                <Form.Control type="text" placeholder="Nome" name="nome"
                onChange={onChangeHandler} value={inputs.nome} />
            </Form.Group>

            <Form.Group controlId="preco">
                <Form.Label>Preço em R$</Form.Label>
                <Form.Control type="text" placeholder="Preço em R$" name="preco"
                onChange={onChangeHandler} value={inputs.preco} />
            </Form.Group>

            <Form.Group controlId="quantidade">
                <Form.Label>Quantidade</Form.Label>
                <Form.Control type="text" placeholder="Quantidade" name="quantidade"
                onChange={onChangeHandler} value={inputs.quantidade} />
            </Form.Group>

            <Form.Group controlId="categoria">
                <Form.Label>Categoria</Form.Label>
                <Form.Control as="select" name="categoria"
                    onChange={onChangeHandler} value={inputs.categoria}>
                        <option value="">Selecione uma Categoria</option>
                        {categorias}
                </Form.Control>
            </Form.Group>
            <p>* Em centímetros</p>
            <Row>
                <Col md="4">
                    <Form.Group controlId="comprimento">
                        <Form.Label>Comprimento*</Form.Label>
                        <Form.Control type="text" placeholder="Comprimento" name="comprimento"
                        onChange={onChangeHandler} value={inputs.comprimento} />
                    </Form.Group>
                </Col>
                <Col md="4">
                    <Form.Group controlId="largura">
                        <Form.Label>Largura*</Form.Label>
                        <Form.Control type="text" placeholder="Largura" name="largura"
                        onChange={onChangeHandler} value={inputs.largura} />
                    </Form.Group>
                </Col>
                <Col md="4">
                    <Form.Group controlId="altura">
                        <Form.Label>Altura*</Form.Label>
                        <Form.Control type="text" placeholder="Altura" name="altura"
                        onChange={onChangeHandler} value={inputs.altura} />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md="4">
                    <Form.Group controlId="peso">
                        <Form.Label>Peso (em Kg)</Form.Label>
                        <Form.Control type="text" placeholder="Peso (em Kg)" name="peso"
                        onChange={onChangeHandler} value={inputs.peso} />
                    </Form.Group>
                </Col>
                <Col md="4">
                    <Form.Group controlId="diametro">
                        <Form.Label>Diametro*</Form.Label>
                        <Form.Control type="text" placeholder="Diametro" name="diametro"
                        onChange={onChangeHandler} value={inputs.diametro} />
                    </Form.Group>
                </Col>
                <Col md="4">
                    <Form.Group controlId="formato">
                        <Form.Label>Formato</Form.Label>
                        <Form.Control as="select" name="formato"
                        onChange={onChangeHandler} value={inputs.formato}>
                            <option value="">Selecione o formato da encomenda</option>
                            <option value={1}>Caixa/Pacote</option>
                            <option value={2}>Rolo/Prisma</option>
                            <option value={3}>Envelope</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group controlId="descricao">
                <Form.Label>Descricao</Form.Label>
                <Form.Control as="textarea" placeholder="Descricao" name="descricao"
                onChange={onChangeHandler} value={inputs.descricao} rows={3} />
            </Form.Group>

            <Form.Group controlId="imagens">
                <Form.File 
                    onChange={onChangeHandlerImagens} 
                    name="imagens[]"
                    value={imagensVal}
                    id="imagens"
                    label="Imagens"
                    multiple
                    //custom
                />
            </Form.Group>
            <Form.Group>
                <Button variant="link" onClick={addInpusImgLinkExterno}>Adicionar Imagem por link externo</Button>
                {inpusImgLinkExterno}
            </Form.Group>

            <Form.Group controlId="premium">
                <Form.Check 
                    onChange={checkPremiumHandler} 
                    checked={checkPremium}
                    type="checkbox" 
                    label="Premium (em destaque)" 
                    name="premium" 
                />
            </Form.Group>

            {imagensUrl}

            <p style={{color: color}}>{msg}</p>

            <Button type="submit" className={styles.btn} variant="danger">
                {btnText}
            </Button>

        </Form>
    );

}