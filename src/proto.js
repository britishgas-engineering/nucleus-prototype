var watchers = {};
var model = loadModel() || {};
var currentFormIndex = model.currentFormIndex || 0;

checkModel();
updateUI();
minimise();

// Add validation listeners to forms to keep track of index
var forms = document.querySelectorAll('ns-form-summary');
forms.forEach((form, index) => {
    form.setAttribute('nf-form-index', index);
    form.addEventListener('edit', (event) => {
        currentFormIndex = parseInt(event.currentTarget.getAttribute('nf-form-index'), 10);
        model.currentFormIndex = currentFormIndex;
        minimise();
    })
    form.addEventListener('validated', (event) => {
        if (event.detail.validation.isValid) {
            currentFormIndex = parseInt(event.currentTarget.getAttribute('nf-form-index'), 10) + 1;
            model.currentFormIndex = currentFormIndex;
            minimise();
            saveModel(model);
        }
    });
});

// CTA actions

var ctas = document.querySelectorAll('ns-cta');
ctas.forEach((cta) => {
    if (cta.getAttribute('nf-href')) {
        cta.addEventListener('click', (event) => {
            var button = event.currentTarget;
            //Check if this is in a form
            var form = button.parentElement.querySelector('ns-form');

            if (form) {
                console.log('This is in a form!!!!');
                if(form.isValid) {
                    console.log('Form is valid lets move to next page: ' + cta.getAttribute('nf-href'));
                    button.setAttribute('loading', 'true');
                    saveModel(model);
                    loadURL(cta.getAttribute('nf-href'));
                }
            } else {
                console.log('This is NOT in a form!!!!');
            }
        });
    }
});

function loadURL(url) {
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

function minimise() {
    var forms = document.querySelectorAll('ns-form-summary');
    forms.forEach((form, index) => {

        if(index === currentFormIndex - 1) {
            form.scrollIntoView();
        }

        if (index <= currentFormIndex) { 
            form.style.display = 'block';
            setTimeout(() => {
                form.formVisible = index === currentFormIndex;
            }, 0);
            
        } else {
            // Hide unvisited forms
            form.style.display = 'none';
        }
    });
}

// If form isnt defined in model then create an entry
function checkModel() {
    var forms = document.querySelectorAll('ns-form');
    forms.forEach((form) => {
        const path = form.getAttribute('nf-model');
        if (path) {
            var page = path.split('.')[1];
            if(!model[page]) {
                console.log('Auto creating model for ' + path);
                model[page] = {
                    fields: []
                }
            }
        }
    });
}

function updateUI() {
    // Populate UI from model json
    var forms = document.querySelectorAll('ns-form');
    forms.forEach((form) => {
        const path = form.getAttribute('nf-model');
        if (path) {
            var formData = getModelData(path);
            if(!formData) {
                console.log('Auto generating model data for ' + path);
            }
            // Update UI from data
            // formData.fields.forEach((field) => {
            //     console.log(field.name, field.value);
            //     const inputter = form.querySelector(`ns-inputter[name="${field.name}"]`);
            //     if(inputter) {
            //         inputter.value = field.value;
            //     }
            // })

            // Or we could update all fields, so you could have duplicate fields????
            var inputters = form.querySelectorAll('ns-inputter').forEach((inputter) => {
                var fieldName = inputter.getAttribute('name');
                console.log('update field ' + fieldName + ' ' + formData);
                var val = formData.fields && formData.fields.find((field) => {
                    return (field.name === fieldName);
                });
                if (val) {
                    console.log('Set inputter value ' + inputter + ' ' + val);
                    inputter.setAttribute('value', val.value);
                }
            });
        }
    });

    // Update text with nf-model
    var spans = document.querySelectorAll('[nf-model]');
    
    spans.forEach((span) => {
        var path = span.getAttribute('nf-model').split('.');
        var prop = path.pop();
        var model = getModelData(path.join('.'));
        var text = model.fields && model.fields.find((field) => {
            return field.name === prop;
        })

        if(text && text.value) {
            span.innerText = text.value;
        }
        
        
    });
}

// Add event listenrs to ALL inputters
var forms = document.querySelectorAll('ns-form');
forms.forEach((form, index) => {
    const formPath = form.getAttribute('nf-model');
    if (formPath) {
        form.querySelectorAll('ns-inputter').forEach((inputter) => {
            inputter.removeEventListener('change', changeHandler);
            inputter.setAttribute('nf-model-path', formPath + '.fields.' + inputter.getAttribute('name'));
            inputter.addEventListener('change', changeHandler);
        });
    }
});

function changeHandler(event) {
    if(event.target.getAttribute('nf-model-path')) {
        setModelData(event.target.getAttribute('nf-model-path'), event.target.value);
    }
}

function loadModel() {
    var localStorage = window.localStorage;
    return JSON.parse(localStorage.getItem('nf-model'));
}

function saveModel(model) {
    var json = JSON.stringify(model);
    var localStorage = window.localStorage;
    localStorage.setItem('nf-model', json);
}

function getModelData(path) {
    var arr = path.split('.');
    if(arr[0] !== 'model') {
        throw new Error('Model path must start with model.');
    }
    var obj = model;
    arr.shift();
    arr.forEach((prop) => {
        if (obj.hasOwnProperty(prop)) {
            obj = obj[prop];
        } else {
            throw new Error('Property not found: ', prop);
        }
        
    });
    return obj;
}

function setModelData(path, value) {
    var arr = path.split('.');
    if(arr[0] !== 'model') {
        throw new Error('Model path must start with model.');
    }
    var obj = model;
    arr.shift();
    arr.forEach((prop, index) => {
        if (index < arr.length -1) {
            if (obj.hasOwnProperty(prop)) {
                obj = obj[prop];
            } else {
                obj[prop] = {};
            }
        }

        if (index === arr.length -1) {
            // We are in fields array here so find record
            const fieldsArray = obj;
            const fieldObject = fieldsArray.find((field) => {
                return field.name === prop;
            });

            if(fieldObject) {
                fieldObject.value = value;
            } else {
                // create field
                fieldsArray.push({name: prop, value: value});
            }
        }  
    });
}
