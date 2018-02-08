let mongoose = require('mongoose')
let User = require('../models/User')

function showRegisterPage (req, res) {
  res.render('user-register', { title: 'Register', errors: req.session.errors })
  req.session.errors = null
}

function register (req, res) {
  let newUserData = req.body

  if (!newUserData.username || !newUserData.password || !newUserData.confirmPassword) {
    let errors = []

    if (!newUserData.username) {
      errors.push({ message: 'The username is required.' })
    }

    if (!newUserData.password) {
      errors.push({ message: 'The password is required.' })
    }

    if (!newUserData.confirmPassword) {
      errors.push({ message: 'The password confirmation is required.' })
    }

    req.session.errors = errors

    return res.redirect('/users/register')
  }

  if (newUserData.password == newUserData.confirmPassword) {
    let user = new User()
    user.username = newUserData.username
    user.password = user.encryptPassword(newUserData.password)
    user.save((err) => {
      let errors = []
      if (err) {
        switch (err.code) {
          case 11000:
            errors.push({ message: 'User with the same username already exists.' })
            req.session.errors = errors

            return res.redirect('/users/register')
          default:
            console.log(err.code)
            break
        }
      }

      req.logIn(user, (err, user) => {
        if (err) {
          console.log(err)
        }

        res.redirect('/')
      })
    })
  }
}

function showLoginPage (req, res) {
  res.render('user-login', { title: 'Login', errors: req.session.errors })
  req.session.errors = null
}

function login (req, res) {
  let possibleUser = req.body

  if (!possibleUser.username || !possibleUser.password) {
    let errors = []

    if (!possibleUser.username) {
      errors.push({ message: 'The username is required.' })
    }

    if (!possibleUser.password) {
      errors.push({ message: 'The password is required.' })
    }

    req.session.errors = errors

    return res.redirect('/users/login')
  }

  User.findOne({ username: possibleUser.username }, (err, user) => {
    if (err) {
      console.log(err)
    }

    if (user) {
      if (user.validPassword(possibleUser.password, user.password)) {
        req.logIn(user, (err, user) => {
          if (err) {
            console.log(err)
          }

          res.redirect('/')
        })
      } else {
        req.session.errors = [{ message: 'Username or password is incorrect.' }]

        res.redirect('/users/login')
      }
    } else {
      req.session.errors = [{ message: 'Username or password is incorrect.' }]

      res.redirect('/users/login')
    }
  })
}

function logout (req, res) {
  req.logout()
  res.redirect('/')
}

function showProfilePage (req, res) {
  let username = req.params.username

  User.findOne({ username: username }).exec((err, user) => {
    if (user) {
      res.render('user-profile', {
        title: 'Profile',
        user: user
      })
    } else {
      res.redirect('/')
    }
  })
}

function allAdmins (req, res) {
  User.find({ roles: 'Admin' }).exec((err, admins) => {
    res.render('user-admin-all', { title: 'All Admins', admins: admins, errors: req.session.errors })
    req.session.errors = null
  })
}

function addAdminRole (req, res) {
  let username = req.body.username

  User.findOne({ username: username }).exec((err, user) => {
    if (err) {
      console.log(err)
    }

    if (user) {
      let isAdmin = false
      for (let role of user.roles) {
        if (role == 'Admin') {
          isAdmin = true
        }
      }

      if (isAdmin) {
        req.session.errors = [{ message: 'User is already an admin.' }]
        res.redirect('/users/admins')
      } else {
        user.roles.push('Admin')

        user.save(err => {
          if (err) {
            console.log(err)
          }
        })

        console.log(user)
        res.redirect('/users/admins')
      }
    } else {
      req.session.errors = [{ message: 'No such user found.' }]
      res.redirect('/users/admins')
    }
  })
}

module.exports = {
  showRegisterPage,
  register,
  showLoginPage,
  login,
  logout,
  showProfilePage,
  allAdmins,
addAdminRole}
