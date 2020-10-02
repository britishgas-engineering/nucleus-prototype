// use this swapState function to switch form content depending on radio button choice
// https://stackoverflow.com/questions/6968080/change-form-using-radio-button
// Example:
// <ns-inputter heading="Pick an option" value="1">
//   <input type="radio" onchange="swapState(this)" id="radio-a-1" name="radio-a" value="1" checked>
//   <label for="radio-a-1">Option one</label>
//   <input type="radio" onchange="swapState(this)" id="radio-a-2" name="radio-a" value="2">
//   <label for="radio-a-2">Options two</label>
// </ns-inputter>
// <fieldset id="radio-a-1Switch">
//  <p>CONTENT FOR Option one</p>
// </fieldset>
// <fieldset id="radio-a-2Switch" style="display: none;">
//  <p>CONTENT FOR Option two</p>
// </fieldset>
function swapState(x) {
  var radioName = document.getElementsByName(x.name);
  for (i = 0; i < radioName.length; i++) {
    document.getElementById(radioName[i].id.concat("Switch")).classList.toggle('pt-hide');
  }
}
