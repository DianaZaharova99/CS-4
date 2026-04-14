//Реализация потока RGBA пикселей
type RGBA = [red: number, green: number, blue: number, alpha: number];

enum TraverseMode {
  RowMajor,
  ColMajor,
}

interface PixelStream {
  getPixel(x: number, y: number): RGBA;
  setPixel(x: number, y: number, rgba: RGBA): RGBA;
  forEach(
    mode: TraverseMode,
    callback: (rgba: RGBA, x: number, y: number) => void,
  ): void;
}

// Варианты представления данных
// Тип	            Описание
// flat-array	      Один Array чисел длины width*height*4
// array-of-arrays	Массив массивов: [[r,g,b,a], ...]
// array-of-objects	Массив объектов: [{r,g,b,a}, ...]
// typed-array	    Один Uint8Array длины width*height*4

const sizes = [10, 128, 720, 1080, 3840];
const pixel: RGBA = [255, 255, 255, 0];
const pixelObj = { r: 255, g: 255, b: 255, a: 0 };

class PixelStreamFlatArray {
  private readonly arr;
  private readonly size;

  constructor(size: number) {
    this.size = size;
    this.arr = new Array(size * size * 4).fill(0);
  }

  getPixel(x: number, y: number): RGBA {
    const startIndex = (y * this.size + x) * 4;

    return [
      this.arr[startIndex],
      this.arr[startIndex + 1],
      this.arr[startIndex + 2],
      this.arr[startIndex + 3],
    ];
  }

  setPixel(x: number, y: number, rgba: RGBA): RGBA {
    const startIndex = (y * this.size + x) * 4;
    this.arr[startIndex] = rgba[0];
    this.arr[startIndex + 1] = rgba[1];
    this.arr[startIndex + 2] = rgba[2];
    this.arr[startIndex + 3] = rgba[3];

    return [
      this.arr[startIndex],
      this.arr[startIndex + 1],
      this.arr[startIndex + 2],
      this.arr[startIndex + 3],
    ];
  }

  forEach(
    mode: TraverseMode,
    callback: (rgba: RGBA, x: number, y: number) => void,
  ): void {
    if (mode === TraverseMode.RowMajor) {
      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          const curPixel = this.getPixel(x, y);
          callback(curPixel, x, y);
          this.setPixel(x, y, pixel);
        }
      }
    }
    if (mode === TraverseMode.ColMajor) {
      for (let x = 0; x < this.size; x++) {
        for (let y = 0; y < this.size; y++) {
          const curPixel = this.getPixel(x, y);
          callback(curPixel, x, y);
          this.setPixel(x, y, pixel);
        }
      }
    }

    return;
  }
}

class PixelStreamArrayOfArrays {
  private readonly arr;
  private readonly size;

  constructor(size: number) {
    this.size = size;
    this.arr = new Array(size * size).fill(pixel);
  }

  getPixel(x: number, y: number): RGBA {
    const index = y * this.size + x;
    return this.arr[index];
  }

  setPixel(x: number, y: number, rgba: RGBA): RGBA {
    const index = y * this.size + x;
    this.arr[index] = rgba;
    return this.arr[index];
  }

  forEach(
    mode: TraverseMode,
    callback: (rgba: RGBA, x: number, y: number) => void,
  ): void {
    if (mode === TraverseMode.RowMajor) {
      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          const curPixel = this.getPixel(x, y);
          callback(curPixel, x, y);
          this.setPixel(x, y, pixel);
        }
      }
    }
    if (mode === TraverseMode.ColMajor) {
      for (let x = 0; x < this.size; x++) {
        for (let y = 0; y < this.size; y++) {
          const curPixel = this.getPixel(x, y);
          callback(curPixel, x, y);
          this.setPixel(x, y, pixel);
        }
      }
    }

    return;
  }
}

class PixelStreamTypedArray {
  private readonly arr;
  private readonly size;

  constructor(size: number) {
    this.size = size;
    this.arr = new Uint8Array(size * size * 4);
  }

  getPixel(x: number, y: number): RGBA {
    const startIndex = (y * this.size + x) * 4;

    return [
      this.arr[startIndex],
      this.arr[startIndex + 1],
      this.arr[startIndex + 2],
      this.arr[startIndex + 3],
    ];
  }

  setPixel(x: number, y: number, rgba: RGBA): RGBA {
    const startIndex = (y * this.size + x) * 4;
    this.arr[startIndex] = rgba[0];
    this.arr[startIndex + 1] = rgba[1];
    this.arr[startIndex + 2] = rgba[2];
    this.arr[startIndex + 3] = rgba[3];

    return [
      this.arr[startIndex],
      this.arr[startIndex + 1],
      this.arr[startIndex + 2],
      this.arr[startIndex + 3],
    ];
  }

  forEach(
    mode: TraverseMode,
    callback: (rgba: RGBA, x: number, y: number) => void,
  ): void {
    if (mode === TraverseMode.RowMajor) {
      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          const curPixel = this.getPixel(x, y);
          callback(curPixel, x, y);
          this.setPixel(x, y, pixel);
        }
      }
    }
    if (mode === TraverseMode.ColMajor) {
      for (let x = 0; x < this.size; x++) {
        for (let y = 0; y < this.size; y++) {
          const curPixel = this.getPixel(x, y);
          callback(curPixel, x, y);
          this.setPixel(x, y, pixel);
        }
      }
    }

    return;
  }
}

class PixelStreamArrayOfObject {
  private readonly arr;
  private readonly size;

  constructor(size: number) {
    this.size = size;
    this.arr = new Array(size * size).fill(pixelObj);
  }

  getPixel(x: number, y: number): RGBA {
    const index = y * this.size + x;
    const p = this.arr[index];
    return [p.r, p.g, p.b, p.a];
  }

  setPixel(x: number, y: number, rgba: RGBA): RGBA {
    const index = y * this.size + x;
    this.arr[index] = { r: rgba[0], g: rgba[1], b: rgba[2], a: rgba[3] };
    const p = this.arr[index];
    return [p.r, p.g, p.b, p.a];
  }

  forEach(
    mode: TraverseMode,
    callback: (rgba: RGBA, x: number, y: number) => void,
  ): void {
    if (mode === TraverseMode.RowMajor) {
      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          const curPixel = this.getPixel(x, y);
          callback(curPixel, x, y);
          this.setPixel(x, y, pixel);
        }
      }
    }
    if (mode === TraverseMode.ColMajor) {
      for (let x = 0; x < this.size; x++) {
        for (let y = 0; y < this.size; y++) {
          const curPixel = this.getPixel(x, y);
          callback(curPixel, x, y);
          this.setPixel(x, y, pixel);
        }
      }
    }

    return;
  }
}

const implementations = [
  { type: "flat-array", create: (s: number) => new PixelStreamFlatArray(s) },
  {
    type: "array-of-arrays",
    create: (s: number) => new PixelStreamArrayOfArrays(s),
  },
  {
    type: "array-of-objects",
    create: (s: number) => new PixelStreamArrayOfObject(s),
  },
  { type: "typed-array", create: (s: number) => new PixelStreamTypedArray(s) },
];

const noop = () => {};

function measure(stream: PixelStream) {
  const startRow = performance.now();
  stream.forEach(TraverseMode.RowMajor, noop);
  const row = performance.now() - startRow;

  const startCol = performance.now();
  stream.forEach(TraverseMode.ColMajor, noop);
  const col = performance.now() - startCol;

  return {
    RowMajor: row.toFixed(3) + "ms",
    ColMajor: col.toFixed(3) + "ms",
  };
}

for (const size of sizes) {
  const results: any[] = [];

  for (const impl of implementations) {
    const stream = impl.create(size);
    const res = measure(stream);

    results.push({
      type: impl.type,
      size,
      ...res,
    });
  }

  console.table(results);
}

// ┌─────────┬────────────────────┬──────┬───────────┬───────────┐
// │ (index) │ type               │ size │ RowMajor  │ ColMajor  │
// ├─────────┼────────────────────┼──────┼───────────┼───────────┤
// │ 0       │ 'flat-array'       │ 10   │ '0.200ms' │ '0.047ms' │
// │ 1       │ 'array-of-arrays'  │ 10   │ '0.106ms' │ '0.016ms' │
// │ 2       │ 'array-of-objects' │ 10   │ '0.125ms' │ '0.051ms' │
// │ 3       │ 'typed-array'      │ 10   │ '0.142ms' │ '0.039ms' │
// └─────────┴────────────────────┴──────┴───────────┴───────────┘
// ┌─────────┬────────────────────┬──────┬───────────┬───────────┐
// │ (index) │ type               │ size │ RowMajor  │ ColMajor  │
// ├─────────┼────────────────────┼──────┼───────────┼───────────┤
// │ 0       │ 'flat-array'       │ 128  │ '4.679ms' │ '0.886ms' │
// │ 1       │ 'array-of-arrays'  │ 128  │ '0.928ms' │ '0.493ms' │
// │ 2       │ 'array-of-objects' │ 128  │ '5.445ms' │ '4.690ms' │
// │ 3       │ 'typed-array'      │ 128  │ '3.141ms' │ '1.298ms' │
// └─────────┴────────────────────┴──────┴───────────┴───────────┘
// ┌─────────┬────────────────────┬──────┬─────────────┬────────────┐
// │ (index) │ type               │ size │ RowMajor    │ ColMajor   │
// ├─────────┼────────────────────┼──────┼─────────────┼────────────┤
// │ 0       │ 'flat-array'       │ 720  │ '1.613ms'   │ '4.406ms'  │
// │ 1       │ 'array-of-arrays'  │ 720  │ '0.663ms'   │ '0.936ms'  │
// │ 2       │ 'array-of-objects' │ 720  │ '102.454ms' │ '88.606ms' │
// │ 3       │ 'typed-array'      │ 720  │ '1.367ms'   │ '1.255ms'  │
// └─────────┴────────────────────┴──────┴─────────────┴────────────┘
// ┌─────────┬────────────────────┬──────┬─────────────┬─────────────┐
// │ (index) │ type               │ size │ RowMajor    │ ColMajor    │
// ├─────────┼────────────────────┼──────┼─────────────┼─────────────┤
// │ 0       │ 'flat-array'       │ 1080 │ '4.988ms'   │ '6.381ms'   │
// │ 1       │ 'array-of-arrays'  │ 1080 │ '1.343ms'   │ '1.933ms'   │
// │ 2       │ 'array-of-objects' │ 1080 │ '185.051ms' │ '225.438ms' │
// │ 3       │ 'typed-array'      │ 1080 │ '3.104ms'   │ '3.470ms'   │
// └─────────┴────────────────────┴──────┴─────────────┴─────────────┘
// ┌─────────┬────────────────────┬──────┬──────────────┬──────────────┐
// │ (index) │ type               │ size │ RowMajor     │ ColMajor     │
// ├─────────┼────────────────────┼──────┼──────────────┼──────────────┤
// │ 0       │ 'flat-array'       │ 3840 │ '233.784ms'  │ '441.753ms'  │
// │ 1       │ 'array-of-arrays'  │ 3840 │ '30.197ms'   │ '77.673ms'   │
// │ 2       │ 'array-of-objects' │ 3840 │ '2393.438ms' │ '4060.683ms' │
// │ 3       │ 'typed-array'      │ 3840 │ '38.522ms'   │ '139.640ms'  │
// └─────────┴────────────────────┴──────┴──────────────┴──────────────┘
