const { ParamLiv, validateParamLivr } = require('../Models/paramLiv')
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var multer = require('multer');
const fs = require('fs');

var dateFormat = require('dateformat');

var ObjectId = require('mongodb').ObjectID;

router.get('/getById/:id', async (req, res) => {

    if (req.params.id == undefined || req.params.id == null || req.params.id == "") return res.status(400).send({ status: false })

    const paramliv = await ParamLiv.findOne({ _id: req.params.id })

    return res.send({ status: true, resultat: paramliv })

})

router.post('/getByidFormat/:idFormat/:typeDoc', async (req, res) => {

    // if (req.params.idFormat == undefined || req.params.idFormat == null || req.params.idFormat == "" || req.params.typeDoc == undefined || req.params.typeDoc == null || req.params.typeDoc == "" ) return res.status(400).send({ status: false })

    // const  paramliv = await ParamLiv.find({ idFormat: req.params.idFormat , typeDoc: req.params.typeDoc })
    
    // console.log("req.params.idFormat",req.params.idFormat)

    var sort = {}
    for (let key in req.body.orderBy) {
        if (Number(req.body.orderBy[key]) != 0) {
            sort[key] = req.body.orderBy[key]
        }
    }

    if (Object.keys(sort).length == 0) {
        sort = { createdAt: -1 }
    }

    var listFilter = []


    // req.body.search.idFormat = req.params.idFormat
    
    //  req.body.search.typeDoc = req.params.typeDoc



    var search = req.body.search

    for (let key in search) {
        if (search[key] != "") {
            var word1 = search[key].charAt(0).toUpperCase() + search[key].slice(1)
            var word2 = search[key].toUpperCase()
            var word3 = search[key].toLowerCase()
            var objet1 = {}
            objet1[key] = { $regex: '.*' + word1 + '.*' }

            var objet2 = {}
            objet2[key] = { $regex: '.*' + word2 + '.*' }

            var objet3 = {}
            objet3[key] = { $regex: '.*' + word3 + '.*' }

            listFilter.push({ $or: [objet1, objet2, objet3] })
        }
    }

    const options = {
        page: Number(req.body.page),
        limit: Number(req.body.limit),
        customLabels: myCustomLabels,
        //populate: 'client'
        sort: sort
    };
    // return res.send({ status: true, resultat: paramliv })
    var result = []

    if (listFilter.length > 1) {
        result = await ParamLiv.paginate({ $and: listFilter }, options)
    } else if (listFilter.length == 1) {
        result = await ParamLiv.paginate(listFilter[0], options)
    } else {
        result = await ParamLiv.paginate({}, options)
    }

    console.log("rrrr",result)
    return res.send({ status: true, resultat: result, request: req.body })
   

})


router.post('/newparamLiv', async (req, res) => {

    var body = req.body

    const paramliv = new ParamLiv(body);

    const result = await paramliv.save()

    console.log(result)
    return res.send({ status: true, resultat: result })
})
/* ////////////modifier////////////////////////// */


router.post('/modifierparamliv/:id', async (req, res) => {

    console.log("najla is in the backend");
    console.log(req.body);

    const paramliv = await ParamLiv.findById(req.params.id)
    console.log(req.params.id);
    console.log("ParamLiv");
    console.log(paramliv);

    if (!paramliv) {
        return
        res.status(401).send({ status: false })
    }

    const result = await ParamLiv.findOneAndUpdate({ _id: req.params.id }, req.body)

    const paramliv2 = await ParamLiv.findById(req.params.id);
    console.log(paramliv2);

    return res.send({ status: true, resultat: paramliv2 })
})


/* get all ************************************************************* */
router.post('/getAllParametres', verifytoken, async (req, res) => {

    const paramLivs = await ParamLiv.find({})

    return res.send({ status: true, paramLivs: paramLivs })
})

function verifytoken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {

        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, 'secretkey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                req.user = authData;
                next();
            }
        });

    } else {
        console.log("etape100");
        res.sendStatus(401);
    }

}




const myCustomLabels = {
    totalDocs: 'itemCount',
    docs: 'itemsList',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'pageCount',
    pagingCounter: 'slNo',
    meta: 'paginator'
};

router.post('/listParamliv', async (req, res) => {

    //if(req.user.user.role != "admin" ) return res.status(400).send({status:false})

    var sort = {}
    for (let key in req.body.orderBy) {
        if (Number(req.body.orderBy[key]) != 0) {
            sort[key] = req.body.orderBy[key]
        }
    }

    if (Object.keys(sort).length == 0) {
        sort = { createdAt: -1 }
    }

    var listFilter = []

    var search = req.body.search

    for (let key in search) {
        if (search[key] != "") {
            var word1 = search[key].charAt(0).toUpperCase() + search[key].slice(1)
            var word2 = search[key].toUpperCase()
            var word3 = search[key].toLowerCase()
            var objet1 = {}
            objet1[key] = { $regex: '.*' + word1 + '.*' }

            var objet2 = {}
            objet2[key] = { $regex: '.*' + word2 + '.*' }

            var objet3 = {}
            objet3[key] = { $regex: '.*' + word3 + '.*' }

            listFilter.push({ $or: [objet1, objet2, objet3] })
        }
    }

    const options = {
        page: Number(req.body.page),
        limit: Number(req.body.limit),
        customLabels: myCustomLabels,
        //populate: 'client'
        sort: sort
    };

    var result = []

    if (listFilter.length > 1) {
        result = await ParamLiv.paginate({ $and: listFilter }, options)
    } else if (listFilter.length == 1) {
        result = await ParamLiv.paginate(listFilter[0], options)
    } else {
        result = await ParamLiv.paginate({}, options)
    }

    console.log(result)
    return res.send({ status: true, resultat: result, request: req.body })

})

module.exports.routerParamLiv = router