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
router.delete('/beOurGuest/removeCategory/:userId/:categoryId', (req, res) => {
    console.log("hey");
    let categoryId = req.params.categoryId;
    console.log(categoryId);
    User.findById(req.params.userId)
        .then(user => {
            console.log(user);
            return user.update({$pullAll: { categories: [categoryId ] } });
        })
        .then(removed => {
            console.log("succesfully removed category from user");
            return Category.findByIdAndRemove(categoryId);

        }).then(cat => res.send(cat)).catch(err => {
            console.log(err);
        });
});

//edit category '/beOurGuest/editCategory/'
router.post('/beOurGuest/editCategory/:userId', (req, res) => {
    console.log("EDIT SERVER");
    let body = req.body;
    let category = {name: body.name, colorCode: body.colorCode};
    console.log(category);
    Category.findByIdAndUpdate(body._id ,{$set: category}, {new: true})
        .then(cat => {
            console.log(cat);
            res.send(cat);
        })
        .catch(err => {console.log(err); res.send(err)});
});



module.exports = router;