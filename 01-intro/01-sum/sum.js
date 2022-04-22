function sum(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  } else {
    throw new TypeError('One of arguments is not a number');
  }
}

sum(1, 2);

// В модуле sum.js необходимо реализовать функцию, которая принимает два аргумента
// и возвращает их сумму. Если аргументы не являются числами —
// функция должна бросать ошибку TypeError.
// sum(1, 2); // 3
// sum('1', []); // TypeError

module.exports = sum;
