const instructions = {
  "SET A": 0,
  "PRINT A": 1,
  "IFN A": 2,
  RET: 3,
  "DEC A": 4,
  JMP: 5,
};

const program = [
  // Ставим значения аккумулятора
  instructions["SET A"],
  // В 10
  10,

  // Выводим значение на экран
  instructions["PRINT A"],

  // Если A равно 0
  instructions["IFN A"],

  // Программа завершается
  instructions["RET"],

  // И возвращает 0
  0,

  // Уменьшаем A на 1
  instructions["DEC A"],

  // Устанавливаем курсор выполняемой инструкции
  instructions["JMP"],

  // В значение 2
  2,
];

//Получаем строковое представление команды
function getInstructionByCode(code) {
  let command = "";
  Object.entries(instructions).forEach((el) => {
    if (el[1] === code) command = el[0];
  });

  return command;
}

function execute(program) {
  let storage = 0;

  for (let i = 0; i <= program.length; i++) {
    switch (getInstructionByCode(program[i])) {
      case "SET A":
        //Записываем значение в переменную
        storage = program[i + 1];
        break;
      case "PRINT A":
        //Вывод переменной
        console.log(storage);
        break;
      case "IFN A":
        //Если переменная не равна нулю пропускаем шаг с выходом
        //Если переменная равна нулю дальше шаг с выходом
        if (storage !== 0) i = i + 2;
        break;
      case "RET":
        //Выход с аргументом из программы
        return program[i + 1];
      case "DEC A":
        //Декремент
        storage = storage - 1;
        break;
      case "JMP":
        //Переход на шаг программы
        i = program[i + 1] - 1;
        break;
    }
  }
}

// Выведет в консоль
// 10
// 9
// 8
// 7
// 6
// 5
// 4
// 3
// 2
// 1
// 0
// И вернет 0
execute(program);
