const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');

const checkLogin = require('./middlewares/checklogin.mdw')
const User = require('./models/user.model');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.json(
        {
            message: "connect nodejs"
        }
    );
})

app.use('/api/listfilms', require('./routes/film.route'));
app.use('/api/customer', require('./routes/customer.route'));

app.use('/private/:token', checkLogin,
    (req, res) => {
        res.json("dang nhap thanh cong");
    })

app.post('/signin', async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const acceptUser = await User.findOne(username, password);
    if (acceptUser) {
        const token = jwt.sign({ Id: acceptUser[0].User_Id, UserName: acceptUser[0].UserName }, 'password');
        res.json({
            message: "Thanh cong !",
            token: token,
            list: acceptUser,
        });
    }
    else {
        res.json("khong tim thay");
    }
})

app.post('/signup', (req, res) => {
    const user = {
        username: req.body.user,
        password: req
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