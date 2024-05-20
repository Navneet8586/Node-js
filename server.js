const express=require('express');
const mysql=require('mysql2');

const app=express();
const cors=require('cors');


const port=process.env.PORT || 3000;

const pool=mysql.createPool({
    connectionLimit:10,
    host:'localhost',
    user:'root',
    password:'Monika85@%',
    database:'laundry_rating'
});
app.use(cors());
app.use(express.json());

app.get('/ratings',(req,res)=>{
    pool.query('SELECT * from Rating',(error,result)=>{
        if(error){
            console.log('error is there',error);
            res.status(500).json({
                error:'Internal Server Error'
            });
        }else{
            res.json(result);
        }
    })
});

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})