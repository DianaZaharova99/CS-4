//Поточный парсер CSV с заданным разделителем

import * as fs from "node:fs";
import * as zlib from "node:zlib";
import * as readline from "node:readline";
import { PackrStream, UnpackrStream } from "msgpackr";

const names = ["Anna", "Maks", "Daniil", "Andrey", "Masha"];
const ages = [20, 30, 40, 50, 22];
const work = ["Developer", "Designer", "Artist", "Teacher", "Manager"];

parseCSV("./test.csv", ",", (err, data) => {
  if (err != null) {
    console.error(err);
    return;
  }

  console.log(data);
});

parseJson("./test.json", (err, data) => {
  if (err != null) {
    console.error(err);
    return;
  }

  console.log(data);
});

parseMsg("./test.msgpack", (err, data) => {
  if (err != null) {
    console.error(err);
    return;
  }

  console.log(data);
});

function parseCSV(file, separator, cb) {
  console.time("csv");
  console.time("csv latency");

  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity,
  });

  const data = [];
  let firstRow = true;
  let peak = 0;
  let row = 0;

  rl.on("line", (line) => {
    if (firstRow) {
      firstRow = false;
      console.timeEnd("csv latency");
    }

    if (row % 1000 === 0) {
      const current = process.memoryUsage().heapUsed;
      peak = Math.max(peak, current);
    }

    data.push(line.split(separator));
    row++;
  });

  rl.once("close", () => {
    console.timeEnd("csv");
    console.log("memory peak", peak);
    cb(null, data);
  });
}

function parseMsg(file, cb) {
  console.time("msg");
  console.time("msg latency");

  const stream = fs.createReadStream(file);
  const unpack = new UnpackrStream();
  stream.pipe(unpack);

  const data = [];
  let firstRow = true;
  let peak = 0;
  let row = 0;

  unpack.on("data", (obj) => {
    if (firstRow) {
      firstRow = false;
      console.timeEnd("msg latency");
    }
    if (row % 1000 === 0) {
      const current = process.memoryUsage().heapUsed;
      peak = Math.max(peak, current);
    }
    row++;

    data.push(obj);
  });

  unpack.on("end", () => {
    console.timeEnd("msg");
    console.log("memory peak msg", peak);
    cb(null, data);
  });
}

function parseJson(file, cb) {
  const before = process.memoryUsage().heapUsed;
  console.time("json");
  console.time("json latency");
  const content = fs.readFileSync(file);
  const data = JSON.parse(content);

  console.timeEnd("json latency");
  console.timeEnd("json");
  const after = process.memoryUsage().heapUsed;
  console.log("memory peak", (before + after) / 2);

  cb(null, data);
}

function createCSVFile() {
  let res = "";

  function getRandom() {
    return Math.floor(Math.random() * 4);
  }

  for (let i = 0; i < 500000; i++) {
    res += `${names[getRandom()]}, ${ages[getRandom()]}, ${work[getRandom()]} \n`;
  }
  fs.writeFileSync("test.csv", res);
  const csv = fs.readFileSync("test.csv");
  const compressed = zlib.gzipSync(csv);
  console.table({ "csv size gzip": compressed.length });
}

// createCSVFile();

function createJsonFile() {
  let res = [];

  function getRandom() {
    return Math.floor(Math.random() * 4);
  }

  for (let i = 0; i < 250000; i++) {
    res.push({
      name: names[getRandom()],
      age: ages[getRandom()],
      work: work[getRandom()],
    });
  }

  fs.writeFileSync("test.json", JSON.stringify(res));

  const json = fs.readFileSync("test.json");
  const compressed = zlib.gzipSync(json);
  console.table({ "json size gzip": compressed.length });
}

// createJsonFile();

function createMsgFile() {
  let packr = new PackrStream();
  let writer = fs.createWriteStream("test.msgpack");
  packr.pipe(writer);

  function getRandom() {
    return Math.floor(Math.random() * 4);
  }

  for (let i = 0; i < 250000; i++) {
    packr.write({
      name: names[getRandom()],
      age: ages[getRandom()],
      work: work[getRandom()],
    });
  }
}

// createMsgFile();

//Результаты:
// json latency: 68.032ms
// json: 71.867ms
// memory peak 16790832
// ┌────────────────┬────────┐
// │ json size gzip │ 432478 │
// └────────────────┴────────┘

// msg latency: 29.024ms
// msg: 102.476ms
// memory peak msg 24676056
// Msgpack все всем обходит csv

// csv latency: 75.052ms
// csv: 131.006ms
// memory peak 31006080
// ┌───────────────┬────────┐
// │ csv size gzip │ 778010 │
// └───────────────┴────────┘
// Json оказался быстрее по скорости, но в json нет возможность обработки дынных построчно
