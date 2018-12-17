"use strict";
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Event = require('./EventModel');
let GlobalGuest = require('./GlobalGuestModel');
let Category = require('./CategoryModel');


let userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    events: [{ type: Schema.Types.ObjectId, ref: 'event' }],
    guests: [{ type: Schema.Types.ObjectId, ref: 'globalGuest' }],
    categories: [{ type: Schema.Types.ObjectId, ref: 'category' }]
});

let User = mongoose.model('user', userSchema);

module.exports = User;
