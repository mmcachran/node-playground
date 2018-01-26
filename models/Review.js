const mongoose = require( 'mongoose' );
mongoose.Promise = global.Promise;

const ReviewSchema = new mongoose.Schema({

});

module.exports = mongoose.model( 'Review', reviewSchema );