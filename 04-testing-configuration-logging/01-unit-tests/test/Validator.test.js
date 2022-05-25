const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 'Lalala'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });
    it('валидатор проверяет числовые поля', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate({age: 16});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 16');
    });

    it('валидатор не показывает ошибок если переданные данные валидны', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 10,
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate({name: 'Lalala', age: 18});

      expect(errors).to.have.length(0);
    });

    it('возвращается массив', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      let errors = validator.validate({name: 'Lalalalala'});
      expect(errors).to.be.an('array');
      errors = validator.validate({name: 'Lala'});
      expect(errors).to.be.an('array');
    });
    it('если в валидатор передано поле которого нет в описании правил - возвращается ошибка с некорректным именем поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 10,
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate({namez: 'La', age: 5});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('namez');
      expect(errors[0]).to.have.property('error').and.to.be.equal('field with name "namez" is not exist');
    });
    it('если значение "max" меньше значения "min" - возвращается ошибка', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 5,
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate({name: 'La', age: 5});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('max value can not be less than min value - got min: "10", max "5"');
    });
    it('значение поля "type" должно быть "string" или "number"', () => {
      const validator = new Validator({
        name: {
          type: 'stringASD',
          min: 10,
          max: 15,
        },
      });

      const errors = validator.validate({name: 'La'});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('type should be a string or number, but got "stringASD"');
    });
    it('значение "min" должно быть числом', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: '10asd',
          max: 15,
        },
      });

      const errors = validator.validate({name: 'La'});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('min value should be a number, but got "string"');
    });
    it('значение "max" должно быть числом', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: '10asd',
        },
      });

      const errors = validator.validate({name: 'La'});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('max value should be a number, but got "string"');
    });
  });
});
