const passport = require( 'passport' );
const crypto = require( 'crypto' );
const mongoose = require( 'mongoose' );
const User = mongoose.model( 'User' );
const promisify = require( 'es6-promosify' );

exports.login = passport.authenticate( 'local', {
    failureRedirect: '/login',
    failureFlash: 'Failed login!',
    successRedirect: '/',
    successFlash: 'You are now logged in'
});

exports.logout = (req,res) => {
    req.logout();
    req.flash( 'success', 'You are now logged out! 👋' );
    res.redirect( '/' );
};

exports.isLoggedIn = ( req, res, next ) => {
    if ( req.isAuthenticated() ) {
        return next(); // User is logged in.
    }

    req.flash( 'error', 'You must be logged in!' );
    res.redirect( '/login' );
};

exports.forgot = async (req, res) => {
    // See if the user exists.
    const user = await User.findOne( { email: req.body.email } );

    // Display an error if no account exists with that email.
    if ( ! user ) {
        req.flash( 'error', 'No account with that email exists.' );
        return res.redirect( '/login' );
    }

    // Set reset tokens and expiry on the account.
    user.resetPasswordToken = crypto.randomBytes(20).toString( 'hex' );
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now.
    await user.save();

    // Send user an email with the token.
    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    req.flash( 'success', `You have been emailed a password reset link. ${resetURL}` );

    // Redirect to the login page after email token has been sent.
    res.redirect( '/login' );
};

exports.reset = async( req, res ) => {
    const user = await User.findOne( {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if ( ! user ) {
        req.flash( 'error', 'Password reset is invalid or has expired!' );
        return res.redirect( '/login' );
    }

    // Show the reset password form.
    res.render( 'reset', { title: 'Reset your Password' } );
};

exports.confirmedPasswords = ( req,res,next ) => {
    // Check if the password fields match.
    if ( req.body.password === req.body['password-confirm'] ) {
        return next();
    }

    req.flash( 'error', 'Passwords do not match!' );
    res.redirect( 'back' );
};

exports.update = async (req, res ) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if ( ! user ) {
        req.flash('error', 'Password reset is invalid or has expired!');
        return res.redirect('/login');
    }

    // Update the user's password.
    const setPassword = promisify( user.setPassword, user );
    await setPassword( req.body.password );

    // Remove the password reset keys.
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Update the user.
    const updatedUser = await user.save();

    // Login the user.
    await req.login( updatedUser );

    // Show the user a message.
    req.flash('Success', 'Your password has been reset!' );

    // Redirect the user.
    res.redirect( '/' );
};
