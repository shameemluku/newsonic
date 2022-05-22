const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: { type: String }
})

const Categories = mongoose.model("categories", categorySchema);
module.exports = Categories;