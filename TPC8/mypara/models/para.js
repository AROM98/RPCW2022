const mongoose = require('mongoose')

var paraSchema = new mongoose.Schema({
    //_id: String,
    data: String,
    para: String
})

module.exports = mongoose.model('para', paraSchema)