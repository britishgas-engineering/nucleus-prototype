function getDynamicURL() {
    var data = document.querySelector('ns-inputter[name="meter-type"]').value;



    if (data === 'smart') {
        return '../summary';
    }

    if (data === 'non-smart') {
        alert('You selected Non Smart');
        return '../summary';
    }
}