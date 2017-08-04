/**
 * @authors jasonjwang
 */

/**
 * Get the closest form component and record it.
 * @private
 */
const getFormParent = function getFormParent(fieldName) {
  if (!fieldName) return;
  let parent = this.$parent;
  while (parent) {
    if (parent.$options.name === 'mp-form') {
      this.$formParent = parent;
      break;
    }
    parent = parent.$parent;
  }
};

/**
 *
 * @param obj
 * @param name
 * @param func
 */
const createFunctionIfNotExist = (obj, name, func) => {
  if (typeof obj[name] !== 'function') {
    obj[name] = func;
  }
};

/**
 *
 * @param fieldName
 * @param valueKey
 * @returns {*}
 */
module.exports = (fieldName, valueKey) => {
  return (component) => {
    const initialCreated = component.created;
    component.created = function created(...args) {
      if (typeof initialCreated === 'function') {
        initialCreated.apply(this, args);
      }
      this.$formParent = null;
      getFormParent.call(this, this[fieldName]);
      if (Object.prototype.toString.call(this.APIs) !== '[object Object]') {
        this.APIs = Object.create(null);
      }
      if (valueKey) {
        const me = this;
        createFunctionIfNotExist(this.APIs, 'setValue', (value) => {
          me[valueKey] = value;
        });
        createFunctionIfNotExist(this.APIs, 'getValue', () => me[valueKey]);
        createFunctionIfNotExist(this.APIs, 'getFormParent', () => me.$formParent);
      }
    };

    if (fieldName) {

      const originalMounted = component.mounted;

      component.mounted = function mounted(...args) {
        this.$formParent && this.$formParent.APIs.registerField(this[fieldName], this);
        if (typeof originalMounted === 'function') {
          originalMounted.apply(this, args);
        }
      };

      const originalDestroy = component.beforeDestroy;

      component.beforeDestroy = function mounted(...args) {
        this.$formParent && this.$formParent.APIs.deregisterField(this[fieldName], this);
        if (typeof originalDestroy === 'function') {
          originalDestroy.apply(this, args);
        }
      };

      if (!component.watch) {
        component.watch = {};
      }

      const originalWatch = component.watch[fieldName];

      component.watch[fieldName] = function watch(...args) {
        if (typeof component.watch === 'function') {
          originalWatch.apply(this, args);
        }
        if (!this.$formParent) return;
        const oldVal = args[1];
        oldVal && this.$formParent.APIs.deregisterField(oldVal);
        const newVal = args[0];
        newVal && this.$formParent.APIs.registerField(newVal, this);
      };
    }
    return component;
  };
};