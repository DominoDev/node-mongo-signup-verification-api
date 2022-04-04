const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: { type: String, required: true },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account'
      },
    created: { type: Date, default: Date.now },
    updated: Date
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
    }
});

module.exports = mongoose.model('Listing', schema);