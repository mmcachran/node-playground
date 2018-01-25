import axios from 'axios';
import dompurify from 'dompurify';

function searchResultsHTML(stores) {
    return stores.map(store => {
        return `
			<a href="/store/${store.slug}" class="search__result">
				<strong>${store.name}</strong>
			</a>
		`;
    }).join('');
}

function typeAhead(search) {
    // Bail early if no search.
    if (!search) {
        return;
    }

    const searchInput = search.querySelector('input[name="search"]');
    const searchResults = search.querySelector('.search__results');

    searchInput.on('input', function () {
        // Bail early if no value.
        if (!this.value) {
            searchResults.style.display = 'none';
            return;
        }

        // show the search results!
        searchResults.style.display = 'block';

        axios
            .get(`/api/v1/search?q=${this.value}`)
            .then(res => {
                if (res.data.length) {
                    searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data));
                    return;
                }
                // tell them nothing came back
                searchResults.innerHTML = dompurify.sanitize(`<div class="search__result">No results for ${this.value}</div>`);
            })
            .catch(err => {
                console.error(err);
            });
    });

    // handle keyboard inputs
    searchInput.on('keyup', (e) => {
        // Bail early if not pressing up, down or enter.
        if ( ! [38, 40, 13].includes( e.keyCode ) ) {
            return;
        }

        const activeClass = 'search__result--active';
        const current = search.querySelector(`.${activeClass}`);
        const items = search.querySelectorAll('.search__result');
        let next;

        if ( ( 40 === e.keyCode ) && current) {
            next = current.nextElementSibling || items[0];
        } else if ( 40 === e.keyCode ) {
            next = items[0];
        } else if ( (38 === e.keyCode ) && current) {
            next = current.previousElementSibling || items[items.length - 1]
        } else if ( 38 === e.keyCode ) {
            next = items[items.length - 1];
        } else if ( ( 13 === e.keyCode ) && current.href) {
            window.location = current.href;
            return;
        }

        if (current) {
            current.classList.remove( activeClass );
        }
        next.classList.add( activeClass );
    });
}

export default typeAhead;
