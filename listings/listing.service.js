const db = require('_helpers/db');
const Role = require('_helpers/role');
const secret = process.env.SECRET;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    const listings = await db.Listing.find();
    return listings.map(x => basicDetails(x));
}

async function getById(id) {
    const listing = await getListing(id);
    return basicDetails(listing);
}

async function create(params, req) {

    const listing = new db.Listing(params);

    listing.account = req.user.id;

    // save listing
    await listing.save();


    return basicDetails(listing);

}

async function update(id, params) {
    const listing = await getlisting(id);

    // copy params to listing and save
    Object.assign(listing, params);
    listing.updated = Date.now();
    await listing.save();

    return basicDetails(listing);
}

async function _delete(id) {
    const listing = await getListing(id);
    await listing.remove();
}

// helper functions

async function getListing(id) {
    if (!db.isValidId(id)) throw 'listing not found';
    const listing = await db.Listing.findById(id);
    if (!listing) throw 'listing not found';
    return listing;
}


function basicDetails(listing) {
    const { id} = listing;
    return { id };
}