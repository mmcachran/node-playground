const mongoose = require( 'mongoose' );
const Store = mongoose.model( 'Store' );

exports.homePage = (req, res) => {
    res.render( 'index' );
};

exports.addStore = ( req, res ) => {
    res.render( 'editStore', { title: 'Add Store' } );
};

exports.createStore = (req,res) => {
    // Save POST data to Store model.
    const store = new Store(req.body);

    //Save the data in MongoDB.
    store.save(function(err,store) {
        if ( ! err ) {
            console.log( 'It worked' );
            res.redirect('/');
        }
    });

    
};