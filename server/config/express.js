let express = require('express')
let bodyParser = require('body-parser')
let fileUpload = require('express-fileupload')
let session = require('express-session')
let hbs = require('express-handlebars')
let passport = require('passport')

module.exports = (config, app) => {
  app.set('views', config.rootPath + 'server/views')
  app.set('view engine', 'hbs')
  app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'master',
    layoutsDir: config.rootPath + 'server/views/layouts/'
  }))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(fileUpload())
  app.use(session({secret: 'nnk', saveUninitialized: false, resave: false}))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use((req, res, next) => {
    if (req.user) {
      res.locals.currentUser = req.user
    }

    next()
  })
  app.use('/public', express.static(config.rootPath + '/public'))
  app.use('/node_modules', express.static(config.rootPath + '/server/node_modules'))
  app.use('/bower_components', express.static(config.rootPath + '/server/bower_components'))
}
