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
        setInputs(result);

        mostrarImagensEnviadas(result.imagens);
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
            premium : false
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

        for (let i = 0; i < obj.imagens.length; i++) {

            if (obj.imagens[i].includes("upload_")) continue;
            files.push(obj.imagens[i]);
            objImgs.push(obj.imagens[i]);
        }

        obj.imagens = objImgs;

        setInputs(obj);
        mostrarImagensEnviadas(files);
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
        let tempLinksExternos = [];

        obj.premium = checkPremium;

        for (let i = 0; i < obj.imagens.length; i++) {

            if (obj.imagens[i].includes("upload_")) continue;
            tempLinksExternos.push(obj.imagens[i]);
        }

        if (imagensPic != null) obj.imagens = await enviarImagens();

        for (let i = 0; i < tempLinksExternos.length; i++) {

            obj.imagens.push(tempLinksExternos[i]);
        }

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

    const reloadInpusImgLinkExterno = (inpusImgLinkExterno) => {

        //let temp = [...inpusImgLinkExterno];
        
        //index += inputs.imagens.length;
        let gk = [];
        let penis = [];

        for (let i = 0; i < inputs.imagens.length; i++) {

            if (inputs.imagens[i].includes("upload_")) continue;
            penis.push(inputs.imagens[i]);
        }

        if (inpusImgLinkExterno.length != penis.length) {

            let index = inputs.imagens.length;

            for (let i = 0; i < inpusImgLinkExterno.length; i++) {

                index += 1;
                penis.push(inputs.imagens[index]);
            }
        }

        console.log(penis);

        for (let i = 0; i < inpusImgLinkExterno.length; i++) {

            gk.push(
            <Form.Group controlId="">
                <Form.Label>Link Externo</Form.Label>
                <Form.Control type="text" placeholder="Link Externo" name="linkExterno"
                onChange={changeLinkExterno} id={i} value={penis[i]} />
            </Form.Group>
            );
        }

        /*for (let i = 0; i < inputs.imagens.length; i++) {

            if (inputs.imagens[i].includes("upload_")) index += 1;
        }

        temp.push(
        <Form.Group controlId="">
            <Form.Label>Link Externo</Form.Label>
            <Form.Control type="text" placeholder="Link Externo" name="linkExterno"
            onChange={changeLinkExterno} id={index} value={inputs.imagens[index]} />
        </Form.Group>
        );*/

        setInpusImgLinkExterno(gk);
        mostrarImagensEnviadas(inputs.imagens);
    }

    const changeLinkExterno = (e) => {

        //reloadInpusImgLinkExterno(inpusImgLinkExterno);

        let val = e.target.value;
        let ips = {...inputs};
        let index = parseInt(e.target.id);

        //console.log(ips.imagens);

        ips.imagens[index] = val;
        setInputs(ips);
        if (ips.imagens[index].includes("http")) {
            
            mostrarImagensEnviadas(ips.imagens);
            reloadInpusImgLinkExterno(inpusImgLinkExterno);
        }
    }

    const addInpusImgLinkExterno = () => {

        let temp = [...inpusImgLinkExterno];
        let index = temp.length;
        //index += inputs.imagens.length;

        for (let i = 0; i < inputs.imagens.length; i++) {

            if (inputs.imagens[i].includes("upload_")) index += 1;
        }

        temp.push(
        <Form.Group controlId="">
            <Form.Label>Link Externo</Form.Label>
            <Form.Control type="text" placeholder="Link Externo" name="linkExterno"
            onChange={changeLinkExterno} id={index} value={inputs.imagens[index]} />
        </Form.Group>
        );

        setInpusImgLinkExterno(temp);
        reloadInpusImgLinkExterno(temp);
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
                    //value={inputs.premium}
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