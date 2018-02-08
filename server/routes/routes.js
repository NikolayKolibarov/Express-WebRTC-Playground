let users = require('../routes/users')

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.render('home', {title: 'Home'})
  })

  app.use('/users', users)
}
