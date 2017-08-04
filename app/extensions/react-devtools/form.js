/**
 * @authors
 */
const tpl = require('./form.tpl');
/**
 * @param {slot} {default}
 */
Vue.component('mp-form', {

  name: 'mp-form',
  template: tpl,
  data() {
    return {};
  },
  created() {

    const me = this;

    this.fields = Object.create(null);

    this.APIs = Object.create(null, {
      getFields: {
        value: function getFields() {
          const formFields = Object.create(null);
          Object.keys(me.fields).forEach((fieldName) => {
            const instanceArray = Array.isArray(me.fields[fieldName]) ? me.fields[fieldName] : [];
            formFields[fieldName] = [];
            instanceArray.forEach((instance) => {
              if (typeof instance.APIs.getValue !== 'function') return;
              formFields[fieldName].push(instance.APIs.getValue());
            });
            if (formFields[fieldName].length === 0) {
              delete formFields[fieldName];
            } else if (formFields[fieldName].length === 1) {
              formFields[fieldName] = formFields[fieldName][0];
            }
          });
          return formFields;
        }
      },
      registerField: {
        value: function registerField(fieldName, instance) {
          if (!Array.isArray(me.fields[fieldName])) {
            me.fields[fieldName] = [instance];
          } else {
            me.fields[fieldName].push(instance);
          }
        }
      },
      deregisterField: {
        value: function deregisterField(fieldName, instance) {
          const index = Array.isArray(me.fields[fieldName]) ? me.fields[fieldName].indexOf(instance) : -1;
          if (index >= 0) {
            me.fields[fieldName].splice(index, 1);
          }
        }
      },
      validate: {
        value: function validate(successCallback, failCallback) {
          const validateResult = Object.create(null);
          const promises = [];
          const fields = Object.keys(me.fields);
          /**
           * Push promise instances
           */
          fields.forEach((fieldName) => {
            const instanceArray = Array.isArray(me.fields[fieldName]) ? me.fields[fieldName] : [];
            instanceArray.forEach((instance) => {
              if (typeof instance.APIs.validate === 'function') {
                let subSuccessCallback;
                let subFailCallback;
                const validatePromise = new Promise((resolve) => {
                  subSuccessCallback = () => {
                    resolve({
                      status: 'success'
                    });
                  };
                  subFailCallback = (info) => {
                    resolve({
                      status: 'error',
                      info: info
                    });
                  };
                });
                instance.APIs.validate(subSuccessCallback, subFailCallback);
                promises.push(validatePromise);
              }
            });
          });
          /**
           * Wait for all validation.
           */
          Promise.all(promises).then((values) => {
            const fieldsValue = me.APIs.getFields();
            if (values.length !== promises.length) {
              failCallback(Object.create(null), fieldsValue);
              console.warn('mp-form promise error:', values);
            } else {
              let hasError = false;
              values.forEach((value, index) => {
                if (value.status === 'error') {
                  hasError = true;
                  validateResult[fields[index]] = value.info || {};
                }
              });
              hasError ? failCallback(validateResult, fieldsValue) : successCallback(fieldsValue);
            }
          });
        }
      }
    });

  }
});
