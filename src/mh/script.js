

var inputs = document.querySelectorAll('input[type="checkbox"]');
var psr = [];

inputs.forEach((input) => {
  input.addEventListener('input', (event) => {
    if (event.target.checked) {
      if (psr.indexOf(event.target.value) === -1) {
        psr.push(event.target.value);
      }
    } else {
      psr.splice(psr.indexOf(event.target.value), 1);
    }

    console.log('PSR - User has selected: ' + psr);
    
    // TODO - Drew, this should probably have an ID rather than the 3rd panel
    var finalPanel = document.querySelectorAll('ns-panel')[2];
    if (psr.length > 0) {
      finalPanel.classList.add('psr-option');
    } else {
      finalPanel.classList.remove('psr-option');
    }

  });
});
