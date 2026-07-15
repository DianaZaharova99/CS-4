//Итератор по случайным числам
//Необходимо написать функцию-генератор для создания итератора, генерирующего случайные числа в заданном диапазоне.

function random(min, max) {
  let i = 0;

  return Iterator.from({
    next() {
      i++;
      return {
        done: false,
        value: Math.floor(Math.random() * (max - min)) + min,
      };
    },
  });
}

const randomInt = random(0, 100);

console.log(randomInt.next().value); // Случайное число от 0 до 100
console.log(randomInt.next().value);
console.log(randomInt.next().value);
console.log(randomInt.next().value);

//==========================================================================================================================
//Итератор по диапазонам значений
//Необходимо написать класс Range, который позволяет создавать диапазоны чисел или символов и обходить элементы Range с любого конца.

class Range {
  #type;
  #from;
  #to;
  #current;

  constructor(from, to) {
    this.#type = typeof from;
    this.#from = this.#type === "string" ? from.codePointAt(0) : from;
    this.#to = this.#type === "string" ? to.codePointAt(0) : to;
    this.#current = this.#from;
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    if (this.#current > this.#to) {
      return { done: true, value: undefined };
    }

    const value =
      this.#type === "string"
        ? String.fromCharCode(this.#current)
        : this.#current;

    this.#current += 1;
    return { done: false, value };
  }

  reverse() {
    return Array.from(this).reverse();
  }
}

const symbolRange = new Range("a", "f");

console.log(Array.from(symbolRange)); // ["a", "b", "c", "d", "e", "f"]

const numberRange = new Range(-5, 1);
console.log(Array.from(numberRange.reverse())); // [1, 0, -1, -2, -3, -4, -5]

//==========================================================================================================================
//Итератор по DOM с селектором
//Необходимо написать функцию-итератор для поиска DOM-узлов, начиная с заданного, по CSS-селектору. Функция должна работать лениво
// и не запускать поиск сразу по всему DOM-дереву, а выполнять его по мере необходимости (при каждом вызове next()).

function querySelectorAllLazy(selector, domElement) {
  const stack = [domElement];

  return Iterator.from({
    next() {
      while (stack.length) {
        let current = stack.pop();

        for (let i = current.children.length - 1; i >= 0; i--) {
          stack.push(current.children[i]);
        }

        if (current.matches(selector)) {
          return { done: false, value: current };
        }
      }

      return { done: true, value: undefined };
    },
  });
}

const iter = querySelectorAllLazy(".item", document.body);

console.log(iter.next().value); // Первый элемент с классом .item div.header.item.n1
console.log(iter.next().value); // Второй элемент span.header.item

// Поиск продолжается только при вызове next()
