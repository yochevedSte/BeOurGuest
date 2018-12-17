"use strict";
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Guest = require('./GuestModel');
let Category = require('./CategoryModel');


let tableSchema = new mongoose.Schema({
    title: String,
    maxGuests: Number,
    category: { type: Schema.Types.ObjectId, ref: 'guests' },
    // categories: [{ type: Schema.Types.ObjectId, ref: 'category' }],
    guests: [{ type: Schema.Types.ObjectId, ref: 'guests' }]
});

let Table = mongoose.model('table', tableSchema);

module.exports = Table;
