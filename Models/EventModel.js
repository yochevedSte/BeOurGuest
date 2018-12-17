"use strict";
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Table = require('./TableModel');
let GlobalGuest = require('./InvitationModel');
let Category = require('./CategoryModel');


let eventSchema = new mongoose.Schema({
    Title: String,
    Date: String,
    Location: String,
    maxGuests: Number,
    HostName: String,
    tables: [{ type: Schema.Types.ObjectId, ref: 'table' }],
    invitations: [{ type: Schema.Types.ObjectId, ref: 'invitation' }],
    guests: [{ type: Schema.Types.ObjectId, ref: 'guest' }],
});


module.exports = mongoose.model('event', eventSchema);

