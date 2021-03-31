const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const checkLogin = require('./middlewares/auth.mdw')
const User = require('./models/user.model');

const app = express();

app.use(morgan('dev'));
app.use(cors());
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

app.use('/api/listfilms', checkLogin, require('./routes/film.route'));
app.use('/api/customer', require('./routes/customer.route'));

app.use('/private/:token', checkLogin,
    (req, res) => {
        res.json("dang nhap thanh cong");
    })

app.post('/signin', async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const userlogin = await User.findOne(username);
    if (userlogin) {
        const check = await bcrypt.compare(password, userlogin.PassWord);
        if (check) {
            const accessToken = jwt.sign({ Id: userlogin.User_Id }, 'SECRET_KEY', { expiresIn: 10 * 60 });
            res.json({
                authenticated: true,
                accessToken,
                list: userlogin,
            });
        }
        else {
            res.json({
                authenticated: false
            });
        }
    } else {
        res.json({
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



const PORT = process.env.PORT || 3000;


app.listen(PORT, function () {
    console.log("Server is running !");
})