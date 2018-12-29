//jshint esversion:6

const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const app=express();
const _=require("lodash")
app.set("view engine", 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//create db
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});
//create schema
const articleSchema={
    title:{type:String,required:true},
    content:String
}
//model for collection

const Article =mongoose.model("Article",articleSchema);

//get all articles


app.get("/articles",(req,res)=>{
    Article.find({},(err,results)=>{
        if(!err){
            res.send(results)
        }else{
            res.send(err)
        }
    })
})
app.post("/articles",(req,res)=>{

    const createContent= new Article({
        title:req.body.title,
        content:req.body.content
    })
    createContent.save((err)=>{
        if(!err){
            res.send("Successfully added a new article")
        }else{
            res.send(err)
        }
    });
    
    // Article.insertOne({})

})

app.delete("/articles",(req,res)=>{

    Article.deleteMany({},(err)=>{
        if(err){
            console.log(err)
        }else{
            console.log("Successfully deleted all articles")
        }
    })

})
////////////request targeting specific article////////////////
app.get('/articles/:title',(req,res)=>{
    
    Article.findOne({title:req.params.title},(err,result)=>{
        if(result){
            res.send(result)
        }else{
            res.send("No articles matching that article was found")
        }
    })
})

app.put('/articles/:title',(req,res)=>{
    Article.update({title:req.params.title},{
        title:req.body.title,content:req.body.content
    },{overwrite:true},(err)=>{
        if(!err){
            console.log("Updated article")
        }
    })
})
//update specific fields//

app.patch("/articles/:title",(req,res)=>{
    Article.update({title:req.params.title},{$set: req.body},(err,results)=>{
        if(err){
            res.send("Unable to update. Please try again later")
        }else{
            res.send("Successfully updated article")
        }
    })
})
////////////delete specific article//////////
app.delete("/articles/:title",(req,res)=>{
    Article.deleteOne({title:req.body.params.title},(err)=>{
        if(err){
            res.send("Unable to delete. Please try again later")
        }else{
            res.send("Successfully deleted article")
        }
    })
})






app.listen(3000,()=>{
    console.log("Server started on port 3000");
    
})