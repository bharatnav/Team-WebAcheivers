const express = require("express");
const path =require("path");
const app = express();
const hbs =require("hbs");
const cons = require("consolidate");

require("./db/conn");
const Register = require("./models/registers");
const { isWindows } = require("nodemon/lib/utils");
const { Router } = require("express");
const port = process.env.PORT || 8000;
  

const template_path = path.join(__dirname,"../public");
const static_path = path.join(__dirname,"../public/views");
const partials_path = path.join(__dirname,"../templates/partials");

app.engine('html',cons.swig);
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
app.set("view engine",'html');
app.set("views",template_path);
hbs.registerPartials(partials_path);

app.get("/",function(req,res){
    res.render("index");
});
/*app.get(`${__dirname}/views/register.html`,function(req,res){
    res.render("register");
})*/
app.get('/register', function (req, res,html) {
    res.sendFile(path.join(__dirname,'../public/views/register.html'));
   });
app.post("/register",async(req,res)=>{
    try {
       const registerEmployee = new Register({
            username : req.body.txt ,
            creatorname : req.body.creator ,
            email : req.body.email ,
            password : req.body.pswd ,
            description : req.body.area
       })
       const registered = await registerEmployee.save();
       res.status(201).render("index");
    } catch (error) {
        res.status(400).render("404page", {title:"404 not found",
        customstyle: `<link rel="stylesheet" href="/css/customstyle.css">`});
    }
});

app.listen(port,function(){
    console.log(`server is running at port no ${port} `);
});