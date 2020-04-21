function getDynamicURL() {
    var data = document.querySelector('ns-inputter[name="energy-type"]').value;

    if (data === 'pay-as-you-go') {
        return '../summary';
    }

    if (data === 'monthly') {
        return '../meter';
    }
}