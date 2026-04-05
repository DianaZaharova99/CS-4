class BCD {
  array = null;
  length = 0;

  constructor(num) {
    this.array = new Uint8Array(this.createArray(num));
    this.length = num.toString().length;
  }

  //Хелпер для создания массива чисел
  createArray(num) {
    const stringArray = num.toString().split("");
    let arr = [];

    //добавляем ноль вперед если число нечетное
    if (stringArray.length % 2 !== 0) stringArray.unshift(0);

    for (let i = 0; i < stringArray.length; i += 2) {
      arr.push((+stringArray[i] << 4) | +stringArray[i + 1]);
    }

    return arr;
  }

  toString() {
    let arr = [];
    this.array.forEach((el) => {
      arr.push(el >> 4);
      arr.push(el & 0b1111);
    });

    //убираем ноль
    if (arr[0] === 0) arr.shift();

    return arr.join("");
  }

  toNumber() {
    return +this.toString();
  }

  at(index) {
    //если число нечетное получаем сдвиг
    const offset = this.array.length * 2 - this.length;
    // получаем из отрицательного индекса положительный
    if (index < 0) index = this.length + index;
    //индекс со сдвигом
    const realIndex = index + offset;
    //получение нужного байта
    const byteIndex = Math.floor(realIndex / 2);
    // получение нужной половины
    const isHigh = realIndex % 2 === 0;
    const byte = this.array[byteIndex];

    return isHigh ? byte >> 4 : byte & 0b1111;
  }
}

const n = new BCD(65536);

console.log(n.toNumber()); // 65536

console.log(n.at(0)); // 6
console.log(n.at(1)); // 5

console.log(n.at(-1)); // 6
console.log(n.at(-2)); // 3


