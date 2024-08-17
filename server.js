const express=require('express');
const mysql=require('mysql2');
const sgMail=require('@sendgrid/mail');

const app=express();
const cors=require('cors');
const dotenv=require('dotenv');

const port=process.env.PORT || 3000;
// const envFile='.env';
// dotenv.config({path:envFile})
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const pool=mysql.createPool({
    connectionLimit:10,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_DATABASE
});
app.use(cors());
app.use(express.json());
app.use(express.static('laundry'));

app.post('/api/send-email',(req,res)=>{

    const {to,subject,text}=req.body;
    const msg={
        to:to,
        from:'support@greenocleaner.in',
        subject:subject,
        html:text
    }

    sgMail.send(msg)
    .then(()=>{
        console.log('Email sent');
        res.status(200).json({message:'Delivered the mail'});
    })
    .catch((error)=>{console.error(error)});

});

app.post('/api/contact-us',(req,res)=>{

    const {to,subject,text}=req.body;
    const msg={
        to:to,
        from:'support@greenocleaner.in',
        subject:subject,
        html:text
    }

    sgMail.send(msg)
    .then(()=>{
        console.log('Email sent');
        res.status(200).json({message:'Delivered the mail'});
    })
    .catch((error)=>{console.error(error)});

});

app.get('/api/ratings',(req,res)=>{
    pool.query('SELECT * from Rating ORDER BY time DESC LIMIT 10',(error,result)=>{
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
//
app.get('/api/overall-ratings',(req,res)=>{
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

// Endpoint to handle form submission
app.post('/api/submit-rating', (req, res) => {
    const { userName, userRating, userFeedback } = req.body;
    const query = 'INSERT INTO rating (user_name,rating,message) VALUES (?, ?, ?)';
  
    pool.query(query, [userName, userRating, userFeedback], (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({
            error:'Error inserting data'
        });
        return;
      }
      res.status(200).json({message:'Data inserted successfully'});
    });
  });

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})
