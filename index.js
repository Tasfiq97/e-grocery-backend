const express = require('express')
const app = express()
const cors=require("cors")
const mongoose=require("mongoose")
const port = 5000
require('dotenv').config()

const stripe = require("stripe")('sk_test_51JwMUVBUqhp5H3cVeXGDLjMyDoggeCYvyoLtFNmXoV63aJadyGPC29eX85YGvmnOQR87xGMhKN2vn3eJqeyLwHvg00FQgoz5iq');

app.use(cors());
 app.use(express.json())

//  database connection 

 mongoose.connect("mongodb://localhost:27017/e-commerce").then(()=>{
    console.log("database connection successful")
});



// orders 

const OrderSchema=mongoose.Schema({
   
    tax:{
        type: Number,
        required:true,
        
    },
    total:{
        type:Number,
        required:true,
       
    },
    email:{
    type: String,
    required:true,
    
    },
},{
    timestamps:true,
})


const Orders= mongoose.model("Orders",OrderSchema);



// users schema 

const UsersSchema=mongoose.Schema({
   
    email:{
        type: String,
        required:true,
        
    },
    password:{
        
    },
    role:{
        type:String,
    }
   
},{
    timestamps:true,
})


const Users= mongoose.model("Users",UsersSchema);



app.get("/orders",async(req,res)=>{
 try {
     const result= await Orders.find({});
     res.status(200).json({
        data:result
     })
 } catch (error) {
    
 }
})

app.post("/orders",async(req,res,next)=>{
   try {
    const result= await Orders.create(req.body);
    res.status(200).json({
        status:200,
        message:"order added successful",
        data:result
    })

    
   } catch (error) {
    res.status(400).json({
        status:400,
        message:"fail",
        error:error.message
    })
   }
})




app.post("/users",async(req,res)=>{
    try {
        const result= await Users.create(req.body);
        res.status(200).json({
            status:200,
            message:"users added successful",
            data:result
        })
    
        
       } catch (error) {
        res.status(400).json({
            status:400,
            message:"fail",
            error:error.message
        })
       }
})


app.get("/users/:email",async(req,res)=>{
    try {
       const email= req.params.email;
       const query={email:email};
       const result= await Users.find(query);
      const user=result[0];
let isAdmin=false;
let isGovt=false
if(user.role==="admin"){
 isAdmin=true

}
res.json ({admin:isAdmin})


    } catch (error) {
        
    }
})
app.get("/users/govt/:email",async(req,res)=>{
    try {
       const email= req.params.email;
       const query={email:email};
       const result= await Users.find(query);
      const user=result[0];
let isGovt=false
if(user.role==="govt"){
 isGovt=true

}
res.json ({govt:isGovt})


    } catch (error) {
        
    }
})




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

