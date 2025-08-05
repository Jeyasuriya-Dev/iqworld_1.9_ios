"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.PdfService = void 0;
var core_1 = require("@angular/core");
// import * as pdfMake from 'pdfmake/build/pdfmake';
// import  pdfMake from 'pdfmake/build/pdfmake';
var pdfMake = require("pdfmake/build/pdfmake");
var pdfFonts = require("pdfmake/build/vfs_fonts");
var docDefinition;
var PdfService = /** @class */ (function () {
    function PdfService() {
        this.url = "../assets/images/iq-world.png";
        this.widthsAuto = [];
        this.pdfData = [];
        window.pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }
    PdfService.prototype.generatePDFSP = function (action, history, reportname, columns, columnsdataFields, column_width, fdate, tdate) {
        return __awaiter(this, void 0, void 0, function () {
            var widths, bodyColumns, bodydata, reportTime, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        widths = this.pdfColumnWithsByNumber(column_width);
                        bodyColumns = this.pdfBodyColumns(columns);
                        bodydata = this.pdfBodyHistory(history, columnsdataFields);
                        reportTime = this.getReportPrintTime();
                        _a = {
                            pageSize: 'A4',
                            // pageOrientation: 'portrait',
                            pageOrientation: 'landscape',
                            // pageMargins: [120, 50, 120, 50],
                            // pageMargins: [25, 60, 40, 60],
                            pageMargins: [40, 60, 40, 60]
                        };
                        _b = {};
                        _c = {};
                        return [4 /*yield*/, this.getBase64ImageFromURL(this.url)];
                    case 1:
                        // console.log(reportTime);
                        docDefinition = (_a.content = [
                            (_b.columns = [
                                (_c.image = _d.sent(),
                                    _c.width = 80,
                                    _c.alignment = 'left',
                                    _c),
                                {
                                    text: reportname,
                                    alignment: 'right',
                                    fontSize: 12
                                },
                                {
                                    text: 'IQ-WORLD',
                                    alignment: 'center',
                                    fontSize: 10,
                                    margin: [250, 0, 0, 0]
                                }
                            ],
                                _b),
                            {
                                text: ' ',
                                margin: [0, 0, 0, 3]
                            },
                            {
                                text: " ADDRESS",
                                style: 'texInvoice'
                            },
                            {
                                columns: [
                                    {
                                        alignment: 'left',
                                        width: 350,
                                        table: {
                                            headerRows: 1,
                                            alignment: 'center',
                                            body: [
                                                [
                                                    { text: "From Date", style: 'dateHeader' },
                                                    { text: "To Date", style: 'dateHeader' }
                                                ],
                                                [
                                                    { text: fdate, style: 'dateValue' },
                                                    { text: tdate, style: 'dateValue' }
                                                ],
                                            ]
                                        }
                                    },
                                ]
                            },
                            {
                                text: ' ',
                                margin: [0, 0, 0, 5]
                            },
                            {
                                canvas: // Free Line
                                [
                                    { type: 'line', x1: 0, y1: 10, x2: 770 - 10, y2: 10, lineWidth: 0.5, color: '#145369', bold: true }
                                ]
                            },
                            {
                                text: ' ',
                                margin: [0, 0, 0, 5]
                            },
                            {
                                text: reportname,
                                style: 'SubTitleHeader'
                            },
                            {
                                text: ' ',
                                margin: [0, 0, 0, 5]
                            },
                            {
                                table: {
                                    headerRows: 1,
                                    widths: widths,
                                    body: __spreadArrays([
                                        bodyColumns
                                    ], bodydata)
                                }
                            }
                        ],
                            // FOOTER
                            _a.footer = function (currentPage, pageCount) {
                                return {
                                    columns: [
                                        'Generated on : ' + reportTime,
                                        {
                                            alignment: 'center',
                                            text: currentPage.toString() + ' of ' + pageCount
                                        },
                                        {
                                            alignment: 'right',
                                            text: '©Powered by : Yash Electronics Pvt Ltd.'
                                        }
                                    ],
                                    fontSize: 8,
                                    margin: [60, 10, 60, 10]
                                };
                            },
                            // DOWLOAD FILE TITLE
                            _a.info = {
                                title: reportname,
                                author: 'Yash Electronics Pvt Ltd.',
                                subject: reportname,
                                keywords: reportname
                            },
                            // CSS
                            _a.styles = {
                                texInvoice: {
                                    fontSize: 12,
                                    bold: true,
                                    // alignment: 'right',
                                    color: '#ff0066',
                                    margin: [490, 0, 0, 0],
                                    alignment: 'center'
                                },
                                originalRecipt: {
                                    fontSize: 10,
                                    margin: [220, 0, 0, 0],
                                    alignment: 'left'
                                },
                                headerRNet: {
                                    fontSize: 25,
                                    color: '#ff0000',
                                    bold: true,
                                    decoration: 'underline',
                                    margin: [0, 5, 0, 5]
                                },
                                dateHeader: {
                                    fontSize: 9,
                                    fillColor: '#1c5f8d',
                                    color: '#f0f0f0',
                                    alignment: 'center'
                                },
                                dateValue: {
                                    fontSize: 9,
                                    alignment: 'center'
                                },
                                SubTitleHeader: {
                                    color: '#1c5f8d',
                                    fontSize: 15,
                                    alignment: 'center',
                                    bold: true
                                },
                                rowThree: {
                                    fontSize: 9,
                                    fillColor: '#f0f0f0',
                                    alignment: 'center'
                                },
                                rowThreeHeader: {
                                    color: '#fefefe',
                                    fillColor: '#1c5f8d',
                                    fontSize: 10,
                                    alignment: 'center',
                                    bold: true
                                }
                            },
                            _a);
                        if (action === 'download') {
                            pdfMake.createPdf(docDefinition).download(reportname);
                        }
                        else if (action === 'print') {
                            pdfMake.createPdf(docDefinition).print();
                        }
                        else {
                            pdfMake.createPdf(docDefinition).open();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PdfService.prototype.getBase64ImageFromURL = function (url) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.setAttribute("crossOrigin", "anonymous");
            img.onload = function () {
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                _this.ctx = canvas.getContext("2d");
                _this.ctx.drawImage(img, 0, 0);
                var dataURL = canvas.toDataURL("image/png");
                resolve(dataURL);
            };
            img.onerror = function (error) {
                reject(error);
            };
            img.src = url;
        });
    };
    PdfService.prototype.pdfColumnWiths = function (data) {
        this.widthsAuto.length = 0;
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var i = data_1[_i];
            // widths.push('6.55%')
            this.widthsAuto.push('auto');
            // widths.push('100vw');
        }
        // console.log(this.widthsAuto);
        return this.widthsAuto;
    };
    PdfService.prototype.pdfColumnWithsByNumber = function (data) {
        // console.log(data);
        this.widthsAuto.length = 0;
        for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
            var i = data_2[_i];
            // widths.push('6.55%')
            this.widthsAuto.push(i);
            // widths.push('100vw');
        }
        return this.widthsAuto;
    };
    PdfService.prototype.pdfBodyColumns = function (data) {
        // console.log(data);
        var pdfBodyColumns = [];
        for (var _i = 0, data_3 = data; _i < data_3.length; _i++) {
            var i = data_3[_i];
            var obj = { text: i, style: 'rowThreeHeader' };
            pdfBodyColumns.push(obj);
        }
        return pdfBodyColumns;
    };
    PdfService.prototype.pdfBodyHistory = function (data, type) {
        var _this = this;
        this.pdfData.length = 0;
        var pdf = data.map(function (user) {
            var arr = [];
            for (var _i = 0, type_1 = type; _i < type_1.length; _i++) {
                var t = type_1[_i];
                var v = { text: user[t], style: 'rowThree' };
                arr.push(v);
            }
            _this.pdfData.push(arr);
        });
        return this.pdfData;
    };
    PdfService.prototype.getReportPrintTime = function () {
        var today = new Date();
        var month = today.getMonth() + 1;
        var day = today.getDate();
        var hours = today.getHours() > 12 ? today.getHours() - 12 : today.getHours();
        var am_pm = today.getHours() >= 12 ? "PM" : "AM";
        hours = hours < 10 ? "0" + hours : hours;
        var minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
        var seconds = today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();
        if (month < 10 && day < 10) {
            var date = today.getFullYear() + '/' + "0" + month + '/' + "0" + today.getDate();
        }
        else if (month < 10 && day > 10) {
            var date = today.getFullYear() + '/' + "0" + month + '/' + today.getDate();
        }
        else if (month > 10 && day < 10) {
            var date = today.getFullYear() + '/' + month + '/' + "0" + today.getDate();
        }
        else {
            var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
        }
        var time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
        return date + ' ' + time;
    };
    PdfService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], PdfService);
    return PdfService;
}());
exports.PdfService = PdfService;
