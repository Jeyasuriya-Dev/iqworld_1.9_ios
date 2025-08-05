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
exports.ExportService = void 0;
var core_1 = require("@angular/core");
var pdfMake = require("pdfmake/build/pdfmake");
var pdfFonts = require("pdfmake/build/vfs_fonts");
var docDefinition;
var ExportService = /** @class */ (function () {
    function ExportService() {
        this.url = "../assets/images/iq-world.png";
        this.widthsAuto = [];
        this.pdfData = [];
        window.pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }
    ExportService.prototype.generateCustomerPDF = function (data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function () {
            var widths, bodyColumns, bodydata, reportTime, _k, _l, _m;
            return __generator(this, function (_o) {
                switch (_o.label) {
                    case 0:
                        // console.log("history");
                        console.log(data);
                        widths = this.pdfColumnWiths(data.columns);
                        console.log(widths);
                        bodyColumns = this.pdfBodyColumns(data.columns);
                        console.log(bodyColumns);
                        bodydata = this.pdfBodyHistory(data === null || data === void 0 ? void 0 : data.history, data === null || data === void 0 ? void 0 : data.columnsdataFields);
                        console.log(bodydata);
                        reportTime = this.getReportPrintTime();
                        _k = {
                            pageSize: 'A4',
                            pageOrientation: 'landscape',
                            pageMargins: [40, 60, 40, 60]
                        };
                        _l = {};
                        _m = {};
                        return [4 /*yield*/, this.getBase64ImageFromURL(this.url)];
                    case 1:
                        // console.log(reportTime);
                        docDefinition = (_k.content = [
                            (_l.columns = [
                                (_m.image = _o.sent(),
                                    _m.width = 80,
                                    _m.alignment = 'left',
                                    _m),
                                {
                                    text: data.reportname,
                                    alignment: 'right',
                                    fontSize: 18,
                                    bold: true
                                },
                                {
                                    text: 'IQ-WORLD',
                                    alignment: 'center',
                                    fontSize: 10,
                                    margin: [250, 0, 0, 0]
                                }
                            ],
                                _l),
                            {
                                canvas: // Free Line
                                [
                                    { type: 'line', x1: 0, y1: 2, x2: 770 - 10, y2: 2, lineWidth: 0.1, color: '#145369', bold: false }
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 10, 50, 0],
                                        stack: [
                                            {
                                                margin: [0, 0, 0, 10],
                                                columns: [
                                                    {
                                                        width: 50,
                                                        style: "strong",
                                                        text: "Distributor"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_a = data === null || data === void 0 ? void 0 : data.filterList) === null || _a === void 0 ? void 0 : _a.distributor
                                                    }
                                                ]
                                            },
                                            {
                                                margin: [0, 0, 0, 10],
                                                columns: [
                                                    {
                                                        width: 50,
                                                        style: "strong",
                                                        text: "State"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_b = data === null || data === void 0 ? void 0 : data.filterList) === null || _b === void 0 ? void 0 : _b.state
                                                    }
                                                ]
                                            },
                                            {
                                                margin: [0, 0, 0, 10],
                                                columns: [
                                                    {
                                                        width: 50,
                                                        style: "strong",
                                                        text: "District"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_c = data === null || data === void 0 ? void 0 : data.filterList) === null || _c === void 0 ? void 0 : _c.district
                                                    }
                                                ]
                                            },
                                            {
                                                margin: [0, 0, 0, 10],
                                                columns: [
                                                    {
                                                        width: 50,
                                                        style: "strong",
                                                        text: "City"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_d = data === null || data === void 0 ? void 0 : data.filterList) === null || _d === void 0 ? void 0 : _d.city
                                                    }
                                                ]
                                            },
                                            {
                                                columns: [
                                                    {
                                                        width: 50,
                                                        style: "strong",
                                                        text: "Location"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_e = data === null || data === void 0 ? void 0 : data.filterList) === null || _e === void 0 ? void 0 : _e.location
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                style: "filter"
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, -100, 50, 0],
                                        stack: [
                                            {
                                                margin: [0, 0, 0, 10],
                                                columns: [
                                                    {
                                                        width: 45,
                                                        style: "strong",
                                                        text: "Status"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_f = data === null || data === void 0 ? void 0 : data.filterList) === null || _f === void 0 ? void 0 : _f.isactive
                                                    }
                                                ]
                                            },
                                            {
                                                margin: [0, 0, 0, 10],
                                                columns: [
                                                    {
                                                        width: 45,
                                                        style: "strong",
                                                        text: "Plan Type"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_g = data === null || data === void 0 ? void 0 : data.filterList) === null || _g === void 0 ? void 0 : _g.plan
                                                    }
                                                ]
                                            },
                                            {
                                                margin: [0, 0, 0, 10],
                                                columns: [
                                                    {
                                                        width: 45,
                                                        style: "strong",
                                                        text: "Fromdate"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_h = data === null || data === void 0 ? void 0 : data.filterList) === null || _h === void 0 ? void 0 : _h.fromdate
                                                    }
                                                ]
                                            },
                                            {
                                                margin: [0, 0, 0, 10],
                                                columns: [
                                                    {
                                                        width: 45,
                                                        style: "strong",
                                                        text: "Todate"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_j = data === null || data === void 0 ? void 0 : data.filterList) === null || _j === void 0 ? void 0 : _j.todate
                                                    }
                                                ]
                                            },
                                            {
                                                columns: [
                                                    {
                                                        width: 45,
                                                        style: "strong",
                                                        text: " "
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: " "
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                style: "filter1"
                            },
                            // {
                            //   columns: [
                            //     {
                            //       margin: [0, 10, 50, 0],
                            //       stack: [
                            //         {
                            //           margin: [0, 0, 0, 10],
                            //           columns: [
                            //             {
                            //               width: 45,
                            //               style: "strong",
                            //               text: "Bill to"
                            //             },
                            //             {
                            //               width: "auto",
                            //               margin: [0, 0, 5, 0],
                            //               text: ":"
                            //             },
                            //             {
                            //               width: "*",
                            //               text: 'this.cap(this.trimmer(this.api.billToAddress))'
                            //             }
                            //           ]
                            //         },
                            //         {
                            //           margin: [0, 0, 0, 10],
                            //           columns: [
                            //             {
                            //               width: 45,
                            //               style: "strong",
                            //               text: "Ship to"
                            //             },
                            //             {
                            //               width: "auto",
                            //               margin: [0, 0, 5, 0],
                            //               text: ":"
                            //             },
                            //             {
                            //               width: "*",
                            //               text: 'this.cap(this.trimmer(this.api.shippingAddress))'
                            //             }
                            //           ]
                            //         },
                            //         {
                            //           margin: [0, 0, 0, 10],
                            //           columns: [
                            //             {
                            //               width: 45,
                            //               style: "strong",
                            //               text: "Email"
                            //             },
                            //             {
                            //               width: "auto",
                            //               margin: [0, 0, 5, 0],
                            //               text: ":"
                            //             },
                            //             {
                            //               width: "*",
                            //               text: 'this.api.orderEmail'
                            //             }
                            //           ]
                            //         },
                            //         {
                            //           columns: [
                            //             {
                            //               width: 45,
                            //               style: "strong",
                            //               text: "Phone"
                            //             },
                            //             {
                            //               width: "auto",
                            //               margin: [0, 0, 5, 0],
                            //               text: ":"
                            //             },
                            //             {
                            //               width: "*",
                            //               text: 'this.api.phoneNumber'
                            //             }
                            //           ]
                            //         }
                            //       ]
                            //     }
                            //   ],
                            //   style: "filter"
                            // },
                            // {
                            //   text: '',
                            //   margin: [0, 0, 0, 3],
                            // },
                            // {
                            //   text: ` ADDRESS`,
                            //   style: 'texInvoice',
                            // },
                            // {
                            //   columns: [
                            //     {
                            //       alignment: 'left',
                            //       width: 350,
                            //       table: {
                            //         headerRows: 1,
                            //         alignment: 'center',
                            //         body: [
                            //           [
                            //             { text: `From Date`, style: 'dateHeader' },
                            //             { text: `To Date`, style: 'dateHeader' }
                            //           ],
                            //           [
                            //             { text: data.fdate, style: 'dateValue' },
                            //             { text: data.tdate, style: 'dateValue' }
                            //           ],
                            //         ],
                            //       },
                            //     },
                            //     {
                            //       text: `
                            //       Yash Electronics,
                            //       Babosa Industrial Park, BLDG.NO-A4,
                            //       1 st Floor Unit No-100-108 Saravali village,
                            //       Near Vatika Hotel, Nashik Highway(NH-3),
                            //       Bhiwandi – 4121302.`,
                            //       style: 'originalRecipt',
                            //     },
                            //   ]
                            // },
                            {
                                text: ' ',
                                margin: [0, 0, 0, 5]
                            },
                            {
                                canvas: // Free Line
                                [
                                    // { type: 'line', x1: 0, y1: 10, x2: 770 - 10, y2: 10, lineWidth: 0.5, color: '#145369', bold: false }
                                    { type: 'line', x1: 0, y1: 2, x2: 770 - 10, y2: 2, lineWidth: 0.1, color: '#145369', bold: false }
                                ]
                            },
                            {
                                text: ' ',
                                margin: [0, 0, 0, 5]
                            },
                            {
                                text: data.reportname,
                                style: 'SubTitleHeader'
                            },
                            {
                                text: ' ',
                                margin: [0, 0, 0, 5]
                            },
                            {
                                table: {
                                    textTransform: 'capitalize',
                                    headerRows: 1,
                                    widths: widths,
                                    body: __spreadArrays([
                                        bodyColumns
                                    ], bodydata)
                                }
                            }
                        ],
                            // FOOTER
                            _k.footer = function (currentPage, pageCount) {
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
                            _k.info = {
                                title: data.reportname,
                                author: 'Yash Electronics Pvt Ltd.',
                                subject: data.reportname,
                                keywords: data.reportname
                            },
                            // CSS
                            _k.styles = {
                                filter1: {
                                    fontSize: 10,
                                    bold: false,
                                    alignment: 'left',
                                    // color: '#ff0066',
                                    margin: [490, 0, 0, 0]
                                },
                                filter2: {
                                    fontSize: 10,
                                    bold: false,
                                    alignment: 'left',
                                    // color: '#ff0066',
                                    margin: [200, 0, 0, 0]
                                },
                                strong: {
                                    bold: true,
                                    color: "#145369"
                                },
                                filter: {
                                    fontSize: 10
                                },
                                texInvoice: {
                                    fontSize: 12,
                                    bold: true,
                                    // alignment: 'right',
                                    color: '#ff0066',
                                    margin: [490, 0, 0, 0],
                                    alignment: 'center'
                                },
                                tableF: {
                                    borderWidth: '0px',
                                    margin: [0, 5, 0, 15]
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
                            _k);
                        if (data.action === 'download') {
                            pdfMake.createPdf(docDefinition).download(data.reportname);
                        }
                        else if (data.action === 'print') {
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
    ExportService.prototype.generateDevicePDF = function (data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __awaiter(this, void 0, void 0, function () {
            var widths, bodyColumns, bodydata, reportTime, _m, _o, _p;
            return __generator(this, function (_q) {
                switch (_q.label) {
                    case 0:
                        // console.log("history");
                        console.log(data);
                        widths = this.pdfColumnWiths(data.columns);
                        console.log(widths);
                        bodyColumns = this.pdfBodyColumns(data.columns);
                        console.log(bodyColumns);
                        bodydata = this.pdfBodyHistory(data === null || data === void 0 ? void 0 : data.history, data === null || data === void 0 ? void 0 : data.columnsdataFields);
                        console.log(bodydata);
                        reportTime = this.getReportPrintTime();
                        _m = {
                            pageSize: 'A4',
                            pageOrientation: 'landscape',
                            pageMargins: [40, 60, 40, 60]
                        };
                        _o = {};
                        _p = {};
                        return [4 /*yield*/, this.getBase64ImageFromURL(this.url)];
                    case 1:
                        // console.log(reportTime);
                        docDefinition = (_m.content = [
                            (_o.columns = [
                                (_p.image = _q.sent(),
                                    _p.width = 80,
                                    _p.alignment = 'left',
                                    _p),
                                {
                                    text: data.reportname,
                                    alignment: 'right',
                                    fontSize: 18,
                                    bold: true
                                },
                                {
                                    text: 'IQ-WORLD',
                                    alignment: 'center',
                                    fontSize: 10,
                                    margin: [250, 0, 0, 0]
                                }
                            ],
                                _o),
                            {
                                canvas: // Free Line
                                [
                                    { type: 'line', x1: 0, y1: 2, x2: 770 - 10, y2: 2, lineWidth: 0.1, color: '#145369', bold: false }
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 10, 50, 0],
                                        stack: [
                                            {
                                                margin: [0, 0, 0, 10],
                                                columns: [
                                                    {
                                                        width: 50,
                                                        style: "strong",
                                                        text: "Distributor"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_a = data === null || data === void 0 ? void 0 : data.filterList) === null || _a === void 0 ? void 0 : _a.distributor
                                                    }
                                                ]
                                            },
                                            {
                                                margin: [0, 0, 0, 10],
                                                columns: [
                                                    {
                                                        width: 50,
                                                        style: "strong",
                                                        text: "State"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_b = data === null || data === void 0 ? void 0 : data.filterList) === null || _b === void 0 ? void 0 : _b.state
                                                    }
                                                ]
                                            },
                                            {
                                                margin: [0, 0, 0, 10],
                                                columns: [
                                                    {
                                                        width: 50,
                                                        style: "strong",
                                                        text: "District"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_c = data === null || data === void 0 ? void 0 : data.filterList) === null || _c === void 0 ? void 0 : _c.district
                                                    }
                                                ]
                                            },
                                            {
                                                margin: [0, 0, 0, 10],
                                                columns: [
                                                    {
                                                        width: 50,
                                                        style: "strong",
                                                        text: "City"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_d = data === null || data === void 0 ? void 0 : data.filterList) === null || _d === void 0 ? void 0 : _d.city
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                style: "filter"
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, -100, 50, 0],
                                        stack: [
                                            {
                                                margin: [0, 10, 0, 0],
                                                columns: [
                                                    {
                                                        width: 45,
                                                        style: "strong",
                                                        text: "Plan Type"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_e = data === null || data === void 0 ? void 0 : data.filterList) === null || _e === void 0 ? void 0 : _e.plan
                                                    }
                                                ]
                                            },
                                            {
                                                margin: [0, 10, 0, 10],
                                                columns: [
                                                    {
                                                        width: 45,
                                                        style: "strong",
                                                        text: "Fromdate"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_f = data === null || data === void 0 ? void 0 : data.filterList) === null || _f === void 0 ? void 0 : _f.fromdate
                                                    }
                                                ]
                                            },
                                            {
                                                margin: [0, 0, 0, 10],
                                                columns: [
                                                    {
                                                        width: 45,
                                                        style: "strong",
                                                        text: "Todate"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_g = data === null || data === void 0 ? void 0 : data.filterList) === null || _g === void 0 ? void 0 : _g.todate
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                style: "filter1"
                            },
                            {
                                columns: [
                                    {
                                        margin: [300, -100, 50, 0],
                                        stack: [
                                            {
                                                margin: [0, 10, 0, 10],
                                                columns: [
                                                    {
                                                        width: 50,
                                                        style: "strong",
                                                        text: "Location"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_h = data === null || data === void 0 ? void 0 : data.filterList) === null || _h === void 0 ? void 0 : _h.location
                                                    }
                                                ]
                                            },
                                            {
                                                margin: [0, 0, 0, 10],
                                                columns: [
                                                    {
                                                        width: 50,
                                                        style: "strong",
                                                        text: "Status"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_j = data === null || data === void 0 ? void 0 : data.filterList) === null || _j === void 0 ? void 0 : _j.isonline
                                                    }
                                                ]
                                            },
                                            {
                                                margin: [0, 0, 0, 10],
                                                columns: [
                                                    {
                                                        width: 50,
                                                        style: "strong",
                                                        text: "Activity"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_k = data === null || data === void 0 ? void 0 : data.filterList) === null || _k === void 0 ? void 0 : _k.isactive
                                                    }
                                                ]
                                            },
                                            {
                                                margin: [0, 0, 0, 10],
                                                columns: [
                                                    {
                                                        width: 50,
                                                        style: "strong",
                                                        text: "orientation"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_l = data === null || data === void 0 ? void 0 : data.filterList) === null || _l === void 0 ? void 0 : _l.orientation
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                style: "filter2"
                            },
                            // {
                            //   columns: [
                            //     {
                            //       margin: [0, 10, 50, 0],
                            //       stack: [
                            //         {
                            //           margin: [0, 0, 0, 10],
                            //           columns: [
                            //             {
                            //               width: 45,
                            //               style: "strong",
                            //               text: "Bill to"
                            //             },
                            //             {
                            //               width: "auto",
                            //               margin: [0, 0, 5, 0],
                            //               text: ":"
                            //             },
                            //             {
                            //               width: "*",
                            //               text: 'this.cap(this.trimmer(this.api.billToAddress))'
                            //             }
                            //           ]
                            //         },
                            //         {
                            //           margin: [0, 0, 0, 10],
                            //           columns: [
                            //             {
                            //               width: 45,
                            //               style: "strong",
                            //               text: "Ship to"
                            //             },
                            //             {
                            //               width: "auto",
                            //               margin: [0, 0, 5, 0],
                            //               text: ":"
                            //             },
                            //             {
                            //               width: "*",
                            //               text: 'this.cap(this.trimmer(this.api.shippingAddress))'
                            //             }
                            //           ]
                            //         },
                            //         {
                            //           margin: [0, 0, 0, 10],
                            //           columns: [
                            //             {
                            //               width: 45,
                            //               style: "strong",
                            //               text: "Email"
                            //             },
                            //             {
                            //               width: "auto",
                            //               margin: [0, 0, 5, 0],
                            //               text: ":"
                            //             },
                            //             {
                            //               width: "*",
                            //               text: 'this.api.orderEmail'
                            //             }
                            //           ]
                            //         },
                            //         {
                            //           columns: [
                            //             {
                            //               width: 45,
                            //               style: "strong",
                            //               text: "Phone"
                            //             },
                            //             {
                            //               width: "auto",
                            //               margin: [0, 0, 5, 0],
                            //               text: ":"
                            //             },
                            //             {
                            //               width: "*",
                            //               text: 'this.api.phoneNumber'
                            //             }
                            //           ]
                            //         }
                            //       ]
                            //     }
                            //   ],
                            //   style: "filter"
                            // },
                            // {
                            //   text: '',
                            //   margin: [0, 0, 0, 3],
                            // },
                            // {
                            //   text: ` ADDRESS`,
                            //   style: 'texInvoice',
                            // },
                            // {
                            //   columns: [
                            //     {
                            //       alignment: 'left',
                            //       width: 350,
                            //       table: {
                            //         headerRows: 1,
                            //         alignment: 'center',
                            //         body: [
                            //           [
                            //             { text: `From Date`, style: 'dateHeader' },
                            //             { text: `To Date`, style: 'dateHeader' }
                            //           ],
                            //           [
                            //             { text: data.fdate, style: 'dateValue' },
                            //             { text: data.tdate, style: 'dateValue' }
                            //           ],
                            //         ],
                            //       },
                            //     },
                            //     {
                            //       text: `
                            //       Yash Electronics,
                            //       Babosa Industrial Park, BLDG.NO-A4,
                            //       1 st Floor Unit No-100-108 Saravali village,
                            //       Near Vatika Hotel, Nashik Highway(NH-3),
                            //       Bhiwandi – 4121302.`,
                            //       style: 'originalRecipt',
                            //     },
                            //   ]
                            // },
                            {
                                text: ' ',
                                margin: [0, 0, 0, 5]
                            },
                            {
                                canvas: // Free Line
                                [
                                    // { type: 'line', x1: 0, y1: 10, x2: 770 - 10, y2: 10, lineWidth: 0.5, color: '#145369', bold: false }
                                    { type: 'line', x1: 0, y1: 2, x2: 770 - 10, y2: 2, lineWidth: 0.1, color: '#145369', bold: false }
                                ]
                            },
                            {
                                text: ' ',
                                margin: [0, 0, 0, 5]
                            },
                            {
                                text: data.reportname,
                                style: 'SubTitleHeader'
                            },
                            {
                                text: ' ',
                                margin: [0, 0, 0, 5]
                            },
                            {
                                table: {
                                    textTransform: 'capitalize',
                                    headerRows: 1,
                                    widths: widths,
                                    body: __spreadArrays([
                                        bodyColumns
                                    ], bodydata)
                                }
                            }
                        ],
                            // FOOTER
                            _m.footer = function (currentPage, pageCount) {
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
                            _m.info = {
                                title: data.reportname,
                                author: 'Yash Electronics Pvt Ltd.',
                                subject: data.reportname,
                                keywords: data.reportname
                            },
                            // CSS
                            _m.styles = {
                                filter1: {
                                    fontSize: 10,
                                    bold: false,
                                    alignment: 'left',
                                    // color: '#ff0066',
                                    margin: [590, 0, 0, 0]
                                },
                                filter2: {
                                    fontSize: 10,
                                    bold: false,
                                    alignment: 'left',
                                    // color: '#ff0066',
                                    margin: [0, 0, 0, 0]
                                },
                                strong: {
                                    bold: true,
                                    color: "#145369"
                                },
                                filter: {
                                    fontSize: 10
                                },
                                texInvoice: {
                                    fontSize: 12,
                                    bold: true,
                                    // alignment: 'right',
                                    color: '#ff0066',
                                    margin: [490, 0, 0, 0],
                                    alignment: 'center'
                                },
                                tableF: {
                                    borderWidth: '0px',
                                    margin: [0, 5, 0, 15]
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
                            _m);
                        if (data.action === 'download') {
                            pdfMake.createPdf(docDefinition).download(data.reportname);
                        }
                        else if (data.action === 'print') {
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
    ExportService.prototype.generateDestributorPDF = function (data) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            var widths, bodyColumns, bodydata, reportTime, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        // console.log("history");
                        console.log(data);
                        widths = this.pdfColumnWiths(data.columns);
                        console.log(widths);
                        bodyColumns = this.pdfBodyColumns(data.columns);
                        console.log(bodyColumns);
                        bodydata = this.pdfBodyHistory(data === null || data === void 0 ? void 0 : data.history, data === null || data === void 0 ? void 0 : data.columnsdataFields);
                        console.log(bodydata);
                        reportTime = this.getReportPrintTime();
                        _g = {
                            pageSize: 'A4',
                            pageOrientation: 'landscape',
                            pageMargins: [40, 60, 40, 60]
                        };
                        _h = {};
                        _j = {};
                        return [4 /*yield*/, this.getBase64ImageFromURL(this.url)];
                    case 1:
                        // console.log(reportTime);
                        docDefinition = (_g.content = [
                            (_h.columns = [
                                (_j.image = _k.sent(),
                                    _j.width = 80,
                                    _j.alignment = 'left',
                                    _j),
                                {
                                    text: data.reportname,
                                    alignment: 'right',
                                    fontSize: 18,
                                    bold: true
                                },
                                {
                                    text: 'IQ-WORLD',
                                    alignment: 'center',
                                    fontSize: 10,
                                    margin: [250, 0, 0, 0]
                                }
                            ],
                                _h),
                            {
                                canvas: // Free Line
                                [
                                    { type: 'line', x1: 0, y1: 2, x2: 770 - 10, y2: 2, lineWidth: 0.1, color: '#145369', bold: false }
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 10, 50, 0],
                                        stack: [
                                            // {
                                            //   margin: [0, 0, 0, 10],
                                            //   columns: [
                                            //     {
                                            //       width: 50,
                                            //       style: "strong",
                                            //       text: "Distributor"
                                            //     },
                                            //     {
                                            //       width: "auto",
                                            //       margin: [0, 0, 5, 0],
                                            //       text: ":"
                                            //     },
                                            //     {
                                            //       width: "*",
                                            //       text: data?.filterList?.distributor
                                            //     }
                                            //   ]
                                            // },
                                            {
                                                margin: [0, 0, 0, 10],
                                                columns: [
                                                    {
                                                        width: 50,
                                                        style: "strong",
                                                        text: "State"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_a = data === null || data === void 0 ? void 0 : data.filterList) === null || _a === void 0 ? void 0 : _a.state
                                                    }
                                                ]
                                            },
                                            {
                                                margin: [0, 0, 0, 10],
                                                columns: [
                                                    {
                                                        width: 50,
                                                        style: "strong",
                                                        text: "District"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_b = data === null || data === void 0 ? void 0 : data.filterList) === null || _b === void 0 ? void 0 : _b.district
                                                    }
                                                ]
                                            },
                                            {
                                                margin: [0, 0, 0, 10],
                                                columns: [
                                                    {
                                                        width: 50,
                                                        style: "strong",
                                                        text: "City"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_c = data === null || data === void 0 ? void 0 : data.filterList) === null || _c === void 0 ? void 0 : _c.city
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                style: "filter"
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, -65, 50, 0],
                                        stack: [
                                            {
                                                columns: [
                                                    {
                                                        width: 50,
                                                        style: "strong",
                                                        text: "Location"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_d = data === null || data === void 0 ? void 0 : data.filterList) === null || _d === void 0 ? void 0 : _d.location
                                                    }
                                                ]
                                            },
                                            {
                                                margin: [0, 10, 0, 10],
                                                columns: [
                                                    {
                                                        width: 45,
                                                        style: "strong",
                                                        text: "Fromdate"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_e = data === null || data === void 0 ? void 0 : data.filterList) === null || _e === void 0 ? void 0 : _e.fromdate
                                                    }
                                                ]
                                            },
                                            {
                                                margin: [0, 0, 0, 10],
                                                columns: [
                                                    {
                                                        width: 45,
                                                        style: "strong",
                                                        text: "Todate"
                                                    },
                                                    {
                                                        width: "auto",
                                                        margin: [0, 0, 5, 0],
                                                        text: ":"
                                                    },
                                                    {
                                                        width: "*",
                                                        text: (_f = data === null || data === void 0 ? void 0 : data.filterList) === null || _f === void 0 ? void 0 : _f.todate
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                style: "filter1"
                            },
                            // {
                            //   columns: [
                            //     {
                            //       margin: [0, 10, 50, 0],
                            //       stack: [
                            //         {
                            //           margin: [0, 0, 0, 10],
                            //           columns: [
                            //             {
                            //               width: 45,
                            //               style: "strong",
                            //               text: "Bill to"
                            //             },
                            //             {
                            //               width: "auto",
                            //               margin: [0, 0, 5, 0],
                            //               text: ":"
                            //             },
                            //             {
                            //               width: "*",
                            //               text: 'this.cap(this.trimmer(this.api.billToAddress))'
                            //             }
                            //           ]
                            //         },
                            //         {
                            //           margin: [0, 0, 0, 10],
                            //           columns: [
                            //             {
                            //               width: 45,
                            //               style: "strong",
                            //               text: "Ship to"
                            //             },
                            //             {
                            //               width: "auto",
                            //               margin: [0, 0, 5, 0],
                            //               text: ":"
                            //             },
                            //             {
                            //               width: "*",
                            //               text: 'this.cap(this.trimmer(this.api.shippingAddress))'
                            //             }
                            //           ]
                            //         },
                            //         {
                            //           margin: [0, 0, 0, 10],
                            //           columns: [
                            //             {
                            //               width: 45,
                            //               style: "strong",
                            //               text: "Email"
                            //             },
                            //             {
                            //               width: "auto",
                            //               margin: [0, 0, 5, 0],
                            //               text: ":"
                            //             },
                            //             {
                            //               width: "*",
                            //               text: 'this.api.orderEmail'
                            //             }
                            //           ]
                            //         },
                            //         {
                            //           columns: [
                            //             {
                            //               width: 45,
                            //               style: "strong",
                            //               text: "Phone"
                            //             },
                            //             {
                            //               width: "auto",
                            //               margin: [0, 0, 5, 0],
                            //               text: ":"
                            //             },
                            //             {
                            //               width: "*",
                            //               text: 'this.api.phoneNumber'
                            //             }
                            //           ]
                            //         }
                            //       ]
                            //     }
                            //   ],
                            //   style: "filter"
                            // },
                            // {
                            //   text: '',
                            //   margin: [0, 0, 0, 3],
                            // },
                            // {
                            //   text: ` ADDRESS`,
                            //   style: 'texInvoice',
                            // },
                            // {
                            //   columns: [
                            //     {
                            //       alignment: 'left',
                            //       width: 350,
                            //       table: {
                            //         headerRows: 1,
                            //         alignment: 'center',
                            //         body: [
                            //           [
                            //             { text: `From Date`, style: 'dateHeader' },
                            //             { text: `To Date`, style: 'dateHeader' }
                            //           ],
                            //           [
                            //             { text: data.fdate, style: 'dateValue' },
                            //             { text: data.tdate, style: 'dateValue' }
                            //           ],
                            //         ],
                            //       },
                            //     },
                            //     {
                            //       text: `
                            //       Yash Electronics,
                            //       Babosa Industrial Park, BLDG.NO-A4,
                            //       1 st Floor Unit No-100-108 Saravali village,
                            //       Near Vatika Hotel, Nashik Highway(NH-3),
                            //       Bhiwandi – 4121302.`,
                            //       style: 'originalRecipt',
                            //     },
                            //   ]
                            // },
                            {
                                text: ' ',
                                margin: [0, 0, 0, 5]
                            },
                            {
                                canvas: // Free Line
                                [
                                    // { type: 'line', x1: 0, y1: 10, x2: 770 - 10, y2: 10, lineWidth: 0.5, color: '#145369', bold: false }
                                    { type: 'line', x1: 0, y1: 2, x2: 770 - 10, y2: 2, lineWidth: 0.1, color: '#145369', bold: false }
                                ]
                            },
                            {
                                text: ' ',
                                margin: [0, 0, 0, 5]
                            },
                            {
                                text: data.reportname,
                                style: 'SubTitleHeader'
                            },
                            {
                                text: ' ',
                                margin: [0, 0, 0, 5]
                            },
                            {
                                table: {
                                    textTransform: 'capitalize',
                                    headerRows: 1,
                                    widths: widths,
                                    body: __spreadArrays([
                                        bodyColumns
                                    ], bodydata)
                                }
                            }
                        ],
                            // FOOTER
                            _g.footer = function (currentPage, pageCount) {
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
                            _g.info = {
                                title: data.reportname,
                                author: 'Yash Electronics Pvt Ltd.',
                                subject: data.reportname,
                                keywords: data.reportname
                            },
                            // CSS
                            _g.styles = {
                                filter1: {
                                    fontSize: 10,
                                    bold: false,
                                    alignment: 'left',
                                    // color: '#ff0066',
                                    margin: [490, 0, 0, 0]
                                },
                                strong: {
                                    bold: true,
                                    color: "#145369"
                                },
                                filter: {
                                    fontSize: 10
                                },
                                texInvoice: {
                                    fontSize: 12,
                                    bold: true,
                                    // alignment: 'right',
                                    color: '#ff0066',
                                    margin: [490, 0, 0, 0],
                                    alignment: 'center'
                                },
                                tableF: {
                                    borderWidth: '0px',
                                    margin: [0, 5, 0, 15]
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
                            _g);
                        if (data.action === 'download') {
                            pdfMake.createPdf(docDefinition).download(data.reportname);
                        }
                        else if (data.action === 'print') {
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
    ExportService.prototype.getBase64ImageFromURL = function (url) {
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
    ExportService.prototype.pdfColumnWiths = function (data) {
        this.widthsAuto.length = 0;
        console.log(data);
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var i = data_1[_i];
            this.widthsAuto.push((100 / data.length) + "%");
            // this.widthsAuto.push('auto');
            // this.widthsAuto.push('100vw');
        }
        // console.log(this.widthsAuto);
        return this.widthsAuto;
    };
    ExportService.prototype.pdfColumnWithsByNumber = function (data) {
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
    ExportService.prototype.pdfBodyColumns = function (data) {
        // console.log(data);
        var pdfBodyColumns = [];
        for (var _i = 0, data_3 = data; _i < data_3.length; _i++) {
            var i = data_3[_i];
            var obj = { text: i, style: 'rowThreeHeader' };
            pdfBodyColumns.push(obj);
        }
        return pdfBodyColumns;
    };
    ExportService.prototype.pdfBodyHistory = function (data, type) {
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
    ExportService.prototype.getReportPrintTime = function () {
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
    ExportService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ExportService);
    return ExportService;
}());
exports.ExportService = ExportService;
