const express = require("express");

const customer = require("../models/customer.model");

const router = express.Router();

router.get("/", async function (req, res) {
    const list_customer = await customer.all();
    if (list_customer.length == 0) {
        res.status(304).json("NULL");
    }
    res.json(list_customer);
});

router.get("/:id", async function (req, res) {
    console.log(req.params.id + "asdasd");
    const customerID = req.params.id || 0;

    if (customerID == 0) {
        res.status(304).json("NULL");
    }
    const result = await customer.single(customerID);
    if (result == 0) {
        return res.status(304).end();
    }
    res.json(result);
})

router.post("/", async function (req, res) {
    const new_customer = req.body;
    console.log(new_customer);
    const result = await customer.add(new_customer);
    res.status(201).json(result);
})

router.delete("/:id", async function (req, res) {
    const film_id = req.params.id || 0;
    if (film_id == 0) {
        return res.status(304).json("NULL");
    }
    const result = await customer.del(film_id);
    res.status(201).json(result);
})

module.exports = router;