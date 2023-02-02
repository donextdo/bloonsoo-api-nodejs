import checkout from '../models/checkout.js'

exports.createCheckout = async (req, res) => {
  const newCheckout = new checkout({
    fullName:req.body.fullName,
    email:req.body.email,
    nameOnCard:req.body.nameOnCard,
    address:req.body.address,
    city:req.body.city,
    state:req.body.state,
    zip:req.body.zip,
    creditCardNumber:req.body.creditCardNumber,
    expMonth:req.body.expMonth,
    expYear:req.body.expMonth,
    cvv:req.body.cvv
  });
  try {
    await newCheckout.save();
    res.status(201).send(newCheckout);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getCheckouts = async (req, res) => {
  try {
    const checkouts = await checkout.find({});
    res.status(200).send(checkouts);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getCheckout = async (req, res) => {
  try {
    const checkoutData = await checkout.findById(req.params.id);
    if (!checkoutData) {
      return res.status(404).send('The checkout information with the given ID was not found.');
    }
    res.status(200).send(checkoutData);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateCheckout = async (req, res) => {
  try {
    const checkoutData = await checkout.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!checkoutData) {
      return res.status(404).send('The checkout information with the given ID was not found.');
    }
    res.status(200).send(checkoutData);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteCheckout = async (req, res) => {
  try {
    const checkout = await Checkout.findByIdAndDelete(req.params.id);
    if (!checkout) {
      return res.status(404).send();
    }
    res.send(checkout);
  } catch (error) {
    res.status(500).send(error);
  }
};


export default {
  createCheckout,
  getCheckouts,
  getCheckout,
  updateCheckout,
  deleteCheckout
}
