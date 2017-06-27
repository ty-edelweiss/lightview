import logic from './logic';

const cache = [];
const handleSource = document.getElementsByClassName('source')[0]

window.onload = function(ev) {
    logic(handleSource);
}
