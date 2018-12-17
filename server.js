const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const nodemailer = require('nodemailer');
const app = express();
const path = require('path');

//socketIO
const http = require('http')
const server = http.Server(app)
const io = require('socket.io')(server)

const categoryRoute = require('./routes/categoryRoute.js');
const eventRoute = require('./routes/eventRoute.js');
const guestRoute = require('./routes/guestRoute.js');
const invitationRoute = require('./routes/invitationRoute.js');
const tableRoute = require('./routes/tableRoute.js');
const userRoute = require('./routes/userRoute.js');




//'mongodb://localhost/beOurGuestDB_test'
 let CONNECTION_STRING = "mongodb://root:Meir6646@ds155252.mlab.com:55252/beourguest"
mongoose.connect(process.env.CONNECTION_STRING || CONNECTION_STRING , function () {
    console.log("DB connection established!!!");
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//modals   
const Event = require('./Models/EventModel');
const Table = require('./Models/TableModel');
const User = require('./Models/UserModel')
const GlobalGuest = require('./Models/GlobalGuestModel');
const Guest = require('./Models/GuestModel');
const Invitation = require('./Models/InvitationModel');
const Category = require('./Models/CategoryModel');

//  socket
io.on('connection', socket => {
    console.log('New client connected')
    socket.on('callRsvp', (objGuest) => {
        io.sockets.emit('backRsvp', objGuest)
    })
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

app.use(express.static(path.join(__dirname, 'client/build')));

app.use(userRoute);
app.use(eventRoute);
app.use(guestRoute);
app.use(tableRoute);
app.use(categoryRoute);
app.use(invitationRoute);


// //***************  Email ***************//
// // Forgot tPassword  
// app.get('/beOurGuest/ForgotPassword/:userEmail', (req, res) => {
//     User.findOne({ email: req.params.userEmail })
//         .then(user => {
//             console.log(req.params.userEmail)
//             if (user != null) {
//                 var transporter = nodemailer.createTransport({
//                     host: 'smtp.gmail.com',
//                     tls: {
//                         rejectUnauthorized: false
//                     },
//                     auth: {
//                         type: 'OAuth2',
//                         user: 'BeOurGuestMail@gmail.com',
//                         // pass: 'guest2018',
//                         clientId: '804468733579-5rf9if9l9ftva7s8jqhvu93o62jjsjlp.apps.googleusercontent.com',
//                         clientSecret: 'WS2n-o6JBbTkCfelHDrYeSpS',
//                         refreshToken: '1/pzH-OKFKM7Yu-CpIi0N4w9_en8IMDH90oENkS6REhko'
//                     }
//                 });
//                 // transporter.use('compile', inlineCss());
//                 var mailOptions = {
//                     from: 'beouguestmail@gmail.com',
//                     to: req.params.userEmail,
//                     subject: 'Password recovery user',
//                     html: `<h3> Hello ${user.username} At your request we sent you your username and your password</h3>
//                     <p>User name : ${user.username}</p>
//                     <p>password : ${user.password}</p><br>
//                     <p style="color:blue">Be Our Guest</p>'`,
//                     // attachments: {
//                     //     filename: 'nyan cat ✔.gif',
//                     //     path: __dirname + '/client/public/pic3.jpg',
//                     //     cid: 'nyan@example.com' // should be as unique as possible
//                     // }
//                 };
//                 transporter.sendMail(mailOptions, function (error, info) {
//                     if (error) {
//                         res.send("error fron mail:" + error)
//                     } else {
//                         res.send('Email sent to address  ' + req.params.userEmail + '  Check your email')
//                     }

//                 });
//             }
//             else {
//                 res.send('There is no such email address')

//             }

//         });
// })
// /// send rsvp to email
// app.post('/beOurGuest/rsvpEmail/:vetId/:eventId/', (req, res) => {
//     let item = req.body
//     let vetId = req.params.vetId;
//     let eventId = req.params.eventId;
//     // Guest. find({}). populate({ path: 'globalGuest_id', select: 'email' }).
//     Event.findById(req.params.eventId).
//         populate({
//             path: 'guests',
//             populate: {
//                 path: 'globalGuest_id'
//             }
//         }).
//         exec(function (err, mYguest) {
//             if (err) return handleError(err);
//             console.log(mYguest)
//             mYguest.guests.forEach(guest => {
//                 console.log(guest.globalGuest_id.email)

//                 /////
//                 var transporter = nodemailer.createTransport({
//                     host: 'smtp.gmail.com',
//                     tls: {
//                         rejectUnauthorized: false
//                     },
//                     auth: {
//                         type: 'OAuth2',
//                         user: 'BeOurGuestMail@gmail.com',
//                         // pass: 'guest2018',
//                         clientId: '804468733579-5rf9if9l9ftva7s8jqhvu93o62jjsjlp.apps.googleusercontent.com',
//                         clientSecret: 'WS2n-o6JBbTkCfelHDrYeSpS',
//                         refreshToken: '1/pzH-OKFKM7Yu-CpIi0N4w9_en8IMDH90oENkS6REhko'
//                     }
//                 });;
//                 var mailOptions = {
//                     from: 'Be Our Guest ',
//                     to: guest.globalGuest_id.email,
//                     subject: item.titleInput,
//                     html: `<div style="background-color:${item.background};padding:20px">
//             <h2 style="color:${item.titleColor}, font-family:${item.fontTitle}">${item.titleInput}</h2>
//             <div style="white-space: pre-wrap;padding: 10px;color:${item.bodyColor};font-family: ${item.fontBody}">
//             <h3>${item.textInput}</h3>
//             </div>
//             <p>${item.whenEvent}<br>
//             ${item.whereEvent}</p>
//             <button style="background-color:#91ff35;border-radius: 10px">
//             <a  href="https://beourguest.herokuapp.com/beuorguest/rsvp/${vetId}/${eventId}/${guest._id}/">Confirm your arrival</a>
//             </button>

//             <br>
//           </div>  `
//                 };
//                 transporter.sendMail(mailOptions, function (error, info) {
//                     if (error) {
//                         console.log(error);
//                     } else {
//                         console.log('Email sent: ' + info.response);
//                     }
//                 });
//                 ////
//             });
//             res.send(JSON.stringify(mYguest))
//         });
//     ////

// })

// //***************  User ***************//
// //new user
// app.post('/beOurGuest/newUser', (req, res) => {
//     let userinfo = req.body;
//     User.findOne({ username: userinfo.inputText }).exec((err, userName) => {
//         if (err) return handleError(err);
//         if (userName != null)
//             res.send("user")
//         else {
//             User.findOne({ email: userinfo.emailText }).exec((err, userEmail) => {
//                 if (err) return handleError(err);
//                 if (userEmail != null)
//                     res.send("email")
//                 else {
//                     let newUser = User({
//                         username: userinfo.inputText,
//                         password: userinfo.passText,
//                         email: userinfo.emailText,
//                         events: [],
//                         guests: [],
//                         categories: []
//                     })
//                     newUser.save(function (err, user) {
//                         res.send(user);
//                     })
//                 }
//             })

//         }
//     });



// });

// //login   and get user model
// app.post('/beOurGuest/login', (req, res) => {
//     let userinfo = req.body;
//     User.findOne({ $and: [{ username: userinfo.name }, { password: userinfo.pass }] })
//         // populate('events').  categories
//         .populate({
//             path: 'events',
//             populate: {
//                 path: 'invitations'
//             }
//         })
//         .populate({
//             path: 'events',
//             populate: {
//                 path: 'tables',
//             }
//         })
//         .populate("categories")
//         .populate({
//             path: 'events',
//             populate: {
//                 path: 'guests', populate: {
//                     path: 'globalGuest_id'
//                 }
//             }
//         })
//         .populate('guests')
//         .exec((err, user) => {
//             if (err) return handleError(err);
//             if (user == null)
//                 res.send(null)
//             else
//                 res.send(user);
//         });
// });

// //***************  Events ***************//
// //add event
// app.post('/beOurGuest/addNewEvent/:UserId', (req, res) => {
//     let event = req.body;
//     let myEvent = new Event({
//         Title: event.Title,
//         Date: event.Date,
//         Location: event.Location,
//         maxGuests: event.maxGuests,
//         HostName: event.HostName,
//         tables: [],
//         invitations: [],
//         guests: [],
//     })

//     myEvent.save((err, event) => {
//         console.log(event.id)
//         User.findById(req.params.UserId).
//             then(user => {
//                 let listEvent = user.events.concat();
//                 listEvent.push(event.id);
//                 user.events = listEvent;
//                 user.save();
//                 res.send(event);
//             });
//     })
// });

// // edit event
// app.post('/beOurGuest/editEvent/:EventId', (req, res) => {
//     let event = req.body;

//     Event.findById(req.params.EventId).
//         then(eve => {
//             console.log(eve)
//             console.log(event)
//             eve.Title = event.Title;
//             eve.Date = event.Date;
//             eve.Location = event.Location;
//             eve.maxGuests = event.maxGuests;
//             eve.HostName = event.HostName;
//             eve.save();
//             res.send(eve)
//         })

// });

// // remove event
// app.delete('/beOurGuest/removEvent/:userId/:eventId/:index', (req, res) => {
//     console.log("user id + " + req.params.userId)
//     console.log("event id + " + req.params.eventId)
//     User.findOne({ _id: req.params.userId })
//         .then(user => {
//             listEvents = user.events.concat();
//             listEvents.splice(req.params.index, 1);
//             user.events = listEvents;
//             user.save()
//                 .then(() => Event.findByIdAndRemove({ _id: req.params.eventId }))
//                 .then(res.send("event deleted"))
//         })
// });

// //***************  Guest ***************//
// //add guest
// app.post('/beOurGuest/addNewGuest/:userId/:eventId/', (req, res) => {
//     let newGuest = req.body;
//     let myGlobalGuest = new GlobalGuest({
//         name: newGuest.name,
//         email: newGuest.email,
//         phone: newGuest.phone
//     })

//     User.findById(req.params.userId)
//         .then(user => {
//             if (user === null) {
//                 res.send(user);
//             }

//             myGlobalGuest.save()
//                 .then(globalGuest => {
//                     // Add guest to user's globalGuest list
//                     let guestList = user.guests.concat();
//                     guestList.push(globalGuest._id);
//                     user.guests = guestList;
//                     user.save();
//                     console.log('GlobalGuest ' + globalGuest._id + ' saved to user list');

//                     // Create guest object
//                     let myGuest = new Guest({
//                         globalGuest_id: globalGuest._id,
//                         invitations: [],
//                         categories: [newGuest.category],
//                         comment: newGuest.comment,
//                         numInvited: newGuest.invited,
//                         numComing: newGuest.coming,
//                         numNotComing: newGuest.notComing,
//                         seated: false
//                     });
//                     // myGuest.categories.push(newGuest.category);

//                     Event.findById(req.params.eventId)
//                         .then(event => {
//                             if (event === null) {
//                                 res.send(event);
//                             }

//                             // Add guest to event's guest list
//                             myGuest.save()
//                                 .then(guest => {
//                                     let guestList = event.guests.concat();
//                                     guestList.push(guest._id);
//                                     event.guests = guestList;
//                                     event.save();
//                                     console.log('Guest ' + guest._id + ' saved to event list');

//                                     let resultGuest = {
//                                         globalGuestId: globalGuest._id,
//                                         name: globalGuest.name,
//                                         email: globalGuest.email,
//                                         phone: globalGuest.phone,

//                                         guestId: guest._id,
//                                         invitations: guest.invitations,
//                                         categories: guest.categories,
//                                         comment: guest.comment,
//                                         numInvited: guest.numInvited,
//                                         numComing: guest.numComing,
//                                         numNotComing: guest.numNotComing,
//                                         seated: false
//                                     };

//                                     console.log(resultGuest.id);
//                                     res.send(resultGuest);
//                                 });
//                         });
//                 });
//         })
//         .catch(err => {
//             console.log(err);
//         })
// });

// // edit guest
// app.post('/beOurGuest/handleSaveChangeGuest/:GustId/:GlobalGuestId', (req, res) => {
//     const newGuest = req.body;
//     Guest.findOne({ _id: req.params.GustId })
//         .then(gust => {
//             gust.numInvited = newGuest.numInvited
//             gust.numComing = newGuest.numComing;
//             gust.numNotComing = newGuest.numNotComing
//             // gust.categories = newGuest.categories;
//             // gust.categories[0] = newGuest.categories;
//             ///
//             let guestList = gust.categories.concat();
//             guestList[0] = newGuest.categories;
//             gust.categories = guestList;
//             ///
//             gust.save()
//                 .then(() => {
//                     GlobalGuest.findOne({ _id: req.params.GlobalGuestId })
//                         .then(gustGlonal => {
//                             gustGlonal.name = newGuest.globalGuest.name;
//                             gustGlonal.email = newGuest.globalGuest.email;
//                             gustGlonal.phone = newGuest.globalGuest.phone;
//                             console.log(gust.categories);
//                             gustGlonal.save()
//                             res.send("Change Guest")
//                         })
//                 }
//                 ).then(console.log("Change Guest"));
//         });
// })

// // remove guest
// app.delete('/beOurGuest/removeGuest/:eventId/:guestId/:index', (req, res) => {
//     Event.findOne({ _id: req.params.eventId })
//         .then(event => {
//             listGuests = event.guests.concat();
//             listGuests.splice(req.params.index, 1);
//             event.guests = listGuests;
//             event.save()
//                 .then(() => {
//                     Guest.findByIdAndRemove({ _id: req.params.guestId });
//                     Table.findOne({ guests: req.params.guestId })
//                         .then(table => {
//                             if (table)
//                                 return Table.findByIdAndUpdate(table._id, { $pull: { guests: req.params.guestId } }, { new: true })
//                             else res.send(null);
//                         })
//                         .then(updatedTable => res.send(updatedTable))
//                         .catch(err => {
//                             console.log("ERROR: " + err)
//                         });
//                 }
//                 ).then(console.log("deleteGuests"));
//         });
// });

// //***************  Invitation ***************//

// // add  Invitation
// app.post('/beOurGuest/saveInvitation/:eventId/', (req, res) => {
//     let vet = req.body;

//     vet = new Invitation({
//         invitationName: vet.invitationName,
//         titleInput: vet.titleInput,
//         textInput: vet.textInput,
//         background: vet.background,
//         titleColor: vet.titleColor,
//         bodyColor: vet.bodyColor,
//         fontTitle: vet.fontTitle,
//         fontBody: vet.fontBody,
//         whenEvent: vet.whenEvent,
//         whereEvent: vet.whereEvent,
//     })
//     vet.save(function (err, newVet) {
//         console.log(newVet.id);
//         Event.findById(req.params.eventId, function (err, eve) {
//             if (err) return handleError(err);
//             eve.invitations.push(newVet.id);
//             eve.save(res.send(JSON.stringify(newVet)))
//         })
//     })
// });
// //remove  Invitation
// app.delete('/beOurGuest/removeInvitation/:eventId/:eventIndex/:index/', (req, res) => {

//     Event.findById(req.params.eventId, function (err, eve) {
//         if (err) return handleError(err);
//         eve.invitations.splice(req.params.index, 1)
//         eve.save(Invitation.findByIdAndRemove({ _id: req.params.eventId })
//             .then(res.send("delete invitation")))
//     })
// })


// //***************  Rsvp ***************//

// // get Invitation for rsvp 
// app.get('/beOurGuest/rsvpGuest/:vetId/', (req, res) => {
//     let item = req.params
//     console.log(item.vetId);
//     Invitation.findById(item.vetId, function (err, vet) {
//         if (err) return handleError(err);
//         res.send(vet);
//     })
// })
// // get guest for rsvp 
// app.get('/beOurGuest/rsvpGuest/guestId/:guestId/', (req, res) => {
//     let item = req.params
//     console.log(item.guestId);
//     Guest.findById(item.guestId, function (err, gust) {
//         if (err) return handleError(err);
//         res.send(gust);
//     })
// })

// //  guest return  Answer for rsvp
// app.post('/beOurGuest/rsvp/guestAnswer/', (req, res) => {

//     let item = req.body
//     console.log(req.body.guestId)
//     Guest.findById(req.body.guestId).
//         then(guest => {
//             console.log(guest)
//             console.log("numInvited  " + guest.numInvited);
//             console.log("numComing  " + guest.numComing);
//             guest.numNotComing = req.body.notComing;
//             guest.numComing = req.body.coming;
//             guest.save();
//         })
// })

// //***************  Table ***************//
// //createTable
// app.post('/beOurGuest/addTable/:eventId/', (req, res) => {
//     let newTable = new Table(req.body)
//     console.log(JSON.stringify(newTable))
//     newTable.save((err, table) => {
//         console.log(table.id)
//         Event.findById(req.params.eventId).
//             then(eve => {
//                 let listtables = eve.tables.concat();
//                 listtables.push(table.id);
//                 eve.tables = listtables;
//                 eve.save();
//                 res.send(table);
//             });
//     })

// })

// app.post('/beOurGuest/updateTable/', (req, res) => {
//     let myTable = req.body;
//     Table.findOneAndUpdate({ _id: myTable._id }, myTable, { 'new': true })
//         .then(updatedTable => {
//             console.log("succesfully updated a table");
//             res.send(updatedTable);
//         })
//         .catch(err => {
//             console.log(err);
//         })


// });

// app.post('/beOurGuest/updateGuestsInTable/', (req, res) => {
//     let myTable = req.body;
//     Table.findOneAndUpdate({ _id: myTable._id }, { guests: myTable.guests }, { 'new': true })
//         .then(updatedTable => {
//             console.log("succesfully updated guests in table");
//             res.send(updatedTable);
//         });


// });

// app.post('/beOurGuest/updateEventGuest/', (req, res) => {
//     let myGuest = req.body;
//     Guest.findByIdAndUpdate(myGuest._id, { seated: myGuest.seated }, { 'new': true })
//         .then(updatedGuest => {
//             console.log("succesfully updated guests to seated");
//             res.send(updatedGuest);
//         });


// });

// app.post('/beOurGuest/deleteTable/:eventId', (req, res) => {
//     console.log("entered delteTable");
//     let table_id = req.body._id;
//     Event.findByIdAndUpdate(req.params.eventId, { $pull: { tables: { _id: table_id } } }, { 'new': true })
//         .then(eve => {
//             console.log(eve);
//             Table.findByIdAndRemove(req.body._id).then(removed => {
//                 console.log("succesfully removed table");
//                 res.send(removed);
//             });

//         });
// });

// app.post('/beOurGuest/updateGuests/', (req, res) => {
//     console.log("entered updateGuests");
//     let newGuests = req.body;
//     console.log(newGuests);

//     newGuests.forEach(guest => {
//         Guest.findByIdAndUpdate(guest._id, { seated: guest.seated }, { 'new': true })
//             .then(guest => {
//                 console.log(guest);
//             });
//     });
//     res.send();
// })

// //***************  Category ***************//
// //create category
// app.post('/beOurGuest/addNewCategory/:UserId', (req, res) => {
//     let item = req.body;
//     let newCategory = new Category({
//         name: item.name,
//         colorCode: item.colorCode,
//     })

//     newCategory.save((err, category) => {
//         User.findById(req.params.UserId)
//             .then(user => {
//                 let listCategory = user.categories.concat();
//                 listCategory.push(category.id);
//                 user.categories = listCategory;
//                 user.save();
//                 res.send(category);
//             }).catch(err => {
//                 console.log(err);
//             });
//     })
// });

// //remove category
// app.delete('/beOurGuest/removeCategory/:userId', (req, res) => {
//     // User.findById(req.params.userId)
//     // .then(user => {      
//     //     user.categories.findByIdAndRemove(req.body._id).then(removed => {
//     //             console.log("succesfully removed category");
//     //             res.send(removed);
//     //         }).catch(err => {
//     //             console.log(err);
//     //         });
//     //     res.send(category);
//     // }).catch(err => {
//     //     console.log(err);
//     // });
// });



const port = process.env.PORT || 3001;
server.listen(port, console.log('Server running on port', port));


