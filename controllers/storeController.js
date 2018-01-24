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
    const store = await (new Store(req.body)).save();

    // Show alert.
    req.flash( 'success', `Successfully Created ${store.name}. Care to leave a review?` );

    // Log out a message.
    res.redirect( `/store/${store.slug}` );
};

exports.getStores = async (req,res) => {
    // Query the database for a list of all stores.
    const stores = await Store.find();

    // Render the template.
    res.render( 'stores', { title: 'Stores', stores } );
};
