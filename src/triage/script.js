function submitForm() {
  const form = document.querySelector('ns-form');
  const formData = form.validate();
  console.log(formData);
}
