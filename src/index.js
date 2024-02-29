
"use strict";
// some code would be here

function round(num, digits = 1) { // Функция округления с указанием значащей цифры
    return Math.round(num * (10**digits)) / 10**digits
}

function data_set(id="", info="") {
    document.getElementById(id).innerHTML = info.toString();
}

let data = [ // Вариант номер 30
    56.4, 79.95, 101.81, 109.63, 57.05, 39.34,
   49.75, 56.01,  49.05, 105.95, 71.06, 77.36,
   59.71, 75.61,  34.52,   73.9, 77.55,  79.3,
   92.85, 74.06,  84.21,   57.2, 25.44, 78.57,
   58.07, 50.72,  48.05,  57.15, 64.17, 32.01,
   74.24, 48.38,  50.48,  87.96, 57.36, 48.27,
   62.67, 81.96, 103.32,  80.74, 74.06, 53.29,
  120.11,  32.7,  30.15, 100.47, 90.62, 47.15,
  127.77, 22.59,
    89.33,  23.28, 98.45,  34.6,   61.1,  60.96,
   103.72,   45.1, 93.75, 58.39,  85.03, 128.17,
    89.13,  53.06, 80.14, 34.25,  65.02,  54.17,
    66.58,  85.39, 38.56, 63.04,  73.58,  54.98,
    42.17,  99.36, 61.55, 76.81,  60.47,   96.2,
    69.23, 100.64, 76.95, 65.14, 116.75,  38.32,
    54.09,  82.59, 73.16, 52.28,  52.05,  70.02,
    50.67,  64.37, 55.44, 30.44,   48.6,  28.29,
    71.58,  94.72,  91.4, 79.93,  52.68,  61.07
];

// 1) Объем выборки
let n = data.length;
data_set("n", n)


// 2) Минимальное, максимальное и размах
let min = Math.min(...data);
let max = Math.max(...data);
let R = round(max - min, 2);

data_set("min", min);
data_set("max", max);
data_set("R", R);

// 3) Медиана и мода
data.sort((a, b) => a - b);
let mediana = data.at(Math.floor(n / 2));

let moda = 0;
let moda_length = 0;

let predict = 0;
let predict_length = 0;
for (let num of [...data, 0]) { // 0 в конце добавлен для того, чтобы не делать последнюю проверку
    if (num === predict) {
        predict_length++;
    } else {
        if (predict_length > moda_length) {
            moda = predict;
            moda_length = predict_length;
        }
        predict = num;
        predict_length = 1;
    }
}

// console.log(n, min, max, R, mediana, moda);
data_set("mediana", mediana);
data_set("moda", moda);

// 4) Построить интервальный вариационный ряд

// 4.1) определить число интервалов разбиения
let l = Math.floor(1 + 3.322*Math.log10(n));
data_set("l", l)

// 4.2) определить длину интервала разбиения, округлив его в большую сторону, оставив одну-две значащие цифры
let h = round((max - min) / l, 2)
data_set("h", h)

// console.log(l, h, h*l+min, max)

// 4.3) определить границы интервалов
// число элементов попадающих в каждый из интервалов
// относительные частоты (w[i] = n[i] / n)
// и величины (w[i] / h)

let intervalsArray = []
for (let i = 0; i < l; i++) intervalsArray.push({
    leftBorder: 0,
    rightBorder: 0,
    nums: [],
    w: 0, // nums.length / n
    height: 0 // w / h
})

let leftBorder = min
let rightBorder = min+h;
let i = 0;
let intervalId = 0;
while (i <= data.length) {

    if (i < data.length && data[i] < rightBorder) {
        intervalsArray[intervalId].nums.push(data[i]);
        i++;
        continue;
    } else {
        intervalsArray[intervalId].leftBorder = leftBorder;
        intervalsArray[intervalId].rightBorder = rightBorder;
        intervalsArray[intervalId].w = round(intervalsArray[intervalId].nums.length / n, 3);
        intervalsArray[intervalId].height = round(intervalsArray[intervalId].w / h, 3);

        if (i === data.length) break;

        leftBorder = rightBorder;
        rightBorder = rightBorder + h;
        intervalId++;
        if (intervalId === l-1) rightBorder = max+0.1;
        continue;
    }
}

intervalsArray.at(-1).rightBorder = max

data_set("xi", intervalsArray.map(obj => `[ ${obj.leftBorder}, ${obj.rightBorder} )`).join(", "))
data_set("ni", intervalsArray.map(obj => obj.nums.length).join(", "))
data_set("wi", intervalsArray.map(obj => obj.w).join(", "))
data_set("wi/h", intervalsArray.map(obj => round(obj.w / h, 3)).join(", "))


// console.log(intervalsArray.map(obj => obj.nums.length).reduce((acc, i) => acc+i, 0)) // проверка на соответствие n
// console.log(intervalsArray.map(obj => obj.w).reduce((acc, i) => acc+i, 0)) // проверка на соответствие w
// console.log(intervalsArray); // Вывод всего массива данных

// 6) Вычислить точечные оценки параметров распределения
let x_ = round(data.reduce((acc, i) => acc+i, 0) / n, 2); // выборочное среднее
let D = round(data.reduce((acc, i) => acc+(i - x_)**2, 0) / n, 2); // выборочную дисперсию
let sq = round((n / (n - 1)) * D, 2); // исправленную выборочную дисперсию

data_set("x_", x_);
data_set("D", D);
data_set("sq", sq);