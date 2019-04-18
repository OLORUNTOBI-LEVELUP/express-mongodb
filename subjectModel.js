const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    description: {
        type: String,
        required: true
    }
})

const subjectModel = mongoose.model("subject", subjectSchema);

module.exports = subjectModel;