//Реализовать операции циклического сдвига влево и вправо

function cyclicLeftShift(num, count) {
  if (count === 0) return num;

  //сдвиг <=
  const shift = num << count;
  //достаем биты утраченные при переполнении
  const lost = num >>> (32 - count);

  //соединяем
  return shift | lost;
}

function cyclicRightShift(num, count) {
  if (count === 0) return num;

  //сдвиг =>
  const shift = num >>> count;
  //достаем биты утраченные при переполнении
  const lost = num << (32 - count);

  //соединяем
  return shift | lost;
}

const num = 0b10000000_00000000_00000000_00000001;

// Биты отбрасываемые из-за переполнения слева дополняются справа
const shiftLeft = cyclicLeftShift(num, 1);
const shiftLeftHalf = cyclicLeftShift(num, 32 / 2);
const shiftRight = cyclicRightShift(num, 2);
const shiftRightHalf = cyclicRightShift(num, 32 / 2);

const showInConsole = (val) => {
  console.log(val.toString(2).padStart(32, "0"));
};

showInConsole(shiftLeft); //00000000000000000000000000000011
showInConsole(shiftLeftHalf); //00000000000000011000000000000000
showInConsole(shiftRight); //01100000000000000000000000000000
showInConsole(shiftRightHalf); //00000000000000011000000000000000

// ------------------------------------------------------------------------
//Написать функции для кодирования и декодирования строк

const upper = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
const lower = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
const digits = "0123456789";
const punctuation = ".,!?;:-—()\"'«»[]{}";
const controls = " \t\n";
const alphabet = upper + lower + digits + punctuation + controls;

const charToCode = {};
const codeToChar = {};

for (let i = 0; i < alphabet.length; i++) {
  const char = alphabet[i];
  charToCode[char] = i;
  codeToChar[i] = char;
}

const MyEncoding = {
  encode(str) {
    const arr = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      arr[i] = charToCode[str[i]];
    }
    return arr;
  },
  decode(bytes) {
    const strArr = [];
    for (let i = 0; i < bytes.length; i++) {
      strArr.push(codeToChar[bytes[i]]);
    }

    return strArr.join("");
  },
};

const bytes = MyEncoding.encode("Какая-то строка!"); // Uint8Array
console.log(bytes); //Uint8Array(16) [11, 33, 44, 33, 65, 82,52, 48, 94, 51, 52, 50,48, 44, 33, 78]
console.log(MyEncoding.decode(bytes)); // "Какая-то строка!"
