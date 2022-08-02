const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const cors = require("cors");
const mongoose = require("mongoose")
const path = require('path');


app.use(cors());

const { routerTransporteur } = require("./Routes/transporteurRoute")
const { routerTypeDepartement } = require("./Routes/typeDepartementRoute")

const { routerParamLiv } = require("./Routes/paramlivRoute")
const { routerParamPDF } = require("./Routes/ParamHederFoterPDFRoute")



const { routerUtilisateur } = require("./Routes/utilisateurRoute")













mongoose.connect("mongodb://localhost/shopBD", { useUnifiedTopology: true, useNewUrlParser: true })
.then(console.log("connected to mongodb"))
.catch(err => console.log(err))

 /*mongoose.connect("mongodb://localhost/shopBD", { useUnifiedTopology: true, useNewUrlParser: true, username: "JR-Test", password: "test" })
 .then(console.log("connected to mongodb"))
 .catch(err => console.log(err))*/

app.use(express.json())

/*var allowCrossDomain = function(req, res, next) {
	console.log("Bonjour")
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	next();
}*/

//app.use(cors());
//app.use(allowCrossDomain);





app.use('/utilisateurs', routerUtilisateur)

app.use('/transporteurs', routerTransporteur)
app.use('/parametrePdf', routerParamPDF)

app.use('/paramliv', routerParamLiv)


app.use('/images', express.static('images'));

app.listen(3000,() => {
    console.log("here is console for backend")
})






/*app.all('*', function (req, res) {
	res.sendFile(__dirname + "/public/index.html");
});

app.listen(process.env.PORT || 5000, () => {
	console.log("server conected to port 5000")
})*/
