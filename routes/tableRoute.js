const express = require('express');
const router = express.Router();

//modals   
 const Event = require('./../Models/EventModel');
 const Table = require('./../Models/TableModel');


//***************  Table ***************//
//createTable
router.post('/beOurGuest/addTable/:eventId/', (req, res) => {
    let newTable = new Table(req.body)
    console.log(JSON.stringify(newTable))
    newTable.save((err, table) => {
        console.log(table.id)
        Event.findById(req.params.eventId).
            then(eve => {
                let listtables = eve.tables.concat();
                listtables.push(table.id);
                eve.tables = listtables;
                eve.save();
                res.send(table);
            });
    })

})

router.post('/beOurGuest/updateTable/', (req, res) => {
    let myTable = req.body;
    Table.findOneAndUpdate({ _id: myTable._id }, myTable, { 'new': true })
        .then(updatedTable => {
            console.log("succesfully updated a table");
            res.send(updatedTable);
        })
        .catch(err => {
            console.log(err);
        })


});

router.post('/beOurGuest/updateGuestsInTable/', (req, res) => {
    let myTable = req.body;
    Table.findOneAndUpdate({ _id: myTable._id }, { guests: myTable.guests }, { 'new': true })
        .then(updatedTable => {
            console.log("succesfully updated guests in table");
            res.send(updatedTable);
        });


});

router.post('/beOurGuest/deleteTable/:eventId', (req, res) => {
    console.log("entered delteTable");
    let table_id = req.body._id;
    Event.findByIdAndUpdate(req.params.eventId, { $pull: { tables: { _id: table_id } } }, { 'new': true })
        .then(eve => {
            console.log(eve);
            Table.findByIdAndRemove(req.body._id).then(removed => {
                console.log("succesfully removed table");
                res.send(removed);
            });

        });
});

module.exports = router;
