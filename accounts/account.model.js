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
    email: { type: String, lowercase: true, unique: true, required: true },
    passwordHash: { type: String, required: true },
    title: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String},
    city: { type: String, required: true },
    state:{ type: String, required: true },
    postalCode:{ type: String, required: true },
    longitude: { type: Number},
    latitude: { type: Number},
    acceptTerms: Boolean,
    role: { type: String, required: true },
    verificationToken: String,
    verified: Date,
    resetToken: {
        token: String,
        expires: Date
    },
    passwordReset: Date,
    created: { type: Date, default: Date.now },
    updated: Date
});

schema.virtual('isVerified').get(function () {
    return !!(this.verified || this.passwordReset);
});

schema.pre('save', async function (next) {
    try {
        res = await geocoder.geocode({ address: `${this.address1} ${this.city}, ${this.state} ${this.postalCode}` });
        this.latitude = res[0].latitude;    
        this.longitude = res[0].longitude;   
      next()
    } catch (error) {
      next(error)
    }
  })

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.passwordHash;
    }
});

module.exports = mongoose.model('Account', schema);