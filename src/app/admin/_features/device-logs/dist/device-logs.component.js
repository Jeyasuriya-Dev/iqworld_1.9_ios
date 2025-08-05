"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DeviceLogsComponent = void 0;
var core_1 = require("@angular/core");
var DeviceLogsComponent = /** @class */ (function () {
    function DeviceLogsComponent(tokenStorage, clientService) {
        this.tokenStorage = tokenStorage;
        this.clientService = clientService;
        this.isDistributor = false;
        this.clientList = [];
        this.deviceusername = "null";
        this.selectedClientname = "null";
        this.fromdate = "null";
        this.todate = "null";
        this.maxDate = new Date();
        this.rowData = [];
        this.deviceList = [];
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
            { headerName: 'loged out', field: 'logoutdate' }
            // { headerName: 'isDeleted', field: 'isdelete' }
        ];
        this.filteredClientList = this.clientList.slice();
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
    DeviceLogsComponent.prototype.ngOnInit = function () {
        var _a;
        if (this.tokenStorage.getUserRole() == "DISTRIBUTOR" || ((_a = this.tokenStorage.getDistributor()) === null || _a === void 0 ? void 0 : _a.roles)) {
            this.isDistributor = true;
        }
        else {
            this.isDistributor = false;
        }
        this.getAllClientList();
        this.filterLog();
    };
    DeviceLogsComponent.prototype.getAllClientList = function () {
        var _this = this;
        if (this.isDistributor) {
            var user = this.tokenStorage.getUser();
            if (user.roles[0] == "ROLE_DISTRIBUTOR") {
                this.clientService.getdistributorByUsername(user.username).subscribe(function (res) {
                    // console.log(res);
                    _this.clientService.getClientListByDistributorId(res === null || res === void 0 ? void 0 : res.id).subscribe(function (res) {
                        // console.log(res);
                        _this.clientList = res;
                        _this.filteredClientList = res;
                    });
                });
            }
            else {
                var di = this.tokenStorage.getDistributor();
                this.clientService.getdistributorByUsername(di.username).subscribe(function (res) {
                    // console.log(res);
                    _this.clientService.getClientListByDistributorId(res === null || res === void 0 ? void 0 : res.id).subscribe(function (res) {
                        // console.log(res);
                        _this.clientList = res;
                        _this.filteredClientList = res;
                    });
                });
            }
        }
        else {
            this.clientService.getAllClientList().subscribe(function (res) {
                console.log(res);
                _this.clientList = res;
                _this.filteredClientList = res;
            });
        }
    };
    DeviceLogsComponent.prototype.onChooseClient = function (event) {
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
    DeviceLogsComponent.prototype.onChooseDevice = function (device) {
        console.log(device);
        this.deviceusername = device === null || device === void 0 ? void 0 : device.username;
        this.filterLog();
    };
    DeviceLogsComponent.prototype.onGridReady = function (params) {
        this.gridApi = params.api;
        // this.getAllDeviceList();
        // this.getAllDeviceModel();
    };
    DeviceLogsComponent.prototype.exportAsExcelFile = function () {
    };
    DeviceLogsComponent.prototype.exportPdf = function () {
    };
    DeviceLogsComponent.prototype.getFromDate = function (event) {
        // console.log(event.value);
        var date = new Date(event.value).getDate();
        var month = new Date(event.value).getMonth() + 1;
        var year = new Date(event.value).getFullYear();
        this.fromdate = year + "-" + month + "-" + date;
    };
    DeviceLogsComponent.prototype.getToDate = function (event) {
        var date = new Date(event.value).getDate();
        var month = new Date(event.value).getMonth() + 1;
        var year = new Date(event.value).getFullYear();
        this.todate = year + "-" + month + "-" + date;
        console.log(this.fromdate + "---" + this.todate);
        this.filterLog();
    };
    DeviceLogsComponent.prototype.filterLog = function () {
        var _this = this;
        this.clientService.filterLog(this.selectedClientname, this.deviceusername, this.fromdate, this.todate).subscribe(function (res) {
            _this.rowData = res;
        });
    };
    DeviceLogsComponent.prototype.onQuickFilterChanged = function () {
        this.gridApi.setQuickFilter(document.getElementById('quickFilter').value);
    };
    DeviceLogsComponent = __decorate([
        core_1.Component({
            selector: 'app-device-logs',
            templateUrl: './device-logs.component.html',
            styleUrls: ['./device-logs.component.scss']
        })
    ], DeviceLogsComponent);
    return DeviceLogsComponent;
}());
exports.DeviceLogsComponent = DeviceLogsComponent;
