let mongoose = require('mongoose')
let bcrypt = require('bcrypt-nodejs')
let userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: String,
  roles: [String]
})

userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
}

userSchema.methods.validPassword = (attemptPassword, hashedUserPassword) => {
  return bcrypt.compareSync(attemptPassword, hashedUserPassword)
}

module.exports = mongoose.model('User', userSchema)
