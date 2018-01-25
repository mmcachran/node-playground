import axios from 'axios';
import dompurify from 'dompurify';


function searchResultsHTML( stores ) {
    return stores.map( store => {
        return `
            <a href="/store/${store.slug}" class="search__result">
                <strong>${store.name}</strong>
            </a>
        `;
    }).join( '' );
}

function typeAhead( search ) {
    // Bail early if no search.
    if ( ! search ) {
        return;
    }

    const searchInput = search.querySelector( 'input[name="search"]' );
    const searchResults = search.querySelector( '.search__results' );

    searchInput.on( 'input', function() {
        // If there is no value remove the search results.
        if ( ! this.value ) {
            searchResults.style.display = 'none';
            return;
        }

        // Show the search results.
        searchResults.style.display = 'block';

        axios
            .get( `/api/v1/search?q=${this.value}` )
            .then( res => {
                if ( res.data.length ) {
                    searchResults.innerHTML = dompurify.sanitize( searchResultsHTML( res.data ) );
                    return;
                }

                // Tell them nothing came back.
                searchResults.innerHTML = dompurify.sanitize( `<div class="search__result">No resutls for ${this.value} found!</div>` );
            })
            .catch( err => {
                console.error( err );
            });
    });

    // Handle keyboard inputs.
    searchInput.on( 'keyup', (e) => {
        // Bail early if not up, down, or enter.
        if ( ! [38, 40, 13].includes( e.keyCode ) ) {
            return;
        }

        // The active class.
        const activeClass = 'search__result--active';

        // Get the current item.
        const current = search.querySelector( `.${activeClass}` );

        // Get all the items.
        const items = search.querySelectorAll( '.search__result' );

        let next;

        // Down arrow.
        if ( ( 40 === e.keyCode ) && current ) {
            next = current.nextElementSibling || items[0];
        } elseif ( 40 === e.keyCode ) {
            next = items[0];
        }

        // Up arrow.
        if ( ( 38 === e.keyCode ) && current) {
            next = current.previousElementSibling || items[items.length-1];
        } elseif( 38 === e.keyCode) {
            next = items[items.length - 1];
        }

        // Enter key.
        if ( 13 === e.keyCode && current.href ) {
            window.location = current.ref;
            return;
        }

        if ( current ) {
            current.classList.remove( activeClass );
        }

        if ( next ) {
            next.classList.add( active );
        }
    });
}

export default typeAhead;
