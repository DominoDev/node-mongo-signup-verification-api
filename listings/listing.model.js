const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'mapquest',
  apiKey: process.env.MAPQUEST_API_KEY,
  formatter: null
};

const geocoder = NodeGeocoder(options);

const schema = new Schema({
    account: { type: Schema.Types.ObjectId, ref: 'Account' },
    description: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String},
    city: { type: String, required: true },
    state:{ type: String, required: true },
    postalCode:{ type: String, required: true },
    location: {
      type: {type: String, enum: ['Point']},
      coordinates: {type: [Number]}
    },
    eventDays:[
        {
            startTime:{type: Date, required: true},
            endTime:{type: Date, required: true}
        }
    ],
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

schema.pre('save', async function (next) {
    try {
        res = await geocoder.geocode({ address: `${this.address1} ${this.city}, ${this.state} ${this.postalCode}` });
        this.location = {type:"Point", coordinates:[res[0].longitude, res[0].latitude ]};
           
      next()
    } catch (error) {
      next(error)
    }
  })

module.exports = mongoose.model('Listing', schema);