import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import NotFound from './NotFound';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../base';

class App extends React.Component {
    constructor() {
        super();

        // getInitialState
        this.state = {
            fishes: {},
            order: {},
        };

        this.addFish = this.addFish.bind( this );
        this.updateFish = this.updateFish.bind(this);
        this.removeFish = this.removeFish.bind(this);
        this.loadSamples = this.loadSamples.bind(this);
        this.addToOrder = this.addToOrder.bind(this);
        this.removeFromOrder = this.removeFromOrder.bind(this);
    }

    componentWillMount() {
        // This runs right before the <App> is rendered.
        this.ref = base.syncState( `${this.props.params.storeId}/fishes`, 
        {
            context: this,
            state: 'fishes',
        } );

        const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}` );

        if ( localStorageRef) {
            // Update of App components order state.
            this.setState({
                order : JSON.parse( localStorageRef )
            });
        }
    }

    componentWillUnmount() {
        base.removeBinding( this.ref );
    }

    componentWillUpdate( nextProps, nextState ) {
        localStorage.setItem( `order-${this.props.params.storeId}`, JSON.stringify(nextState.order) );
    }

    addFish(fish) {
        // Copy current state.
        const fishes = {...this.state.fishes};

        // Get the current timestamp.
        const timestamp = Date.now();

        // Add in the new fish.
        fishes[`fish-${timestamp}`] = fish;

        // Set state.
        this.setState( { fishes } );
    }

    updateFish(key, updatedFish) {
        const fishes = {...this.state.fishes};
        fishes[key] = updatedFish;
        this.setState({ fishes });
    }

    removeFish(key) {
        const fishes = { ...this.state.fishes };

        fishes[key] = null;
        this.setState({ fishes });
    }

    loadSamples() {
        this.setState({
            fishes : sampleFishes
        });
    }

    addToOrder(key) {
        // Take a copy of state.
        const order = {...this.state.order};

        // Update or add the new number of fish ordered.
        order[key] = order[key] + 1 || 1;

        // Update our state.
        this.setState({ order });
    }

    removeFromOrder(key) {
        // Copy the order state.
        const order = {...this.state.order};

        delete order[key];
        
        this.setState({ order });
    }

    render() {
        return(
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market" />
                    <ul className="list-of-fishes">
                        {
                            Object
                                .keys(this.state.fishes)
                                .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />)
                        }
                    </ul>
                </div>
                <Order 
                    fishes={this.state.fishes} 
                    order={this.state.order} 
                    params={this.props.params} 
                    removeFromOrder={this.removeFromOrder} />
                <Inventory 
                    fishes={this.state.fishes} 
                    addFish={this.addFish} 
                    updateFish={this.updateFish} 
                    removeFish={this.removeFish}
                    loadSamples={this.loadSamples} 
                    storeId={this.props.params.storeId}/>
            </div>
        )
    }
}

App.propTypes = {
    params: React.PropTypes.object.isRequired
};

export default App;