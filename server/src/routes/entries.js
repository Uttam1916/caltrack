const express = require('express')
const router = express.Router;
const Entry = require('../models/entry')

//defining api end points
router.post('/', async (req,res) => {
    try{
        const entry = await Entry.create(req.body)
        res.status(201).json(entry)
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

})

router.get('/today', async (res,req) => {
    const start = new Date()
    start.setHours(0,0,0,0)
    const end = new Date()
    end.setHours(23,59,59,999)

    const entries = Entry.find({
        date : { $gte: start, $lte: end },
    })

    res.json(entries)
})

module.export = router