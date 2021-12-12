const express = require('express')
const app = express()
const path = require('path')
var nodemailer = require('nodemailer');

const cors = require('cors');
const connect_db = require('./connect_db')
const session = require('express-session')
const flash = require('connect-flash')
const upload = require('express-fileupload')
app.use(express.static("public"));
app.use(upload())
app.set('views', path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(cors());
app.use(express.json());
app.use(session({
    secret:"23asdase2A",
    cookie:{maxAge:6000},
    resave:false,
    saveUninitialized:false
}))

 


app.use(flash())

connect_db()


//apis

const user = require('./routes/apis/user')
app.use('/apis/user',user)

//clubs
const clubs = require('./routes/apis/clubs')
app.use('/apis/clubs',clubs)


//players
const players = require('./routes/apis/player')
app.use('/apis/players',players)

//coaches
const coaches = require('./routes/apis/coaches')
app.use('/apis/coaches',coaches)

//admin

const admin_user = require('./routes/admin/user')
app.use('/',admin_user)

const admin_home = require('./routes/admin/home')
app.use('/',admin_home)

const admin_sports_interest = require('./routes/admin/sports_interest')
app.use('/sports_interest',admin_sports_interest)

const admin_pictures = require('./routes/admin/pictures')
app.use('/pictures',admin_pictures)


const admin_courts = require('./routes/admin/courts')
app.use('/courts',admin_courts)


const admin_club = require('./routes/admin/club')
app.use('/clubs',admin_club)



const admin_account = require('./routes/admin/account')
app.use('/account',admin_account)



let host;
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
   host= add
   console.log("Your Host is "+add)
})

const port = process.env.PORT || 5000;

app.listen(port,host, () => {
    console.log(`Server is running on port: ${port}`);
});

