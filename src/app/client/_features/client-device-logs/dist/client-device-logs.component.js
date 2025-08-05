"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ClientDeviceLogsComponent = void 0;
var core_1 = require("@angular/core");
var ClientDeviceLogsComponent = /** @class */ (function () {
    function ClientDeviceLogsComponent(clientService, storage) {
        this.clientService = clientService;
        this.storage = storage;
        this.deviceList = [];
        this.fromdate = "null";
        this.todate = "null";
        this.selectedClientname = "null";
        this.deviceusername = "null";
        this.maxDate = new Date();
        this.filterDeviceList = this.deviceList.slice();
        this.columnDefs = [
            { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellStyle: { textAlign: 'left' }, cellClass: 'locked-col', width: 100 },
            {
                headerName: 'Unique Number', field: 'username'
            }, { headerName: 'Client Name', field: 'clientname' },
            {
                headerName: 'Model-name',
                field: 'modelname'
            },
            {
                headerName: "Orientation", field: "height_width",
                valueGetter: function (params) {
                    // console.log(params.data.height_width);
                    var v = params.data.height_width;
                    v = v.substring(2);
                    // console.log(v);
                    if (params.data.height_width) {
                        if (v == 16) {
                            return 'Vertical';
                        }
                        else {
                            return 'Horizental';
                        }
                    }
                    else {
                        return "UnDefined";
                    }
                }
            },
            { headerName: 'Screen Time (Hr:Min:Sec)', field: 'timeperiod' },
            { headerName: 'loged in', field: 'logindate' },
            { headerName: 'loged Out', field: 'logoutdate' }
            // { headerName: 'isDeleted', field: 'isdelete' }
        ];
        this.gridOptions = {
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true,
                // width: 180,
                floatingFilter: true
            },
            pagination: true
        };
    }
    ClientDeviceLogsComponent.prototype.ngOnInit = function () {
        var username1 = this.storage.getUser();
        // console.log(username1);
        if (username1.roles[0] == 'ROLE_CLIENT') {
            this.clientname = this.storage.getUser();
        }
        else if (username1.roles[0] == 'ROLE_ADMIN') {
            this.clientname = sessionStorage.getItem('auth-client');
            this.clientname = JSON.parse(this.clientname);
        }
        else {
            this.clientname = sessionStorage.getItem('auth-client');
            this.clientname = JSON.parse(this.clientname);
        }
        this.onChooseClient(this.clientname);
        this.filterLog();
    };
    ClientDeviceLogsComponent.prototype.onGridReady = function (params) {
        this.gridApi = params.api;
        // this.getAllDeviceList();
        // this.getAllDeviceModel();
    };
    ClientDeviceLogsComponent.prototype.onChooseClient = function (event) {
        var _this = this;
        console.log(event);
        this.selectedClientname = event === null || event === void 0 ? void 0 : event.username;
        this.deviceusername = "null";
        this.clientService.getdeviceListbyclientusername(event.username).subscribe(function (res) {
            console.log(res);
            _this.deviceList = res;
            _this.filterDeviceList = res;
        });
        this.filterLog();
    };
    ClientDeviceLogsComponent.prototype.onChooseDevice = function (device) {
        console.log(device);
        this.deviceusername = device === null || device === void 0 ? void 0 : device.username;
        this.filterLog();
    };
    ClientDeviceLogsComponent.prototype.exportAsExcelFile = function () {
    };
    ClientDeviceLogsComponent.prototype.exportPdf = function () {
    };
    ClientDeviceLogsComponent.prototype.onQuickFilterChanged = function () {
        this.gridApi.setQuickFilter(document.getElementById('quickFilter').value);
    };
    ClientDeviceLogsComponent.prototype.getFromDate = function (event) {
        // console.log(event.value);
        var date = new Date(event.value).getDate();
        var month = new Date(event.value).getMonth() + 1;
        var year = new Date(event.value).getFullYear();
        this.fromdate = year + "-" + month + "-" + date;
    };
    ClientDeviceLogsComponent.prototype.getToDate = function (event) {
        var date = new Date(event.value).getDate();
        var month = new Date(event.value).getMonth() + 1;
        var year = new Date(event.value).getFullYear();
        this.todate = year + "-" + month + "-" + date;
        console.log(this.fromdate + "---" + this.todate);
        this.filterLog();
    };
    ClientDeviceLogsComponent.prototype.filterLog = function () {
        var _this = this;
        this.clientService.filterLog(this.selectedClientname, this.deviceusername, this.fromdate, this.todate).subscribe(function (res) {
            _this.rowData = res;
        });
    };
    ClientDeviceLogsComponent = __decorate([
        core_1.Component({
            selector: 'app-client-device-logs',
            templateUrl: './client-device-logs.component.html',
            styleUrls: ['./client-device-logs.component.scss']
        })
    ], ClientDeviceLogsComponent);
    return ClientDeviceLogsComponent;
}());
exports.ClientDeviceLogsComponent = ClientDeviceLogsComponent;
