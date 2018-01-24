const mongoose = require( 'mongoose' );
const Store = mongoose.model( 'Store' );

exports.homePage = (req, res) => {
    res.render( 'index' );
};

exports.addStore = ( req, res ) => {
    res.render( 'editStore', { title: 'Add Store' } );
};

exports.createStore = async (req,res) => {
    // Save POST data to Store model.
    const store = new Store(req.body);

    // Save the store data.
    await store.save();

    // Log out a message.
    res.redirect( '/' );
};
