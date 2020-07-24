/* .psr-option
When an item is chosen in the `#choice-options` add the class `.psr-option` class to the `#psr-option`.

```markup
<ns-panel id="psr-option">
  <div class="splash extra-help">
    {% include "./_includes/extra-help.njk" %}
  </div>
  <div class="splash psr-promise">
    {% include "./_includes/psr-promise.njk" %}
  </div>
</ns-panel>
```
*/
var inputs = document.querySelectorAll('#choice-options input[type="checkbox"]:not(.not-psr)');
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

    var psrOption = document.querySelector('#psr-option');
    if (psr.length > 0) {
      psrOption.classList.add('psr-option');
    } else {
      psrOption.classList.remove('psr-option');
    }
  });
});

var inputs2 = document.querySelectorAll('#choice-options input[type="checkbox"].not-psr');
var psr2 = [];

inputs2.forEach((input) => {
  input.addEventListener('input', (event) => {
    if (event.target.checked) {
      if (psr2.indexOf(event.target.value) === -1) {
        psr2.push(event.target.value);
      }
    } else {
      psr2.splice(psr2.indexOf(event.target.value), 1);
    }

    console.log('PSR - User has chosen: ' + psr2);

    var psrOption2 = document.querySelector('#psr-option');
    if (psr2.length > 0) {
      psrOption2.classList.add('psr-option2');
    } else {
      psrOption2.classList.remove('psr-option2');
    }
  });
});

/* .np-show-comms */

jQuery('.np-show-comms').change(function () {
  if (jQuery(this).is(":checked")) {
    jQuery('.np-comms').addClass('np-show').removeClass('np-hide');
  } else {
    jQuery('.np-comms').removeClass('np-show').addClass('np-hide');
  }
});
