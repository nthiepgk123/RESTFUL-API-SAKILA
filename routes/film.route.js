const express = require('express');

const filmModel = require('../models/film.model')
const film_schema = require('../schemas/film.schema.json')
const validate_mdw = require('../middlewares/validate.mdw')


const router = express.Router();


router.get('/', async function (req, res) {
    const list_films = await filmModel.all();
    if (list_films.length == 0) {
        res.status(304).json("Null");
    }
    res.json(list_films);
})

router.get('/:id', async function (req, res) {
    const id_film = req.params.id || 0;
    if (id_film == 0) {
        return res.status(304).end();
    }
    const film = await filmModel.single(id_film);
    res.json(film);
})

// chua co bang film
router.post('/', async function (req, res) {
    const film = req.body;
    console.log(film);
    const id = await filmModel.add(film);
    res.status(201).json(id);
})

router.delete('/:id', async function (req, res) {
    const id_film = req.params.id || 0;
    if (id_film == 0) {
        return res.status(304).end();
    }
    await filmModel.del(id_film);
    res.json({
        "message": "Delete thanh cong !"
    })

})

module.exports = router;