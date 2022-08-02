const {TypeDepartement, validateTypeDepartement} =require('../Models/typeDepartementModel')
const express=require('express')
const router=express.Router()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var multer = require('multer');
const fs = require('fs');

var dateFormat = require('dateformat');

var ObjectId = require('mongodb').ObjectID;


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null,  file.originalname + Date.now())
    }
})


var upload = multer({ storage: storage })


router.post('/upload',upload.array('myFiles'),async(req,res)=>{
    const files = req.files
    let arr=[];
    files.forEach(element => {
        arr.push(element.path)
    })
    return res.send(arr)
})




router.post('/newTypeDepartement', async(req,res)=>{

    var body = req.body 

    const typeDepartement=new TypeDepartement(body);

    const result=await typeDepartement.save()

    return res.send({status:true,resultat:result})
})




router.post('/modifierTypeDepartement/:id', async(req,res)=>{

    const typeDepartement = await TypeDepartement.findById(req.params.id)

    if(!typeDepartement) return res.status(401).send({status:false})

    const result = await TypeDepartement.findOneAndUpdate({_id:req.params.id}, req.body)

    const typedepartement2 = await TypeDepartement.findById(req.params.id)

    return res.send({status:true,resultat:typeDepartement2})
})



router.post('/deleteTypeDepartement/:id', async(req,res)=>{

    //if(req.user.user.role != "admin") return res.status(401).send({status:false})

    const typeDepartement = await TypeDepartement.findById(req.params.id)

    if(!typeDepartement) return res.status(401).send({status:false})


    if(await TypeDepartement.findOneAndDelete({_id:req.params.id})){
        return res.send({status:true})
    }else{
        return res.send({status:false})
    }

})


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





 router.post('/listTypeDepartements', async(req,res)=>{
  
    //if(req.user.user.role != "admin" ) return res.status(400).send({status:false})
  
    var sort = {}
    for( let key in req.body.orderBy){
        if(Number(req.body.orderBy[key]) != 0){
             sort[key] = req.body.orderBy[key]
        }  
    }

    if(Object.keys(sort).length == 0){
        sort = {createdAt:-1}
    }
   
    var listFilter =[]
    
    var search = req.body.search
    
    for( let key in search){
        if(search[key] != ""){
            var word1 = search[key].charAt(0).toUpperCase() + search[key].slice(1)
            var word2 = search[key].toUpperCase()
            var word3 = search[key].toLowerCase()
            var objet1 = {}
            objet1[key] = { $regex: '.*' + word1 + '.*' }
           
            var objet2 = {}
            objet2[key] = { $regex: '.*' + word2 + '.*' }
            
            var objet3 = {}
            objet3[key] = { $regex: '.*' + word3 + '.*' }

            listFilter.push({$or:[objet1, objet2, objet3]})
        }  
    }

    const options = {
        page: Number(req.body.page),
        limit: Number(req.body.limit),
        customLabels: myCustomLabels,
        //populate: 'client'
        sort:sort
    };

    var result = []
    
    if(listFilter.length > 1){
      result = await  TypeDepartement.paginate({$and:listFilter}, options) 
    }else if(listFilter.length == 1){
      result = await  TypeDepartement.paginate(listFilter[0], options)
    }else{
      result = await  TypeDepartement.paginate({}, options)
    }

    return res.send({status:true, resultat:result, request:req.body})
    
})



router.get('/getById/:id', async(req,res)=>{

    if(req.params.id == undefined || req.params.id == null || req.params.id == "") return res.status(400).send({status:false})

    const typeDepartement = await TypeDepartement.findOne({_id:req.params.id})

    return res.send({status:true,resultat:typeDepartement})

})

router.post('/getAllParametres', verifytoken, async(req,res)=>{
    
    const typeDepartements = await TypeDepartement.find({})
    
    return res.send({status:true, typeDepartements:typeDepartements}) 
})

function verifytoken(req, res, next){
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){

        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, 'secretkey', (err, authData) => {
            if(err){
                res.sendStatus(403);
            }else{
                req.user = authData;
                next();
            }
        });

    }else{
        console.log("etape100");
        res.sendStatus(401);
    }

}

module.exports.routerTypeDepartement=router
