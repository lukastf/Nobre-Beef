
import formidable from 'formidable';

export const config = {
    api: {
      bodyParser: false,
    },
};

export default async (req, res) => {

    if(req.method === 'POST' /*&& req.query.produtos[0] === "produtoImg"*/) {
                
        //img
        const form = new formidable.IncomingForm();
        form.uploadDir = "./public/imgsProdutos/";
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {

            let temp = Object.values(files);
            let nome = [];

            //console.log(temp[0].path);

            for (let index = 0; index < temp.length; index++) {

                let t = temp[index].path.split("\\");
                t = t[2];
                nome.push(t);
            }

            //return;
            //let nome = files.images.path.split("\\");
            //nome = nome[2];
            //console.log(nome);
            res.status(200).json({ nome:nome, code: 200 });
        });
        
        return;
    }
}
