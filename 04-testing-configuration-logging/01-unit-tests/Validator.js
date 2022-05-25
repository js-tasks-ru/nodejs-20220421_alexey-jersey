module.exports = class Validator {
  constructor(rules) {
    this.rules = rules;
  }

  validate(obj) {
    const errors = [];

    for (const field of Object.keys(obj)) {
      if (!this.rules[field]) {
        errors.push({field, error: `field with name "${field}" is not exist`});
        return errors;
      }
    }

    for (const field of Object.keys(this.rules)) {
      const rules = this.rules[field];

      if (rules.type.toLowerCase() !== 'string' && rules.type.toLowerCase() !== 'number') {
        errors.push({field, error: `type should be a string or number, but got "${rules.type}"`});
        return errors;
      }

      if (!Number(rules.min)) {
        errors.push({field, error: `min value should be a number, but got "${typeof rules.min}"`});
        return errors;
      }

      if (!Number(rules.max)) {
        errors.push({field, error: `max value should be a number, but got "${typeof rules.max}"`});
        return errors;
      }

      if (rules.min > rules.max) {
        errors.push({field, error: `max value can not be less than min value - got min: "${rules.min}", max "${rules.max}"`});
        return errors;
      }

      const value = obj[field];
      const type = typeof value;

      if (type !== rules.type) {
        errors.push({field, error: `expect ${rules.type}, got ${type}`});
        return errors;
      }

      switch (type) {
        case 'string':
          if (value.length < rules.min) {
            errors.push({field, error: `too short, expect ${rules.min}, got ${value.length}`});
          }
          if (value.length > rules.max) {
            errors.push({field, error: `too long, expect ${rules.max}, got ${value.length}`});
          }
          break;
        case 'number':
          if (value < rules.min) {
            errors.push({field, error: `too little, expect ${rules.min}, got ${value}`});
          }
          if (value > rules.max) {
            errors.push({field, error: `too big, expect ${rules.min}, got ${value}`});
          }
          break;
      }
    }

    return errors;
  }
};
