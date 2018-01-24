const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const slug = require('slugs');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please enter a store name',
    },
    slug: String,
    description: {
        type: String,
        trim: true,
    },
    tags: [String],
    created: {
        type: Date,
        default: Date.now,
    },
    location: {
        type: {
            type: String,
            default: 'Point',
        },
        coordinates: [{
            type: Number,
            require: 'You must supply coordinates!'
        }],
        address: {
            type: String,
            required: 'You must supply an address!' 
        }
    },
    photo: String
});

storeSchema.pre( 'save', async function(next) {
    if ( ! this.isModified( 'name' ) ) {
        next(); // Skip it.
        return; // Stop this function from running;
    }

    // Generate the slug from the title.
    this.slug = slug(this.name);

    // Find other stores that may have the same slug.
    const slugRegEx = new RegExp( `^(${this.slug})((-[0-9]*$)?)$`, 'i' );
    const storesWithSlug = await this.constructor.find({ slug: slugRegEx });

    // Overwrite slug if any stores match.
    if ( storesWithSlug ) {
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    }

    next();
});

module.exports = mongoose.model( 'Store', storeSchema );
