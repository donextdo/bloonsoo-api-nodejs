const Subscribe = require("../models/subscribe");

const nodemailer = require("nodemailer");


const addSubscribe = async (req, res) => {
 
  const email = req.body.email;
  const date = new Date();
 
  const subscribe = new Subscribe({
    email,
    date,
   
  });
  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    // Send the email
    await transporter.sendMail({
        from:  process.env.EMAIL_FROM_SUBSCRIBE,
        to: email,
        subject: 'Thanks for subscribing!',
        text: 'You have successfully subscribed to our newsletter.',
      });
    
    let response = await subscribe.save();
    if (response) {
      return res.status(200).send({ message: "Subscription successful" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    console.log(err);
    // logger
    let response = await subscribe.save();
    if (response) {
        return res.status(400).send({ message: "Subscription added" });
      }
    
  }
};

const getAllCoupen = async (req, res) => {
//   try {
//     let coupons = await Coupon.find();
//     if (coupons) {
//       return res.json(coupons);
//     } else {
//       return res
//         .status(404)
//         .send({ message: "Error occured when retrieving coupons" });
//     }
//   } catch (err) {
//     return res.status(500).send({ message: "Internal server error" });
//   }
};


module.exports = {
 addSubscribe,
 getAllCoupen,
   
};