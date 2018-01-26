const mongoose = require( 'mongoose' );
const Store = mongoose.model( 'Store' );
const multer = require('multer');
const jimp = require( 'jimp' );
const uuid = require( 'uuid' );
const User = mongoose.model( 'User' );

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith( 'image/' );

        if ( isPhoto ) {
            next( null, true );
        } else {
            next( { message: 'That file type isn\'t allowed' }, false );
        }
    },
};

exports.homePage = (req, res) => {
    res.render( 'index' );
};

exports.addStore = ( req, res ) => {
    res.render( 'editStore', { title: 'Add Store' } );
};

// Stores the file in memory of the server.
exports.upload = multer(multerOptions).single('photo');

// Resize the image.
exports.resize = async( req, res, next ) => {
    // Check if there is no new file to resize.
    if ( ! req.file ) {
        next(); // Skip to the next middleware
        return;
    }

    // Get the uploaded file's extension.
    const extension = req.file.mimetype.split( '/' )[1];

    // Create a unique ID for the image.
    req.body.photo = `${uuid.v4()}.${extension}`;

    // Read in the buffer.
    const photo = await jimp.read( req.file.buffer );

    // Resize the folder.
    await photo.resize( 800, jimp.AUTO );

    await photo.write( `./public/uploads/${req.body.photo}` );

    // Once we have written the photo to our filesystem, keep going!
    next();
};

exports.createStore = async (req,res) => {
    // Set the currently logged in user as the author of this new store.
    req.body.author = req.user._id;

    // Save POST data to Store model.
    const store = await ( new Store( req.body ) ).save();

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

const confirmOwner = (store, user) => {
    if ( ! store.author.equals( user._id ) ) {
        throw Error( 'You must own a store in order to edit it!');
    }
};

exports.editStore = async ( req, res ) => {
    // Find the store given the ID.
    const store = await Store.findOne({ _id: req.params.id });

    // Confirm owner of the store.
    confirmOwner( store, req.user );

    // Render the edit form so the user can update the store.
    res.render( 'editStore', { title: `Edit ${store.name}`, store } );
};

exports.updateStore = async ( req, res ) => {
    // Set the location data to be a point.
    //req.body.location.coordinates.type = 'Point';

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
};

// Displays a store by slug.
exports.getStoreBySlug = async(req, res) => {
    // Fetch the store by slug.
    const store = await Store.findOne({ slug: req.params.slug }).populate( 'author reviews' );

    // Bail early if no store.
    if ( ! store ) {
        return next();
    }

    res.render( 'store', { store, title: store.name });
};

exports.getStoresByTag = async (req,res) => {
    // Get the current tag.
    const tag = req.params.tag;
    const tagQuery = tag || { $exists: true };

    // Fetch our data.
    const tagsPromise = Store.getTagsList();
    const storesPromise = Store.find({ tags: tagQuery } );
    const [tags, stores] = await Promise.all( [tagsPromise, storesPromise] );
    
    // Render the view.
    res.render( 'tags', { tags, stores,  title: 'Tags', tag } );
};

exports.searchStores = async ( req, res ) => {
    const stores = await Store
    // Find the stores.
    .find({
        $text: {
            $search: req.query.q
        }
    }, {
        score: { $meta: 'textScore' }
    })
    // Sort by score.
    .sort({
        score: { $meta : 'textScore' }
    })
    // Only return the top 5 results.
    .limit( 5 );

    res.json( stores );
};

exports.mapStores = async (req, res ) => {
    const coordinates = [req.query.lng, req.query.lat].map( parseFloat );

    const q = {
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates
                },
                $maxDistance: 10000 // 10km
            }
        }
    };

    // Fetch stores.
    const stores = await Store.find( q ).select( 'slug name description location photo' ).limit(10);

    res.json( stores );
};

exports.mapPage = (req, res ) => {
    res.render( 'map', 
        { 
        title: 'Map' 
        } 
    );
};

exports.heartStore = async ( req, res ) => {
    const hearts = req.user.hearts.map( obj => obj.toString() );
    const operator = hearts.includes( req.params.id ) ? '$pull' : '$addToSet';
    const user = await User
        .findByIdAndUpdate( req.user._id,
            {
                [operator]: {hearts: req.params.id }
            },
            { new: true }
        );

    res.json( user );
};

exports.getHearts = async (req, res ) => {
    const stores = await Store.find( {
        _id: { $in: req.user.hearts },
    } );

    res.render( 'stores', { title: 'Hearted Stores', stores } );
};

exports.getTopStores = async (req, res ) => {
    const stores = await Store.getTopStores();

    res.json( stores  );
    //res.render( 'topStores', { stores, title: '⭐ Top Stores!' } );
};