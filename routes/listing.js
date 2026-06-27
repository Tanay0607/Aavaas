const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const methodOverride = require('method-override');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('../schemaValidation.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const multer = require('multer');
const { storage } = require('../cloudconfig.js');
const upload = multer({ storage });



router.get('/', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({}).populate('owner');
    res.render("listings/index.ejs", { allListings });
}));

router.get('/new', isLoggedIn, (req,res)=>{
    res.render("listings/new.ejs");
})

router.get('/:id', wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : 'reviews', populate: {path: 'author'}}).populate('owner');
    if(!listing){
        req.flash('error', 'Blog not found');
        res.redirect('/listings');
    }
    res.render("listings/show.ejs", { listing });
}));



router.post('/',isLoggedIn,upload.single('listing[image]'), validateListing, wrapAsync(async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image = {url, filename};
    await listing.save();
    req.flash('success', 'Blog created successfully');
    res.redirect("/listings");
}));


router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash('error', 'Blog not found');
        res.redirect('/listings');
    }
    res.render("listings/edit.ejs", { listing });
}));

router.put("/:id",isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing =await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    
    req.flash('success', 'Blog updated');
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id",isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Blog Deleted!');
    res.redirect("/listings");
}));

module.exports = router;