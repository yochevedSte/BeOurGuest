"use strict";
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let globalGuestSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
});

let GlobalGuest = mongoose.model('globalGuest', globalGuestSchema);

module.exports = GlobalGuest;
