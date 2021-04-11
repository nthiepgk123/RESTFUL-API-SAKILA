const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Randomstring = require('randomstring');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const checkLogin = require('./middlewares/auth.mdw')
const User = require('./models/user.model');
const Auth = require('./routes/auth.route');
const config_fb = require('./middlewares/config.mdw');


const app = express();
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Methods", 'PUT', 'POST', 'DELETE', 'OPTIONS');
//     next();
// });

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.get('/', async function (req, res) {
    res.json(
        {
            message: "connect nodejs",
        }
    );
})


app.use('/test', require('./routes/auth.route'));
app.use('/api/listfilms', checkLogin, require('./routes/film.route'));
app.use('/api/customer', require('./routes/customer.route'));

app.use('/private/:token', checkLogin,
    (req, res) => {
        res.json("dang nhap thanh cong");
    })

passport.use(new FacebookStrategy({
    clientID: config_fb.facebook_key,
    clientSecret: config_fb.facebook_secret,
    callbackURL: config_fb.callback_url
},
    function (accessToken, refreshtoken, profile, cb) {
        return cb({ message: 'ok' });
    }
))

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
        res.json({ mes: "ok" });
    }
);

app.post('/signin', async function (req, res) {
    const { username, password } = req.body;
    console.log(username, password);

    const userlogin = await User.findOne(username);
    if (userlogin) {
        const check = await bcrypt.compare(password, userlogin.PassWord);
        if (check) {
            const accessToken = jwt.sign({ Id: userlogin.User_Id }, 'SECRET_KEY', { expiresIn: 10 * 60 });
            const refreshtoken = Randomstring.generate();
            const token = await User.updateRefreshToken(userlogin.User_Id, refreshtoken);
            res.status(200).json({
                authenticated: true,
                accessToken,
                refreshtoken,
            });
        }
        else {
            res.status(200).json({
                authenticated: false
            });
        }
    } else {
        res.status(200).json({
            authenticated: false
        });
    }
})


app.post('/signup', async (req, res) => {
    const newUser = req.body;
    const hashpass = await bcrypt.hash(newUser.PassWord, 10);
    newUser.PassWord = hashpass;
    const result = await User.addUser(newUser);
    if (result) {
        res.json({ message: "dang ky Thanh cong !" });
    } else {
        res.json({ message: "dang ky that bai" });
    }
})

app.use('/refreshtoken', async function (req, res) {
    const { accessToken, refreshtoken } = req.body;
    const { Id } = jwt.verify(accessToken, 'SECRET_KEY', { ignoreExpiration: true });
    const result = await User.newRefreshToken(Id, refreshtoken);
    if (result) {
        const token = jwt.sign({ Id: Id }, 'SECRET_KEY', { expiresIn: 60 * 10 });
        res.json({
            refreshtoken,
            token
        })
    } else {
        res.status(400).json({
            message: "loi refresh token"
        })
    }
})

// bat nhung trang ko dung url
app.use(function (req, res, next) {
    res.status(404).json({
        "err_message": "trang web khong ton tai."
    })
})
// khi bi loi se chay lenh nay
app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500).send({
        "err_message": "web error"
    });
})


const PORT = process.env.PORT || 4040;


app.listen(PORT, function () {
    console.log("Server is running !");
})