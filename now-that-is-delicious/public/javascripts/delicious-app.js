import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';
import ajaxHeart from './modules/heart';

// Autocomplete for add store page.
autocomplete( $('#address'), $('#lat'), $('#lng') );

// Autocomplete for header.
typeAhead( $('.search') );

// Map.
makeMap( $('#map') );

// Hearts.
const heartForms = $$( 'form.heart ' );
heartForms.on( 'submit', ajaxHeart );

