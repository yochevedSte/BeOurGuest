"use strict";
let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let invitationSchema = new mongoose.Schema({
    invitationName: String,
    titleInput: String,
    textInput: String,
    background: String,
    titleColor: String,
    bodyColor: String,
    fontTitle: String,
    fontBody: String,
    whenEvent: String,
    whereEvent: String
});

let Invitation = mongoose.model('invitation', invitationSchema);

module.exports = Invitation;
