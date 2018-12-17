const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
//modals   
 const Event = require('./../Models/EventModel');
const User = require('./../Models/UserModel')
const Guest = require('./../Models/GuestModel');
const Invitation = require('./../Models/InvitationModel');

//***************  Email ***************//
// Forgot tPassword  
router.get('/beOurGuest/ForgotPassword/:userEmail', (req, res) => {
    User.findOne({ email: req.params.userEmail })
        .then(user => {
            console.log(req.params.userEmail)
            if (user != null) {
                var transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    tls: {
                        rejectUnauthorized: false
                    },
                    auth: {
                        type: 'OAuth2',
                        user: 'BeOurGuestMail@gmail.com',
                        // pass: 'guest2018',
                        clientId: '804468733579-5rf9if9l9ftva7s8jqhvu93o62jjsjlp.apps.googleusercontent.com',
                        clientSecret: 'WS2n-o6JBbTkCfelHDrYeSpS',
                        refreshToken: '1/pzH-OKFKM7Yu-CpIi0N4w9_en8IMDH90oENkS6REhko'
                    }
                });
                // transporter.use('compile', inlineCss());
                var mailOptions = {
                    from: 'beouguestmail@gmail.com',
                    to: req.params.userEmail,
                    subject: 'Password recovery user',
                    html: `<h3> Hello ${user.username} At your request we sent you your username and your password</h3>
                    <p>User name : ${user.username}</p>
                    <p>password : ${user.password}</p><br>
                    <p style="color:blue">Be Our Guest</p>'`,
                    // attachments: {
                    //     filename: 'nyan cat ✔.gif',
                    //     path: __dirname + '/client/public/pic3.jpg',
                    //     cid: 'nyan@example.com' // should be as unique as possible
                    // }
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        res.send("error fron mail:" + error)
                    } else {
                        res.send('Email sent to address  ' + req.params.userEmail + '  Check your email')
                    }

                });
            }
            else {
                res.send('There is no such email address')

            }

        });
})
/// send rsvp to email
router.post('/beOurGuest/rsvpEmail/:vetId/:eventId/', (req, res) => {
    let item = req.body
    let vetId = req.params.vetId;
    let eventId = req.params.eventId;
    // Guest. find({}). populate({ path: 'globalGuest_id', select: 'email' }).
    Event.findById(req.params.eventId).
        populate({
            path: 'guests',
            populate: {
                path: 'globalGuest_id'
            }
        }).
        exec(function (err, mYguest) {
            if (err) return handleError(err);
            console.log(mYguest)
            mYguest.guests.forEach(guest => {
                console.log(guest.globalGuest_id.email)

                /////
                var transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    tls: {
                        rejectUnauthorized: false
                    },
                    auth: {
                        type: 'OAuth2',
                        user: 'BeOurGuestMail@gmail.com',
                        // pass: 'guest2018',
                        clientId: '804468733579-5rf9if9l9ftva7s8jqhvu93o62jjsjlp.apps.googleusercontent.com',
                        clientSecret: 'WS2n-o6JBbTkCfelHDrYeSpS',
                        refreshToken: '1/pzH-OKFKM7Yu-CpIi0N4w9_en8IMDH90oENkS6REhko'
                    }
                });;
                var mailOptions = {
                    from: 'Be Our Guest ',
                    to: guest.globalGuest_id.email,
                    subject: item.titleInput,
                    html: `<div style="background-color:${item.background};padding:20px">
            <h2 style="color:${item.titleColor}, font-family:${item.fontTitle}">${item.titleInput}</h2>
            <div style="white-space: pre-wrap;padding: 10px;color:${item.bodyColor};font-family: ${item.fontBody}">
            <h3>${item.textInput}</h3>
            </div>
            <p>${item.whenEvent}<br>
            ${item.whereEvent}</p>
            <button style="background-color:#91ff35;border-radius: 10px">
            <a  href="https://beourguest.herokuapp.com/beuorguest/rsvp/${vetId}/${eventId}/${guest._id}/">Confirm your arrival</a>
            </button>

            <br>
          </div>  `
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                ////
            });
            res.send(JSON.stringify(mYguest))
        });
    ////

})

//***************  Invitation ***************//

// add  Invitation
router.post('/beOurGuest/saveInvitation/:eventId/', (req, res) => {
    let vet = req.body;

    vet = new Invitation({
        invitationName: vet.invitationName,
        titleInput: vet.titleInput,
        textInput: vet.textInput,
        background: vet.background,
        titleColor: vet.titleColor,
        bodyColor: vet.bodyColor,
        fontTitle: vet.fontTitle,
        fontBody: vet.fontBody,
        whenEvent: vet.whenEvent,
        whereEvent: vet.whereEvent,
    })
    vet.save(function (err, newVet) {
        console.log(newVet.id);
        Event.findById(req.params.eventId, function (err, eve) {
            if (err) return handleError(err);
            eve.invitations.push(newVet.id);
            eve.save(res.send(JSON.stringify(newVet)))
        })
    })
});
//remove  Invitation
router.delete('/beOurGuest/removeInvitation/:eventId/:eventIndex/:index/', (req, res) => {

    Event.findById(req.params.eventId, function (err, eve) {
        if (err) return handleError(err);
        eve.invitations.splice(req.params.index, 1)
        eve.save(Invitation.findByIdAndRemove({ _id: req.params.eventId })
            .then(res.send("delete invitation")))
    })
})


//***************  Rsvp ***************//

// get Invitation for rsvp 
router.get('/beOurGuest/rsvpGuest/:vetId/', (req, res) => {
    let item = req.params
    console.log(item.vetId);
    Invitation.findById(item.vetId, function (err, vet) {
        if (err) return handleError(err);
        res.send(vet);
    })
})
// get guest for rsvp 
router.get('/beOurGuest/rsvpGuest/guestId/:guestId/', (req, res) => {
    let item = req.params
    console.log(item.guestId);
    Guest.findById(item.guestId, function (err, gust) {
        if (err) return handleError(err);
        res.send(gust);
    })
})

//  guest return  Answer for rsvp
router.post('/beOurGuest/rsvp/guestAnswer/', (req, res) => {

    let item = req.body
    console.log(req.body.guestId)
    Guest.findById(req.body.guestId).
        then(guest => {
            console.log(guest)
            console.log("numInvited  " + guest.numInvited);
            console.log("numComing  " + guest.numComing);
            guest.numNotComing = req.body.notComing;
            guest.numComing = req.body.coming;
            guest.save();
        })
})


module.exports = router;
