var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var TraverseMode;
(function (TraverseMode) {
    TraverseMode[TraverseMode["RowMajor"] = 0] = "RowMajor";
    TraverseMode[TraverseMode["ColMajor"] = 1] = "ColMajor";
})(TraverseMode || (TraverseMode = {}));
// Варианты представления данных
// Тип	            Описание
// flat-array	      Один Array чисел длины width*height*4
// array-of-arrays	Массив массивов: [[r,g,b,a], ...]
// array-of-objects	Массив объектов: [{r,g,b,a}, ...]
// typed-array	    Один Uint8Array длины width*height*4
var sizes = [10, 128, 720, 1080, 3840];
var pixel = [255, 255, 255, 0];
var pixelObj = { r: 255, g: 255, b: 255, a: 0 };
var PixelStreamFlatArray = /** @class */ (function () {
    function PixelStreamFlatArray(size) {
        this.size = size;
        this.arr = new Array(size * size * 4).fill(0);
    }
    PixelStreamFlatArray.prototype.getPixel = function (x, y) {
        var startIndex = (y * this.size + x) * 4;
        return [
            this.arr[startIndex],
            this.arr[startIndex + 1],
            this.arr[startIndex + 2],
            this.arr[startIndex + 3],
        ];
    };
    PixelStreamFlatArray.prototype.setPixel = function (x, y, rgba) {
        var startIndex = (y * this.size + x) * 4;
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
    };
    PixelStreamFlatArray.prototype.forEach = function (mode, callback) {
        if (mode === TraverseMode.RowMajor) {
            for (var y = 0; y < this.size; y++) {
                for (var x = 0; x < this.size; x++) {
                    var curPixel = this.getPixel(x, y);
                    callback(curPixel, x, y);
                    this.setPixel(x, y, pixel);
                }
            }
        }
        if (mode === TraverseMode.ColMajor) {
            for (var x = 0; x < this.size; x++) {
                for (var y = 0; y < this.size; y++) {
                    var curPixel = this.getPixel(x, y);
                    callback(curPixel, x, y);
                    this.setPixel(x, y, pixel);
                }
            }
        }
        return;
    };
    return PixelStreamFlatArray;
}());
var PixelStreamArrayOfArrays = /** @class */ (function () {
    function PixelStreamArrayOfArrays(size) {
        this.size = size;
        this.arr = new Array(size * size).fill(pixel);
    }
    PixelStreamArrayOfArrays.prototype.getPixel = function (x, y) {
        var index = y * this.size + x;
        return this.arr[index];
    };
    PixelStreamArrayOfArrays.prototype.setPixel = function (x, y, rgba) {
        var index = y * this.size + x;
        this.arr[index] = rgba;
        return this.arr[index];
    };
    PixelStreamArrayOfArrays.prototype.forEach = function (mode, callback) {
        if (mode === TraverseMode.RowMajor) {
            for (var y = 0; y < this.size; y++) {
                for (var x = 0; x < this.size; x++) {
                    var curPixel = this.getPixel(x, y);
                    callback(curPixel, x, y);
                    this.setPixel(x, y, pixel);
                }
            }
        }
        if (mode === TraverseMode.ColMajor) {
            for (var x = 0; x < this.size; x++) {
                for (var y = 0; y < this.size; y++) {
                    var curPixel = this.getPixel(x, y);
                    callback(curPixel, x, y);
                    this.setPixel(x, y, pixel);
                }
            }
        }
        return;
    };
    return PixelStreamArrayOfArrays;
}());
var PixelStreamTypedArray = /** @class */ (function () {
    function PixelStreamTypedArray(size) {
        this.size = size;
        this.arr = new Uint8Array(size * size * 4);
    }
    PixelStreamTypedArray.prototype.getPixel = function (x, y) {
        var startIndex = (y * this.size + x) * 4;
        return [
            this.arr[startIndex],
            this.arr[startIndex + 1],
            this.arr[startIndex + 2],
            this.arr[startIndex + 3],
        ];
    };
    PixelStreamTypedArray.prototype.setPixel = function (x, y, rgba) {
        var startIndex = (y * this.size + x) * 4;
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
    };
    PixelStreamTypedArray.prototype.forEach = function (mode, callback) {
        if (mode === TraverseMode.RowMajor) {
            for (var y = 0; y < this.size; y++) {
                for (var x = 0; x < this.size; x++) {
                    var curPixel = this.getPixel(x, y);
                    callback(curPixel, x, y);
                    this.setPixel(x, y, pixel);
                }
            }
        }
        if (mode === TraverseMode.ColMajor) {
            for (var x = 0; x < this.size; x++) {
                for (var y = 0; y < this.size; y++) {
                    var curPixel = this.getPixel(x, y);
                    callback(curPixel, x, y);
                    this.setPixel(x, y, pixel);
                }
            }
        }
        return;
    };
    return PixelStreamTypedArray;
}());
var PixelStreamArrayOfObject = /** @class */ (function () {
    function PixelStreamArrayOfObject(size) {
        this.size = size;
        this.arr = new Array(size * size).fill(pixelObj);
    }
    PixelStreamArrayOfObject.prototype.getPixel = function (x, y) {
        var index = y * this.size + x;
        var p = this.arr[index];
        return [p.r, p.g, p.b, p.a];
    };
    PixelStreamArrayOfObject.prototype.setPixel = function (x, y, rgba) {
        var index = y * this.size + x;
        this.arr[index] = { r: rgba[0], g: rgba[1], b: rgba[2], a: rgba[3] };
        var p = this.arr[index];
        return [p.r, p.g, p.b, p.a];
    };
    PixelStreamArrayOfObject.prototype.forEach = function (mode, callback) {
        if (mode === TraverseMode.RowMajor) {
            for (var y = 0; y < this.size; y++) {
                for (var x = 0; x < this.size; x++) {
                    var curPixel = this.getPixel(x, y);
                    callback(curPixel, x, y);
                    this.setPixel(x, y, pixel);
                }
            }
        }
        if (mode === TraverseMode.ColMajor) {
            for (var x = 0; x < this.size; x++) {
                for (var y = 0; y < this.size; y++) {
                    var curPixel = this.getPixel(x, y);
                    callback(curPixel, x, y);
                    this.setPixel(x, y, pixel);
                }
            }
        }
        return;
    };
    return PixelStreamArrayOfObject;
}());
var implementations = [
    { type: "flat-array", create: function (s) { return new PixelStreamFlatArray(s); } },
    {
        type: "array-of-arrays",
        create: function (s) { return new PixelStreamArrayOfArrays(s); }
    },
    {
        type: "array-of-objects",
        create: function (s) { return new PixelStreamArrayOfObject(s); }
    },
    { type: "typed-array", create: function (s) { return new PixelStreamTypedArray(s); } },
];
var noop = function () { };
function measure(stream) {
    var startRow = performance.now();
    stream.forEach(TraverseMode.RowMajor, noop);
    var row = performance.now() - startRow;
    var startCol = performance.now();
    stream.forEach(TraverseMode.ColMajor, noop);
    var col = performance.now() - startCol;
    return {
        RowMajor: row.toFixed(3) + "ms",
        ColMajor: col.toFixed(3) + "ms"
    };
}
for (var _i = 0, sizes_1 = sizes; _i < sizes_1.length; _i++) {
    var size = sizes_1[_i];
    var results = [];
    for (var _a = 0, implementations_1 = implementations; _a < implementations_1.length; _a++) {
        var impl = implementations_1[_a];
        var stream = impl.create(size);
        var res = measure(stream);
        results.push(__assign({ type: impl.type, size: size }, res));
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
