const express = require('express');
const router = express.Router();
//modals   
const User = require('./../Models/UserModel')
const Category = require('./../Models/CategoryModel');


//***************  Category ***************//
//create category
router.post('/beOurGuest/addNewCategory/:UserId', (req, res) => {
    let item = req.body;
    let newCategory = new Category({
        name: item.name,
        colorCode: item.colorCode,
    })

    newCategory.save((err, category) => {
        User.findById(req.params.UserId)
            .then(user => {
                let listCategory = user.categories.concat();
                listCategory.push(category.id);
                user.categories = listCategory;
                user.save();
                res.send(category);
            }).catch(err => {
                console.log(err);
            });
    })
});

//remove category
router.delete('/beOurGuest/removeCategory/:userId', (req, res) => {
    // User.findById(req.params.userId)
    // .then(user => {      
    //     user.categories.findByIdAndRemove(req.body._id).then(removed => {
    //             console.log("succesfully removed category");
    //             res.send(removed);
    //         }).catch(err => {
    //             console.log(err);
    //         });
    //     res.send(category);
    // }).catch(err => {
    //     console.log(err);
    // });
});


module.exports = router;

