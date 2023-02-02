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
  cvv: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', async function (next) {
  if(!this.isModified('cvv')) {
      return next()
  }

  const hash = await bcrypt.hash(this.cvv, 10)

  this.cvv = hash

  next()
})

UserSchema.methods.isValidPCvv = async function (
  cvv
){
  return await bcrypt.compare(cvv, this.cvv)
}

const checkout = mongoose.model('checkout', checkoutSchema);

export default checkout;
