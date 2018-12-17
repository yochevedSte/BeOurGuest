"use strict";
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let GlobalGuest = require('./GlobalGuestModel');
let Invitation = require('./InvitationModel');
let Category = require('./CategoryModel');


let guestSchema = new mongoose.Schema({
    globalGuest_id: { type: Schema.Types.ObjectId, ref: 'globalGuest' },
    invitations: [{ type: Schema.Types.ObjectId, ref: 'invitation' }],
    categories: [{ type: Schema.Types.ObjectId, ref: 'category' }],
    comment: String,
    numInvited: Number,
    numComing: Number,
    numNotComing: Number,
    seated: Boolean
});

let Guest = mongoose.model('guest', guestSchema);

module.exports = Guest;
