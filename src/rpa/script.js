/* change-image
  display a different image if a particular option has been chosen.
*/

function getFormData(form, field) {
  var obj = this.model[form];
  if (obj && obj.fields) {
    return obj.fields.find((obj) => {
      return obj.name === field;
    }).value;
  }
  return null;
}

var value = getFormData('L4-type', 'inputter-a');

var imgURLa = 'https://user-images.githubusercontent.com/28779/80490030-aa915500-8958-11ea-9bc5-dcfa4e6d7015.jpg'
if (value === 'electricity meter') {
  imgURLa = 'https://user-images.githubusercontent.com/52657167/80401869-f38fcd80-88b4-11ea-8154-8cc0718d38fa.jpg';
}
document.querySelector('#image-a').setAttribute('image', imgURLa);

var imgURLb = 'https://user-images.githubusercontent.com/52657167/80400977-80398c00-88b3-11ea-8fa7-ddb2e3b1fc46.jpg'
if (value === 'electricity meter') {
  imgURLb = 'https://user-images.githubusercontent.com/52657167/80401866-f2f73700-88b4-11ea-882b-bd14eebc046b.jpg';
}
document.querySelector('#image-b').setAttribute('image', imgURLb);

var imgURLc = 'https://user-images.githubusercontent.com/52657167/80400977-80398c00-88b3-11ea-8fa7-ddb2e3b1fc46.jpg'
if (value === 'electricity meter') {
  imgURLc = 'https://user-images.githubusercontent.com/52657167/80400974-7e6fc880-88b3-11ea-95f2-ee0c2fc5f9fb.jpg';
}
if (value === 'smart energy monitor') {
  imgURLc = 'https://user-images.githubusercontent.com/52657167/80400978-80398c00-88b3-11ea-8656-aa6086ab68fa.jpg';
}
document.querySelector('#image-c').setAttribute('image', imgURLc);
