//Кодирования массива UTF-8 строк переменной длины

class StringArray {
  #encoder = new TextEncoder();
  #decoder = new TextDecoder();
  #buffer;
  #view;
  #strings;

  constructor(strings) {
    this.#buffer = new ArrayBuffer(
      this.#getStringsLength(strings) + 4 + strings.length * 4,
    );
    this.#view = new DataView(this.#buffer);
    this.#strings = strings;
    this.encodeStrings();
  }

  decodeStrings() {
    const strCountInArr = this.#getUint32(0);
    const result = [];

    let offset = 4;
    for (let i = 0; i < strCountInArr; i++) {
      const stringsLength = this.#getUint32(offset);
      offset += 4;
      const s = this.#decoder.decode(
        new Uint8Array(this.#buffer, offset, stringsLength),
      );
      offset += stringsLength;

      result.push(s);
    }

    return result;
  }

  encodeStrings() {
    const uint8 = new Uint8Array(this.#buffer);

    let offset = 0;
    this.#view.setUint32(offset, this.#strings.length, true);
    offset += 4;

    for (let i = 0; i < this.#strings.length; i++) {
      const strInBuffer = this.#encoder.encode(this.#strings[i]);

      this.#view.setUint32(offset, strInBuffer.byteLength, true);
      offset += 4;
      uint8.set(strInBuffer, offset);
      offset += strInBuffer.byteLength;
    }

    return this.#buffer;
  }

  at(index) {
    const strCountInArr = this.#getUint32(0);
    const realIndex = index < 0 ? strCountInArr + index : index;

    if (realIndex < 0 || realIndex >= strCountInArr) return undefined;

    let offset = 4;
    for (let i = 0; i < strCountInArr; i++) {
      const stringsLength = this.#getUint32(offset);
      offset += 4;
      const s = this.#decoder.decode(
        new Uint8Array(this.#buffer, offset, stringsLength),
      );
      offset += stringsLength;

      if (i === realIndex) return s;
    }

    return undefined;
  }

  //хелпер
  #getUint32(offset) {
    return this.#view.getUint32(offset, true);
  }
  #getStringsLength(strings) {
    return strings.reduce(
      (acc, value) => acc + this.#encoder.encode(value).length,
      0,
    );
  }
}

const strings = ["hello", "мир", ""];

const stringArr = new StringArray(strings);

console.log(stringArr.at(0)); // "hello"
console.log(stringArr.at(-1)); // ""

const decoded = stringArr.decodeStrings();
console.log(decoded); // ["hello", "мир", ""]

//-------------------------------------------------------------------------------------------------------------
//Кодирования массива UTF-8 строк переменной длины с помощью ссылок

class StringArrayTable {
  #encoder = new TextEncoder();
  #decoder = new TextDecoder();
  #buffer;
  #view;
  #strings;

  constructor(strings) {
    this.#buffer = new ArrayBuffer(
      this.#getStringsLength(strings) + 4 + strings.length * 8,
    );
    this.#view = new DataView(this.#buffer);
    this.#strings = strings;
    this.encodeStrings();
  }

  decodeStrings() {
    const strCountInArr = this.#getUint32(0);
    const result = [];

    for (let i = 0; i < strCountInArr; i++) {
      result.push(this.at(i));
    }

    return result;
  }

  encodeStrings() {
    const uint8 = new Uint8Array(this.#buffer);

    //количество строк
    let offset = 0;
    this.#view.setUint32(offset, this.#strings.length, true);
    offset += 4;

    //офсет откуда начинаются данные строк
    let offsetData = 4 + this.#strings.length * 8;

    for (let i = 0; i < this.#strings.length; i++) {
      const strInBuffer = this.#encoder.encode(this.#strings[i]);

      this.#view.setUint32(offset, strInBuffer.byteLength, true);
      offset += 4;
      this.#view.setUint32(offset, offsetData, true);
      offset += 4;
      uint8.set(strInBuffer, offsetData);
      offsetData += strInBuffer.byteLength;
    }

    return this.#buffer;
  }

  at(index) {
    const strCountInArr = this.#getUint32(0);
    const realIndex = index < 0 ? strCountInArr + index : index;

    if (realIndex < 0 || realIndex >= strCountInArr) return undefined;

    const entryOffset = 4 + realIndex * 8;

    const length = this.#getUint32(entryOffset);
    const pointer = this.#getUint32(entryOffset + 4);
    return this.#decoder.decode(new Uint8Array(this.#buffer, pointer, length));
  }

  //хелпер
  #getUint32(offset) {
    return this.#view.getUint32(offset, true);
  }
  #getStringsLength(strings) {
    return strings.reduce(
      (acc, value) => acc + this.#encoder.encode(value).length,
      0,
    );
  }
}

const stringArrTable = new StringArrayTable(strings);

console.log(stringArrTable.at(0)); // "hello"
console.log(stringArrTable.at(-1)); // ""
console.log(stringArrTable.decodeStrings()); // ["hello", "мир", ""]

//--------------------------------------------------------------------------------------
// Сравните эффективность операции at в обеих реализациях.

const stringsPerf = Array.from({ length: 10000 }, (_, i) => "str" + i);
const a = new StringArray(stringsPerf);
const b = new StringArrayTable(stringsPerf);

function measure(name, fn) {
  const start = performance.now();

  fn();

  const end = performance.now();

  console.log(name, end - start, "ms");
}

measure("StringArray", () => {
  for (let i = 0; i < 10000; i++) {
    a.at(i % strings.length);
  }
});
measure("StringArrayTable", () => {
  for (let i = 0; i < 10000; i++) {
    b.at(i % strings.length);
  }
});

// StringArray 4.052900000000001 ms
// StringArrayTable 2.2453999999999965 ms
// Результат: метод at в 2 раза быстрее при кодировании с помощью ссылок
