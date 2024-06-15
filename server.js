const express=require('express');
const mysql=require('mysql2');
// const nodemailer=require('nodemailer');
const sgMail=require('@sendgrid/mail');

const app=express();
const cors=require('cors');
//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


const port=process.env.PORT || 3000;
sgMail.setApiKey('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');


const pool=mysql.createPool({
    connectionLimit:10,
    host:'localhost',
    user:'root',
    password:'Monika85@%',
    database:'laundry_rating'
});
app.use(cors());
app.use(express.json());
app.use(express.static('laundry'));

app.post('/api/send-email',(req,res)=>{

    const {to,subject,text}=req.body;
    // const transporter=nodemailer.createTransport({
    //     service:'gmail',
    //     auth:{
    //         user:'grenocleaners@gmail.com',
    //         pass:'rahulRRR@9818'
    //     }
    // });

    // const mailOptions={
    //     from:'grenocleaners@gmail.com',
    //     to:to,
    //     subject:subject,
    //     text:text
    // }
    // transporter.sendMail(mailOptions,(error,info)=>{
    //     if(error){
    //         console.log(error);
    //     } else{
    //         console.log(info.response);
    //         res.send('Email sent');
    //     }
    // });

    const msg={
        to:to,
        from:'support@greenocleaner.in',
        subject:subject,
        text:text,
        html:'<p>Oye order ho gya</p>'
    }

    sgMail.send(msg).then(()=>{console.log('Email sent')}).catch((error)=>{console.error(error)});

});

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