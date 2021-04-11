const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get("/auth/facebook", function (req, res, next) {
    passport.authenticate('facebook')
});

router.get("/auth/facebook/callback", function (req, res, next) {
    passport.authenticate('facebook', { failureRedirect: "/login" }),
        function (req, res) {
            return res.json("ok");
        }
})


module.exports = router;