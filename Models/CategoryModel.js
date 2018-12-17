"use strict";
let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let categorySchema = new mongoose.Schema({
    name: String,
    colorCode: String
});

let Category = mongoose.model('category', categorySchema);

module.exports = Category;

