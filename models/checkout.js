import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const checkoutSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  nameOnCard: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  creditCardNumber: {
    type: String,
    required: true
  },
  expMonth: {
    type: String,
    required: true
  },
  expYear: {
    type: String,
    required: true
  },

});

checkoutSchema.pre('save', async function (next) {
  if(!this.isModified('creditCardNumber')) {
      return next()
  }

  const hash = await bcrypt.hash(this.creditCardNumber, 10)

  this.creditCardNumber = hash

  next()
})

checkoutSchema.methods.isValidcreditCardNumber = async function (
  creditCardNumber
){
  return await bcrypt.compare(creditCardNumber, this.creditCardNumber)
}

const checkout = mongoose.model('checkout', checkoutSchema);

export default checkout;
