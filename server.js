
// const express=require('express');
// const bodyParser=require('body-parser');
// const cors=require('cors');

// const multer=require('multer');

// const path=require('path')

// //configere multer

// const multer = require("multer");

// const storage=multer.diskStorage({
//    destination:function(req,file,cd ){
//       cd(null,'uploads/');
//    },
//    filename:function(req,file,cd ){
//       cd(null,Date.now() +Path2D.extname(file.orginalname))
//    }
// })

// const upload=multer({storage:storage});

// app.use(express.json());
// let employees=[];

// app.post('/uploade', upload.single('image'),(req,res)=>{
//    try {
//       const {name}=req.body;
//       const image=req.file.filename;
//       employees.push({name,image});
      
//    } catch (error) {
      
//    }
// })
