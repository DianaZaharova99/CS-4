//Проверка email
const emailRegex = /[\w.-]+@[a-z\d.-]+\.[a-z]{2,6}$/;

console.log(emailRegex.test("user@example.com")); // true
console.log(emailRegex.test("test@mail.ru")); // true
console.log(emailRegex.test("user123@domain.org")); // true
console.log(emailRegex.test("invalid-email")); // false
console.log(emailRegex.test("user@.com")); // false
console.log(emailRegex.test("user@domain")); // false
console.log(emailRegex.test("user@domain.c")); // false

//====================================================================
//Поиск всех чисел в тексте

const numberRegex = /(?<!\w)-?\.?\d+\.?\d?(?!\w)/g;
const text1 = "The price is 100.5 dollars, -5 degrees, and version2 is 1out.";

const numbers = text1.match(numberRegex);
console.log(numbers); // [ '100.5', '-5' ]

//====================================================================
//Извлечение дат из текста

const dateRegex =
  /((?<day>[0-2]\d|3[0-1])\.(?<month>0[1-9]|1[0-2])\.(?<year>19\d{2}|20\d{2}))|((?<year1>19\d{2}|20\d{2})-(?<month1>0[1-9]|1[0-2])-(?<day1>[0-2]\d|3[0-1]))/g;
const text2 =
  "Today is 15.01.2025 and tomorrow is 2025-01-16. Invalid: 32.13.2025";

const dates = text2.match(dateRegex);
console.log(dates); // ["15.01.2025", "2025-01-16"]
