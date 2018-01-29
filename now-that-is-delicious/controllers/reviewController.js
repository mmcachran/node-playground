const mongoose = require( 'mongoose' );
const Review = mongoose.model( 'Review' );

exports.addReview = async ( req, res ) => {
    req.body.author = req.user._id;
    req.body.store = req.params.id;

    // Store data in the model.
    const newReview = new Review( req.body );

    // Save the data.
    await newReview.save();

    // Flash success and redirect back to the store.
    req.flash( 'success', 'Review Saved!' );
    res.redirect( 'back' );
};
