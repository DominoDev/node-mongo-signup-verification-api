const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const listingService = require('./listing.service');

// routes
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.post('/', authorize(), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);


module.exports = router;


function getAll(req, res, next) {
    //console.log(req.user.id);
    listingService.getAll()
        .then(listings => res.json(listings))
        .catch(next);
}

function getById(req, res, next) {
    // users can get their own listing and admins can get any listing
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    listingService.getById(req.params.id)
        .then(listing => listing ? res.json(listing) : res.sendStatus(404))
        .catch(next);
}

function createSchema(req, res, next) {
    console.log('listing.createSchema')
    const schema = Joi.object({
        description: Joi.string().required(),
        address1: Joi.string().required(),
        address2: Joi.string().allow(''),
        city: Joi.string().required(),                        
        state: Joi.string().required(),                        
        postalCode: Joi.string().required(), 
        eventDays: Joi.array().items(Joi.object({
            startTime: Joi.date().required(),
            endTime: Joi.date().required()}))
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    console.log('listing.create');
    console.log(req.user);
    listingService.create(req.body, req)
        .then(listing => res.json(listing))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schemaRules = {
        description: Joi.string().empty(''),
        address1: Joi.string().empty(''),
        address2: Joi.string().empty(''),
        city: Joi.string().empty(''),
        state: Joi.string().empty(''),
        postalCode: Joi.string().empty(''),
        eventDays: Joi.array().items(Joi.object({
            startTime: Joi.date().empty(''),
            endTime: Joi.date().empty('')}))    
    };

    // only admins can update role
    if (req.user.role === Role.Admin) {
        schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty('');
    }

    const schema = Joi.object(schemaRules).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    // users can update their own listing and admins can update any listing
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    listingService.update(req.params.id, req.body)
        .then(listing => res.json(listing))
        .catch(next);
}

function _delete(req, res, next) {
    // users can delete their own listing and admins can delete any listing
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    listingService.delete(req.params.id)
        .then(() => res.json({ message: 'listing deleted successfully' }))
        .catch(next);
}