var blankModel = {
    optional: 
    {
        fields: [

        ]
    },
    details: 
    {
        fields: [
            {
                name: 'surname',
                value: 'Smith'
            }
        ]
    },
    account: 
    {
        fields: [
            
        ]
    },
    order: {
        fields: [
            {
                name: 'order',
                value: '1 x Worcester boiler 2300'
            }
        ]
    },
    banking: 
    {
        fields: [
            
        ]
    },
      
};

var watchers = {};
var model = loadModel() || blankModel;
var currentFormIndex = model.currentFormIndex || 0;

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

function updateUI() {
    // Populate UI from model json
    var forms = document.querySelectorAll('ns-form');
    forms.forEach((form) => {
        const path = form.getAttribute('nf-model');
        var formData = getModelData(path);
        formData.fields.forEach((field) => {
            console.log(field.name, field.value);
            const inputter = form.querySelector(`ns-inputter[name="${field.name}"]`);
            if(inputter) {
                inputter.value = field.value;
            }
        })
    });
}

// Add event listenrs to ALL inputters
var forms = document.querySelectorAll('ns-form');
forms.forEach((form, index) => {
    const formPath = form.getAttribute('nf-model');
    form.querySelectorAll('ns-inputter').forEach((inputter) => {
        inputter.removeEventListener('change', changeHandler);
        inputter.setAttribute('nf-model-path', formPath + '.fields.' + inputter.getAttribute('name'));
        inputter.addEventListener('change', changeHandler);
    });
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
