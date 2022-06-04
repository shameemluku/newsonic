const mongoose = require('mongoose');

const navlinkSchema = mongoose.Schema({
    name: { type: String }
})

const Navlinks = mongoose.model("navlinks", navlinkSchema);
module.exports = Navlinks;