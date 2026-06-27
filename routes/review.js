const express = require('express');
const router = express.Router({ mergeParams: true });
const methodOverride = require('method-override');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('../schemaValidation.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, validateReview, isOwner, isReviewOwner } = require('../middleware.js');



router.post('/',isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success', 'New Review Added');
    res.redirect(`/listings/${listing._id}`);
}));

router.delete('/:reviewId',isLoggedIn,isReviewOwner, wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully');
    res.redirect(`/listings/${id}`);
}));

module.exports = router;