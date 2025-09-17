const express = require('express')
const session = require('express-session')
const Filestore = require('session-file-store')(session)
const flash = require('express-flash')
const conn = require('./db/conn')
const exphbs = require('express-handlebars')
require('dotenv').config();
const toughtRouter = require('./routes/toughtRouter')
const authRouter = require('./routes/authRouter')

const port = process.env.PORT;
const app = express()

const hbs = exphbs.create({
    partialsDir: ['views/partials']
})
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'))

app.use(session({
    name: "Session",
    secret: "nosso_secret",
    resave: false,
    saveUninitialized: false,
    store: new Filestore({
        logFn: () => {

        },
        path: require('path').join(require('os').tmpdir(), 'sessions')
    }),
    cookie: {
        secure: false,
        maxAge: 360000,
        expires: new Date(Date.now() + 360000),
        httpOnly: true
    }
}))


app.use(flash())

app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session
    }

    next()
})

const Tought = require('./models/Tought')
const User = require('./models/User');

app.use('/toughts', toughtRouter)
app.use('/auth', authRouter)

conn.sync().then( () => {
    app.listen(port, () => console.log(`Run on port ${port}`))
}).catch( (err) => console.log(err));

