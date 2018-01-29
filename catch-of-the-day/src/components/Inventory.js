import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends React.Component {
    constructor() {
        super();

        this.renderInventory = this.renderInventory.bind(this);
        this.handleChange    = this.handleChange.bind(this);
        this.renderLogin     = this.renderLogin.bind(this);
        this.authenticate    = this.authenticate.bind(this);
        this.authHandler     = this.authHandler.bind(this);
        this.logout          = this.logout.bind(this);

        this.state = {
            uid: null,
            owner: null,
        };
    }

    componentDidMount() {
        base.onAuth((user) => {
            if (user) {
                this.authHandler( null, {user} );
            }
        });
    }

    logout() {
        base.unauth();
        this.setState({
            uid: null,
        });
    }

    renderLogin() {
        return (
            <nav className="login">
                <h2>Inventory</h2>
                <p>Sign in to manage your store's inventory</p>

                <button className="github" onClick={() => this.authenticate('github')}>
                    Login with Github
                </button>

                <button className="facebook" onClick={() => this.authenticate('facebook')}>
                    Login with Facebook
                </button>

                <button className="twitter" onClick={() => this.authenticate('twitter')}>
                    Login with Twitter
                </button>
            </nav>
        );
    }

    authenticate(provider) {
        base.authWithOAuthPopup(provider, this.authHandler );
    }

    authHandler( err, authData ) {
        if ( err ) {
            console.log( err );
            return;
        }

        // Grab the store info.
        const storeRef = base.database().ref(this.props.storeId);

        // Query the fireabase once for the store data.
        storeRef.once( 'value', (snapshot) => {
            const data = snapshot.val() || {};

            if ( ! data.owner ) {
                storeRef.set({
                    owner: authData.user.uid,
                });
            }

            this.setState({
                uid: authData.user.uid,
                owner: data.owner || authData.user.uid,
            });
        });
    }

    logout() {
        base.unauth();
        this.setState({
            uid: null,
        });
    }

    handleChange(e, key) {
        const fish = this.props.fishes[key];

        // Take a copy of the fish and update it with the new data.
        const updatedFish = {
            ...fish,
            [e.target.name]: e.target.value
        };

        this.props.updateFish( key, updatedFish );
    }

    renderInventory(key) {
        const fish = this.props.fishes[key];
        return(
            <div className="fish-edit" key={key}>
               <input name="name" onChange={(e) => this.handleChange(e, key)} value={fish.name} type="text" placeholder="Fish Name" />
               <input name="price" onChange={(e) => this.handleChange(e, key)} value={fish.price} type="text" placeholder="Fish Price" />
               <select name="status" onChange={(e) => this.handleChange(e, key)} value={fish.status}>
                   <option value="available">Fresh!</option>
                   <option value="unavailable">Sold Out!</option>
               </select>
               <textarea name="desc" onChange={(e) => this.handleChange(e, key)} value={fish.desc} placeholder="Fish Desc"></textarea>
               <input name="image" onChange={(e) => this.handleChange(e, key)} value={fish.image} type="text" placeholder="Fish Image" />
                <button onClick={() => this.props.removeFish}>Remove Fish</button>
            </div>
        )
    }

    render() {
        const logout = <button onClick={this.logout}>Logout</button>;

        // Check if the user is not logged in.
        if ( ! this.state.uid ) {
            return <div>{this.renderLogin()}</div>
        }

        // Check if they are teh owner of the current store.
        if ( this.state.uid !== this.state.owner ) {
            return (
                <div>
                    <p>Sorry you aren't the owner of this store!</p>
                    {logout}
                </div>
            );
        }

        return (
            <div>
                <h2>Inventory</h2>
                {logout}
                {Object.keys(this.props.fishes).map(this.renderInventory)}
                <AddFishForm addFish={this.props.addFish} />
                <button onClick={this.props.loadSamples} >Load Sample Fishes</button>
            </div>
        )
    }

    static propTypes = {
        fishes: React.PropTypes.object.isRequired,
        updateFish: React.PropTypes.func.isRequired,
        removeFish: React.PropTypes.func.isRequired,
        addFish: React.PropTypes.func.isRequired,
        loadSamples: React.PropTypes.func.isRequired,
        storeId: React.PropTypes.string.isRequired,
    };
}

export default Inventory;
