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

exports.editStore = async ( req, res ) => {
    // Find the store given the ID.
    const store = await Store.findOne({ _id: req.params.id });

    // Confirm owner of the store.
    // ToDo

    // Render the edit form so the user can update the store.
    res.render( 'editStore', { title: `Edit ${store.name}`, store } );
}

exports.updateStore = async ( req, res ) => {
    // Find and update the store.
    const store = await Store.findOneAndUpdate(
        { _id: req.params.id }, // Query
        req.body, // Data
        {
            new: true, // Returns the new store instead of the old store
            runValidators: true,
        } // Options
    ).exec();

    // Show success message.
    req.flash( 'success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store</a>` );

    // Redirect to the store.
    res.redirect( `/stores/${store._id}/edit` );
}
