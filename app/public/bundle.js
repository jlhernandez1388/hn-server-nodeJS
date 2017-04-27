/* imports for webpack build */

// images
require.context('./img/', true, /\.(jpe?g|png|gif|svg)$/i);

// styles
import 'normalize.css/normalize.css';
import './css/main.styl';

// js
import app from './js/index';
app();
