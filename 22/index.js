//Поиск всех чисел в тексте

const numberRegex = /(?<=\s)(?<!\w)[-.]?\d+\.?\d?(?!\w)(?=\s)/g;
const text1 = "The price is 100.5 dollars, -5 degrees, and 1version1 2.0.1 is out.";

const numbers = text1.match(numberRegex);
console.log(numbers); // [ '100.5', '-5' ]

// ======================================================================================================
//Проверка сложности пароля
//Требования:
//
// Длина: от 8 до 20 символов
// Содержит хотя бы одну заглавную букву (A-Z)
// Содержит хотя бы одну строчную букву (a-z)
// Содержит хотя бы одну цифру (0-9)
// Содержит хотя бы один специальный символ (!@#$%^&*)

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,20}$/;

console.log(passwordRegex.test("Password123!")); // true
console.log(passwordRegex.test("Pass")); // false (меньше 8 символов)
console.log(passwordRegex.test("Password12345678910!!")); // false (больше 20 символов)
console.log(passwordRegex.test("PASSWORD123!")); // false (нет строчных)
console.log(passwordRegex.test("Password!")); // false (нет цифры)
console.log(passwordRegex.test("Pass123")); // false (нет спецсимвола)
console.log(passwordRegex.test("Password123")); // false (нет спецсимвола)
