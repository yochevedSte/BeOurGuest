const express = require('express');
const router = express.Router();
//modals   
 const Event = require('./../Models/EventModel');
const User = require('./../Models/UserModel')


//***************  Events ***************//
//add event
router.post('/beOurGuest/addNewEvent/:UserId', (req, res) => {
    let event = req.body;
    let myEvent = new Event({
        Title: event.Title,
        Date: event.Date,
        Location: event.Location,
        maxGuests: event.maxGuests,
        HostName: event.HostName,
        tables: [],
        invitations: [],
        guests: [],
    })

    myEvent.save((err, event) => {
        console.log(event.id)
        User.findById(req.params.UserId).
            then(user => {
                let listEvent = user.events.concat();
                listEvent.push(event.id);
                user.events = listEvent;
                user.save();
                res.send(event);
            });
    })
});

// edit event
router.post('/beOurGuest/editEvent/:EventId', (req, res) => {
    let event = req.body;

    Event.findById(req.params.EventId).
        then(eve => {
            console.log(eve)
            console.log(event)
            eve.Title = event.Title;
            eve.Date = event.Date;
            eve.Location = event.Location;
            eve.maxGuests = event.maxGuests;
            eve.HostName = event.HostName;
            eve.save();
            res.send(eve)
        })

});

// remove event
router.delete('/beOurGuest/removEvent/:userId/:eventId/:index', (req, res) => {
    console.log("user id + " + req.params.userId)
    console.log("event id + " + req.params.eventId)
    User.findOne({ _id: req.params.userId })
        .then(user => {
            listEvents = user.events.concat();
            listEvents.splice(req.params.index, 1);
            user.events = listEvents;
            user.save()
                .then(() => Event.findByIdAndRemove({ _id: req.params.eventId }))
                .then(res.send("event deleted"))
        })
});


module.exports = router;
