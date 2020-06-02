var watchers = {};
var model = loadModel() || {};
var currentFormIndex = model.currentFormIndex || 0;

checkModel();
updateUI();
minimise();

// Add validation listeners to forms to keep track of index
var forms = document.querySelectorAll('ns-form-summary');
forms.forEach(function(form, index) {
    form.setAttribute('nf-form-index', index);
    form.addEventListener('edit', function (event) {
        currentFormIndex = parseInt(event.currentTarget.getAttribute('nf-form-index'), 10);
        model.currentFormIndex = currentFormIndex;
        minimise();
    })
    form.addEventListener('validated', function (event) {
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
ctas.forEach(function (cta) {
    cta.setAttribute('loading', 'false');
    if (cta.getAttribute('nf-href')) {
        cta.addEventListener('click', function (event) {
            //doHide();
            var button = event.currentTarget;
            //Check if this is in a form
            var form = button.parentElement.nodeName === 'NS-FORM' ? button.parentElement : button.parentElement.querySelector('ns-form');
            if (form) {
                console.log('This is in a form!!!!');
                if(form.isValid) {
                    button.setAttribute('loading', 'true');
                    saveModel(model);
                    var nextURL = cta.getAttribute('nf-href') === 'DYNAMIC' ? getDynamicURL() : cta.getAttribute('nf-href');
                    loadURL(nextURL);
                }
            } else {
                console.log('This is NOT in a form!!!!');
            }
        });
    }
});

// function getDynamicURL() {
//     return 'default dynamic url';
// }

function loadURL(url) {
    setTimeout(function () {
        window.location.href = url;
    }, 500);
}

function minimise() {
    var forms = document.querySelectorAll('ns-form-summary');
    forms.forEach(function (form, index) {

        if(index === currentFormIndex - 1) {
            form.scrollIntoView();
        }

        if (index <= currentFormIndex) { 
            form.style.display = 'block';
            setTimeout(function () {
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
    forms.forEach(function (form) {
        var path = form.getAttribute('nf-model');
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
    forms.forEach(function (form) {
        var path = form.getAttribute('nf-model');
        if (path) {
            var formData = getModelData(path);
            if(!formData) {
                console.log('Auto generating model data for ' + path);
            }

            // Or we could update all fields, so you could have duplicate fields????
            var inputters = form.querySelectorAll('ns-inputter, ns-datepicker').forEach(function (inputter) {
                var fieldName = inputter.getAttribute('name');
                console.log('update field ' + fieldName + ' ' + formData);
                var val = formData.fields && formData.fields.find(function (field) {
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
    
    spans.forEach(function (span) {
        var path = span.getAttribute('nf-model').split('.');
        var prop = path.pop();
        var model = getModelData(path.join('.'));
        var text = model.fields && model.fields.find(function (field) {
            return field.name === prop;
        })

        if(text && text.value) {
            span.innerText = text.value;
        }
        
        
    });
}

// Add event listenrs to ALL inputters
var forms = document.querySelectorAll('ns-form');
forms.forEach(function (form, index) {
    var formPath = form.getAttribute('nf-model');
    if (formPath) {
        form.querySelectorAll('ns-inputter, nsx-address-selector, ns-datepicker').forEach(function (inputter) {
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

function clearStorage() {
    var localStorage = window.localStorage;
    localStorage.removeItem('nf-model');
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
    arr.forEach(function (prop) {
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
    arr.forEach(function (prop, index) {
        if (index < arr.length -1) {
            if (obj.hasOwnProperty(prop)) {
                obj = obj[prop];
            } else {
                obj[prop] = {};
            }
        }

        if (index === arr.length -1) {
            // We are in fields array here so find record
            var fieldsArray = obj;
            var fieldObject = fieldsArray.find(function (field) {
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


var createAddress = function (houseNumber) {
    var addressLine1 = houseNumber + 'Kings Road';
    var address = {
      addressLine1: addressLine1,
      addressLine2: 'Little Village',
      postalTown: 'Townsville',
      county: 'Surrey',
      postcode: 'AA1 2BB'
    };
    var label = address.addressLine1 + ', ' + address.addressLine2 + ', ' + address.postalTown + ', ' + address.county + ', ' + address.postcode;
    address.label = label;
    return address;
  };

var manyAddresses = [createAddress(10), createAddress(11), createAddress(12), createAddress(13), createAddress(14), createAddress(15)];

var addresses = [createAddress(10), createAddress(11), createAddress(12)];

var addressSelector = document.querySelector('nsx-address-selector');
if(addressSelector) {
    addressSelector.addEventListener('postcode-selected', function (event) {
        setTimeout(function () {
            var arr;
            if (event.detail.postcode.indexOf('A') !== -1) {
                arr = manyAddresses;
            } else {
                arr = addresses;
            }
            // Customise addresses to match postcode
            arr.forEach(function (obj) {
                obj.postcode = event.detail.postcode;
                obj.label = obj.addressLine1 + ', ' + obj.addressLine2 + ', ' + obj.postalTown + ', ' + obj.county + ', ' + obj.postcode;
            });
            event.target.addresses = arr;
        }, 1000);
    });
}

if(addressSelector) {
    // Hide submit button
    document.querySelector('#submit-button').setAttribute('style', 'display: none');
    addressSelector.addEventListener('address-selected', function (event) {
        console.log('Address selected ' + event.detail.address.label);
        //document.querySelector('#confirm-address-button').setAttribute('style', 'display: block');
        if(event.target.getAttribute('nf-model-path')) {
            setModelData(event.target.getAttribute('nf-model-path'), event.target.value.label);
        }
    });
}

if(addressSelector) {
    addressSelector.addEventListener('address-selected', function (event) {
        if (event.detail.address) {
            document.querySelector('#submit-button').setAttribute('style', 'display: block');
        } else {
            document.querySelector('#submit-button').setAttribute('style', 'display: none');
        }
    });
}

//Check for clear storage attribute
var clearNode = document.querySelector('[nf-clear]');
if (clearNode) {
    clearStorage();
}


// Hard code AB test
// Very quick last minute hacky sulution
console.log('AB test ' + window.location.href);
var url = window.location.href;
var querystring = window.location.search;

// save cookie if variant is present
if (querystring.indexOf('variant=a') !== -1) {
    document.cookie = "variant=a";
}
if (querystring.indexOf('variant=b') !== -1) {
    variant = 'b';
    document.cookie = "variant=b";
}

function getCookie(name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
}


// Hide calendar for variants

if (document.cookie.indexOf('variant=a') !== -1) {
    if(url.indexOf('intro') !== -1) {
        hideCalendar();
    }
}

if(document.cookie.indexOf('variant=b') !== -1) {
    if(url.indexOf('start-date') !== -1) {
        hideCalendar();
    }
}

function hideCalendar() {
    var dp = document.querySelector('ns-datepicker');
    if (dp) {
        dp.setAttribute('hascalendar', 'false');
    }
}


// Address selector prototype



var multiPremise = [createAddress(1), createAddress(101), createAddress(202)];

// Logged in multi premise

var userLoggedIn = getCookie('userLoggedIn') === 'true';
var userMultiPremise = getCookie('userMultiPremise') === 'true';
var allowManualAddress = getCookie('allowManualAddress') === 'true';

// Set defaults if not set
if (getCookie('userLoggedIn') === undefined) {
    document.cookie = "userLoggedIn=false";
}
if (getCookie('userMultiPremise') === undefined) {
    document.cookie = "userMultiPremise=false";
}
if (getCookie('allowManualAddress') === undefined) {
    document.cookie = "allowManualAddress=false";
}


var addressSelector = document.querySelector('nsx-address-selector');
if(addressSelector) {
    if(userLoggedIn) {
        if(userMultiPremise) {
            addressSelector.addresses = multiPremise;
        } else {
            addressSelector.addresses = [multiPremise[0]];
        }
    }

    addressSelector.allowManualAddress = allowManualAddress;
}