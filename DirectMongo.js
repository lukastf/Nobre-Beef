const MongoClient = require('mongodb').MongoClient; 
const ObjectId = require('mongodb').ObjectId;

class DirectMongo {
    
    static getDatabase = async () => {
    
        try {
    
            const db = await MongoClient.connect("mongodb://root:easeShop123@localhost:27017/", 
            { useNewUrlParser: true, useUnifiedTopology: true });
            
            const close = () => {
                try {
                    return db.close()
                } catch (e) {
                    console.log(e);
                }
            }
        
            const obj = {
        
                db: db.db("nobreBeef"),
                close: close
            } 
        
            return obj;
    
        } catch (e) {
    
            console.log("não conseguiu conectar");
            return null;
        }
    
    }

    static createObj = (params) => {

        let obj = {...params}

        if (typeof params.sort == "string" && typeof params.break != "undefined") {
            
            
            let key = "";
            let value = 0;
            
            if (params.sort.includes("+")) {

                value = params.initialValue;
                value -= parseInt(params.break) * params.page;

                key = params.sort.replace("+", "");
                obj[key] = { $lte: value };
            }
            else if (params.sort.includes("-")) {

                //value = params.initialValue;
                value += parseInt(params.break) * params.page;

                key = params.sort.replace("-", "");
                obj[key] = { $gte: value };
            }
            
            
            delete obj._id;
            delete obj.sort;
            delete obj.break;
            delete obj.initialValue;
        }

        /*else if (typeof params.sort == "string" && params.sort.includes("-")) {

            key = params.sort.replace("-", "");
            value = 1;

        }*/
        
        else {
        //if(typeof params._id == "string") {

            //key = "_id";
            //value = -1;

            //console.log("queijo");
            //console.log(obj);

            obj._id = {$lte: ObjectId(params._id)};

            if (
                params._id === "" || 
                params._id === "undefined" || 
                typeof params._id === "undefined"
            ) {
                delete obj._id;
            }
    
        }

        delete obj.page;
        
        return obj;
    }

    static createObjOld = (params) => {

        params.dataInicio = parseInt(params.dataInicio);
        if (isNaN(params.dataInicio)) params.dataInicio = "";
    
        params.dataTermino = parseInt(params.dataTermino);
        if (isNaN(params.dataTermino)) params.dataTermino = "";
    
        let obj = {
            _id: {$lte: ObjectId(params._id)},
            nome: new RegExp(params.nome, "ig"),
            nomeEmpresa: new RegExp(params.nomeEmpresa, "ig"),
            categoria: params.categoria,
            dia: {$gt: params.dataInicio, $lt: params.dataTermino},
            _idParceiro: params._idParceiro,
            _idUsuario: params._idUsuario,
            status: {$ne:"Finalizado"}
        }
    
        // remover props undefined
    
        if (
            params._id === "" || 
            params._id === "undefined" || 
            typeof params._id === "undefined"
        ) {
            delete obj._id;
        }
    
        if (
            params.nome === "" || 
            params.nome === "undefined" || 
            typeof params.nome === "undefined"
        ) {
            delete obj.nome;
        }
    
        if (
            params.nomeEmpresa === "" || 
            params.nomeEmpresa === "undefined" || 
            typeof params.nomeEmpresa === "undefined"
        ) {
            delete obj.nomeEmpresa;
        }
    
        if (params.categoria == "Todos") params.categoria = "";
    
        if (
            params.categoria === "" || 
            params.categoria === "undefined" || 
            typeof params.categoria === "undefined"
        ) {
            delete obj.categoria;
        }
    
        if (
            params.dataInicio === "" || 
            params.dataInicio === "undefined" || 
            typeof params.dataInicio === "undefined"
        ) {
            delete obj.dia;
        }
    
        if (
            params.dataTermino === "" || 
            params.dataTermino === "undefined" || 
            typeof params.dataTermino === "undefined"
        ) {
            delete obj.dia;
        }
    
        if (
            params._idParceiro === "" || 
            params._idParceiro === "undefined" || 
            typeof params._idParceiro === "undefined"
        ) {
            delete obj._idParceiro;
        }
    
        if (
            params._idUsuario === "" || 
            params._idUsuario === "undefined" || 
            typeof params._idUsuario === "undefined"
        ) {
            delete obj._idUsuario;
        }

        if (
            params.status === "" || 
            params.status === "undefined" || 
            typeof params.status === "undefined" ||
            params.removerStatusFinalizado !== true
        ) {
            delete obj.status;
        }
    
        return obj;
    }

    static sort = (params) => {

        let sort = {};
        let key = params.sort;
        let value = -1;

        if (typeof params.sort == "string" && params.sort.includes("+")) {

            key = params.sort.replace("+", "");
            value = -1;
        }

        else if (typeof params.sort == "string" && params.sort.includes("-")) {

            key = params.sort.replace("-", "");
            value = 1;

        } else {

            key = "_id";
            value = -1;
        }

        sort[key] = value;

        return sort;
    }

    static search = (params) => {

        if (typeof params.searchProp == "string" && typeof params.search == "string") {

            if (isNaN(parseInt(params.search))) {
                
                params[params.searchProp] = new RegExp(params.search, "ig");
            }
            else if (params.searchProp == "dia") {

                let temp = params.search.split(".");

                temp[0] = parseInt(temp[0]);
                temp[1] = parseInt(temp[1]);
                temp[2] = parseInt(temp[2]);

                temp[1] -= 1;

                let dia = new Date(temp[2], temp[1], temp[0]);

                temp[0] += 1;

                let diaLimite = new Date(temp[2], temp[1], temp[0]);

                //dia = new RegExp(dia, "ig");

                params[params.searchProp] = {$gte: dia, $lte: diaLimite};
            }
            else {
                //params[params.searchProp] = new RegExp(params.search, "ig");
                params = {$where: "/^"+params.search+".*/.test(this."+params.searchProp+")"};
            }

            delete params.search;
            delete params.searchProp;
        }

        return params;
    }

    static getOne = async (collection, params) => {

        const objDb = await this.getDatabase();
        const db = objDb.db;
        
        try {

            let manterSenha = params.manterSenha;
            delete params.manterSenha;
    
            let obj = { _id: ObjectId(params._id) }
    
            // usuario check
            if (typeof params._id === 'undefined') obj = params;
    
            let res = await db.collection(collection).findOne(obj);
    
            if (manterSenha !== true && res != null) delete res.senha;
    
            return res;
    
        } catch (e) {
    
            console.log(e);
            return null;
            
        } finally {
    
            objDb.close();
        }
    }

    static getManyPagination = async (collection, params) => {

        const objDb = await this.getDatabase();
        const db = objDb.db;
    
        try {
    
            let itensPageControle = parseInt(params.itensPage);

            delete params.itensPage;
    
            let sort = this.sort(params);

            if (typeof params.sort == "string") {
                let initialValue = await db.collection(collection).find({}).sort(sort).limit(1).toArray() // for MAX
                params.initialValue = initialValue[0][Object.keys(sort)[0]];
                //console.log(params.initialValue);
                //db.collection.find().sort({age:+1}).limit(1) // for MIN
            }

            params = this.search(params);

            /*if (typeof params.searchProp == "string" && typeof params.search == "string") {

                if (isNaN(parseInt(params.search)))
                    params[params.searchProp] = new RegExp(params.search, "ig");
                else {
                    //params[params.searchProp] = new RegExp(params.search, "ig");
                    params = {$where: "/^"+params.search+".*//*.test(this."+params.searchProp+")"};
                }

                delete params.search;
                delete params.searchProp;
            }*/

            let obj = this.createObj(params);

            const res = await db.collection(collection)
                                .find(obj)
                                .sort(sort)
                                .project({_id:1})
                                .toArray();
    
            if (res.length === 0) return null;
    
            let pagination = [];
    
            let itensPage = 0;
    
            pagination.push(res[0]._id);
    
            for (let i = 0; i < res.length; i ++) {
    
                if (itensPage == itensPageControle) {
    
                    itensPage = 0;
    
                    pagination.push(res[i]._id);
                }
    
                itensPage++;
            }
    
            return pagination;
    
        } catch (e) {
    
            console.log(e);
            return null;
            
        } finally {
    
            objDb.close();
        }
    }

    static getMany = async (collection, params) => {

        const objDb = await this.getDatabase();
        const db = objDb.db;
    
        try {
    
            let itensPage = parseInt(params.itensPage);
            
            params._id = params.pageId;

            delete params.itensPage;
            delete params.pageId;

            let sort = this.sort(params);

            if (typeof params.sort == "string") {
                let initialValue = await db.collection(collection).find({}).sort(sort).limit(1).toArray() // for MAX
                params.initialValue = initialValue[0][Object.keys(sort)[0]];
                //console.log(params.initialValue);
                //db.collection.find().sort({age:+1}).limit(1) // for MIN
            }

            params = this.search(params);

            /*if (typeof params.searchProp == "string" && typeof params.search == "string") {
                
                if (isNaN(parseInt(params.search)))
                    params[params.searchProp] = new RegExp(params.search, "ig");
                else {
                    //params[params.searchProp] = new RegExp(params.search, "ig");
                    params = {$where: "/^"+params.search+".*//*.test(this."+params.searchProp+")"};
                }

                delete params.search;
                delete params.searchProp;
            }*/

            let obj = this.createObj(params);
        
            return await db.collection(collection)
                            .find(obj)
                            .sort(sort)
                            .project({carrinho:0, favoritos:0, senha:0})
                            .limit(itensPage)
                            .toArray();
    
        } catch (e) {
    
            console.log(e);
            return null;
    
        } finally {
    
            objDb.close();
        }
    }

    static postOne = async (collection, obj) => {

        const objDb = await this.getDatabase();
        const db = objDb.db;
        
        try {
    
            delete obj._id;
    
            return await db.collection(collection).insertOne(obj);
    
        } catch (e) {
    
            console.log(e);
            return null;
    
        } finally {
    
            objDb.close();
        }
    }

    static putOne = async (collection, obj) => {

        const objDb = await this.getDatabase();
        const db = objDb.db;
    
        try {
    
            obj._id = ObjectId(obj._id);

            return await db.collection(collection).updateOne({ "_id":obj._id }, {$set: obj});
    
        } catch (e) {
    
            console.log(e);
            return null;
    
        } finally {
            objDb.close();
        }
    }

    static deleteOne = async (collection, params) => {

        const objDb = await this.getDatabase();
        const db = objDb.db;
    
        try {
    
            let obj = { _id: ObjectId(params._id) }
    
            return await db.collection(collection).deleteOne(obj);
    
        } catch (e) {
    
            console.log(e);
            return null;
            
        } finally {
    
            objDb.close();
        }
    }

    static deleteMany = async (collection, params) => {

        const objDb = await this.getDatabase();
        const db = objDb.db;
    
        try {
    
            let obj = params;
    
            return await db.collection(collection).deleteMany(obj);
    
        } catch (e) {
    
            console.log(e);
            return null;
            
        } finally {
    
            objDb.close();
        }
    }
}

module.exports = DirectMongo;
