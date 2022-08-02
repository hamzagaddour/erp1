const { ParamPDF, validateParamPdf } = require('../Models/ParamHederFoterPDF')
const storage = require('../helpers/storage');
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

    const ParamHederFoterPDF = await ParamPDF.findOne({ _id: req.params.id })

    return res.send({ status: true, resultat: ParamHederFoterPDF })

})




router.post('/newParamPDF',storage, async (req, res) => {

    const { adresseEmail1 } = req.body;
    const { adresseEmail2 } = req.body;
    const { numTel1 } = req.body;
    const { numTel2 } = req.body;
    const { adresse } = req.body;
    const { name } = req.body;
    const imagePath = 'http://localhost:3000/images/' + req.file.filename;
    const ParamHederFoterPDF = new ParamPDF({
        adresseEmail1,
        adresseEmail2,
        numTel1,
        numTel2,
        adresse,
        name,
      imagePath,
    });

    const result = await ParamHederFoterPDF.save()

    console.log(result)
    return res.send({ status: true, resultat: result })
})
/* ////////////modifier////////////////////////// */

router.post('/modifierParamPDF/:id',storage, async (req, res) => {
   
   


    const { nomsociale } = req.body;
    const { adresseEmail } = req.body;
    const { numTel1 } = req.body;
    const { numTel2 } = req.body;
    const { numFax } = req.body;
    const { adresse } = req.body;
    const { matriculefisc } = req.body;
    const { rib } = req.body;
    
    const { name } = req.body;
    
    var paramHederFoterPDF = {
        nomsociale,
        adresseEmail,
        numTel1,
        numTel2,
        numFax,
        adresse,
        matriculefisc,
        rib,
        name,
    }
    
    if(req.file){
        const imagePath = 'http://localhost:3000/images/' + req.file.filename;
        paramHederFoterPDF = {
            nomsociale,
            adresseEmail,
            numTel1,
            numTel2,
            numFax,
            adresse,
            matriculefisc,
            rib,
            name,
          imagePath,
        }
    }
   
    console.log(paramHederFoterPDF)

  let id = req.params.id

  const param = await ParamPDF.findById(id)

  console.log(param)


  console.log(id)

  try {
    // This part was changed *****

    await ParamPDF.findByIdAndUpdate(id, paramHederFoterPDF)
    res.json(' changed')

    // *******
  } catch (error) {
    console.log(error.message)
  }
})



/* get all ************************************************************* */
router.post('/getAllParametres', verifytoken, async (req, res) => {

    const ParamHederFoterPDFs = await ParamPDF.find({})

    return res.send({ status: true, ParamHederFoterPDFs: ParamHederFoterPDFs })
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

router.post('/listParamPDF', async (req, res) => {

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
        result = await ParamPDF.paginate({ $and: listFilter }, options)
    } else if (listFilter.length == 1) {
        result = await ParamPDF.paginate(listFilter[0], options)
    } else {
        result = await ParamPDF.paginate({}, options)
    }

    console.log(result)
    return res.send({ status: true, resultat: result, request: req.body })

})

module.exports.routerParamPDF = router