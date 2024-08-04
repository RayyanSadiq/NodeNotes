require('dotenv').config();

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const connectDB = require('./server/config/db');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const app = express()
const port = process.env.PORT || 5000

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
        maxAge: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))
    } // 7 days in milliseconds
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))



//static files
app.use(express.static('public'))//

// Templating Engine
app.use(expressLayouts)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

// Routes
app.use('/', require('./server/routes/auth'))
app.use('/', require('./server/routes/index'))
app.use('/dashboard', require('./server/routes/dashboard'))

app.get('*', (req, res) => {
    res.status(404).render('404', {
        description: req.url,
        layout: '../views/layouts/main'
    })
    console.log('404 page')
})

/**  orginal code

    // connecting to database
    connectDB()

    // Server
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`)
    });

*/


// modified code for deploying on cyclic
// cyclic requires connecting to database FIRST
connectDB().then(() => {
    // then connect to Server after database connection
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`)
    });
})


