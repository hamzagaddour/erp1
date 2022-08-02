const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema
const Schema1 = mongoose.Schema

const schemaTypeDepartement=mongoose.Schema({
        libelle:{type:String,default: ""},
        icon:{type:String,default: 0}
       
    },
    { timestamps: true }
)

schemaTypeDepartement.plugin(mongoosePaginate);

schemaTypeDepartement.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const TypeDepartement = mongoose.model('TypeDepartement',schemaTypeDepartement)

function validateTypeDepartement(TypeDepartement){
    let schema = Joi.object({
        libelle:Joi.string().allow('', null),
        icon:Joi.string().allow('', null)
        
    })
    return schema.validate(TypeDepartement)
}
module.exports.TypeDepartement=TypeDepartement
module.exports.validateTypeDepartement=validateTypeDepartement



