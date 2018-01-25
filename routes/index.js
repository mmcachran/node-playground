const express         = require('express');
const router          = express.Router();
const storeController = require( '../controllers/storeController' );
const userController  = require( '../controllers/userController' );
const authController = require('../controllers/authController');
const { catchErrors } = require( '../handlers/errorHandlers' );

// Do work here
router.get( '/', catchErrors( storeController.getStores ) );

router.get( '/stores', catchErrors( storeController.getStores ) );
router.get( '/add', 
    authController.isLoggedIn,
    storeController.addStore
);

router.get( '/stores/:id/edit', catchErrors( storeController.editStore ) );
router.get( '/store/:slug', catchErrors(storeController.getStoreBySlug ) );

router.get( '/tags', catchErrors( storeController.getStoresByTag ) );
router.get( '/tags/:tag', catchErrors(storeController.getStoresByTag ) );

router.get('/login', userController.loginForm );
router.get('/register', userController.registerForm);

router.get( '/logout', authController.logout );

router.get( '/account',
    userController.account,
    authController.isLoggedIn
);

router.get( '/account/reset/:token', catchErrors( authController.reset ) );

// POST Routes
router.post( '/add',
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors( storeController.createStore )
);
router.post('/add/:id',
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors( storeController.updateStore ) 
);

router.post( '/account',
    catchErrors(userController.updateAccount)
);

router.post( '/login', authController.login );

// 1. Validate the registration data
// 2. register the user
// 3. we need to log them in
router.post( '/register',
    userController.validateRegister,
    // we need to know about errors if 
    // validation will be passed, but registration 
    // will be failed in some reasons, e.g. second 
    // registration with same email
    catchErrors(userController.register),
    authController.login
);

router.post( '/account/forgot', catchErrors( authController.forgot ) );

router.post( '/account/reset/:token', 
    authController.confirmedPasswords,
    catchErrors( authController.update )
);

/**
 * API Endpoints.
 */
router.get( '/api/v1/search', catchErrors( storeController.searchStores )  );

module.exports = router;
