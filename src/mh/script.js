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
var inputs = document.querySelectorAll('#choice-options input[type="checkbox"]');
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
