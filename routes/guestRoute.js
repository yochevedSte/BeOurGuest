const express = require('express');
const router = express.Router();
//modals   
 const Event = require('./../Models/EventModel');
 const Table = require('./../Models/TableModel');
const User = require('./../Models/UserModel')
const GlobalGuest = require('./../Models/GlobalGuestModel');
const Guest = require('./../Models/GuestModel');


//***************  Guest ***************//
//add guest
router.post('/beOurGuest/addNewGuest/:userId/:eventId/', (req, res) => {
    let newGuest = req.body;
    let myGlobalGuest = new GlobalGuest({
        name: newGuest.name,
        email: newGuest.email,
        phone: newGuest.phone
    })

    User.findById(req.params.userId)
        .then(user => {
            if (user === null) {
                res.send(user);
            }

            myGlobalGuest.save()
                .then(globalGuest => {
                    // Add guest to user's globalGuest list
                    let guestList = user.guests.concat();
                    guestList.push(globalGuest._id);
                    user.guests = guestList;
                    user.save();
                    console.log('GlobalGuest ' + globalGuest._id + ' saved to user list');

                    // Create guest object
                    let myGuest = new Guest({
                        globalGuest_id: globalGuest._id,
                        invitations: [],
                        categories: [newGuest.category],
                        comment: newGuest.comment,
                        numInvited: newGuest.invited,
                        numComing: newGuest.coming,
                        numNotComing: newGuest.notComing,
                        seated: false
                    });
                    // myGuest.categories.push(newGuest.category);

                    Event.findById(req.params.eventId)
                        .then(event => {
                            if (event === null) {
                                res.send(event);
                            }

                            // Add guest to event's guest list
                            myGuest.save()
                                .then(guest => {
                                    let guestList = event.guests.concat();
                                    guestList.push(guest._id);
                                    event.guests = guestList;
                                    event.save();
                                    console.log('Guest ' + guest._id + ' saved to event list');

                                    let resultGuest = {
                                        globalGuestId: globalGuest._id,
                                        name: globalGuest.name,
                                        email: globalGuest.email,
                                        phone: globalGuest.phone,

                                        guestId: guest._id,
                                        invitations: guest.invitations,
                                        categories: guest.categories,
                                        comment: guest.comment,
                                        numInvited: guest.numInvited,
                                        numComing: guest.numComing,
                                        numNotComing: guest.numNotComing,
                                        seated: false
                                    };

                                    console.log(resultGuest.id);
                                    res.send(resultGuest);
                                });
                        });
                });
        })
        .catch(err => {
            console.log(err);
        })
});

// edit guest
router.post('/beOurGuest/handleSaveChangeGuest/:GustId/:GlobalGuestId', (req, res) => {
    const newGuest = req.body;
    Guest.findOne({ _id: req.params.GustId })
        .then(gust => {
            gust.numInvited = newGuest.numInvited
            gust.numComing = newGuest.numComing;
            gust.numNotComing = newGuest.numNotComing
            // gust.categories = newGuest.categories;
            // gust.categories[0] = newGuest.categories;
            ///
            let guestList = gust.categories.concat();
            guestList[0] = newGuest.categories;
            gust.categories = guestList;
            ///
            gust.save()
                .then(() => {
                    GlobalGuest.findOne({ _id: req.params.GlobalGuestId })
                        .then(gustGlonal => {
                            gustGlonal.name = newGuest.globalGuest.name;
                            gustGlonal.email = newGuest.globalGuest.email;
                            gustGlonal.phone = newGuest.globalGuest.phone;
                            console.log(gust.categories);
                            gustGlonal.save()
                            res.send("Change Guest")
                        })
                }
                ).then(console.log("Change Guest"));
        });
})

// remove guest
router.delete('/beOurGuest/removeGuest/:eventId/:guestId/:index', (req, res) => {
    Event.findOne({ _id: req.params.eventId })
        .then(event => {
            listGuests = event.guests.concat();
            listGuests.splice(req.params.index, 1);
            event.guests = listGuests;
            event.save()
                .then(() => {
                    Guest.findByIdAndRemove({ _id: req.params.guestId });
                    Table.findOne({ guests: req.params.guestId })
                        .then(table => {
                            if (table)
                                return Table.findByIdAndUpdate(table._id, { $pull: { guests: req.params.guestId } }, { new: true })
                            else res.send(null);
                        })
                        .then(updatedTable => res.send(updatedTable))
                        .catch(err => {
                            console.log("ERROR: " + err)
                        });
                }
                ).then(console.log("deleteGuests"));
        });
});


router.post('/beOurGuest/updateEventGuest/', (req, res) => {
    let myGuest = req.body;
    Guest.findByIdAndUpdate(myGuest._id, { seated: myGuest.seated }, { 'new': true })
        .then(updatedGuest => {
            console.log("succesfully updated guests to seated");
            res.send(updatedGuest);
        });


});

router.post('/beOurGuest/updateGuests/', (req, res) => {
    console.log("entered updateGuests");
    let newGuests = req.body;
    console.log(newGuests);

    newGuests.forEach(guest => {
        Guest.findByIdAndUpdate(guest._id, { seated: guest.seated }, { 'new': true })
            .then(guest => {
                console.log(guest);
            });
    });
    res.send();
})

module.exports = router;