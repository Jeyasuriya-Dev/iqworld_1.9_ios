"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PendingComplaintsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var rxjs_1 = require("rxjs");
var sweetalert2_1 = require("sweetalert2");
var loader_component_1 = require("src/app/_core/loader/loader.component");
var PendingComplaintsComponent = /** @class */ (function () {
    function PendingComplaintsComponent(clientService, matDialog, renderer, storageService, excelService, pdfService) {
        this.clientService = clientService;
        this.matDialog = matDialog;
        this.renderer = renderer;
        this.storageService = storageService;
        this.excelService = excelService;
        this.pdfService = pdfService;
        this.selectClient = "All";
        this.columnDefs = [
            { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 100 },
            { headerName: 'Requested On', field: 'createddate' },
            {
                headerName: 'Status', field: 'isactive',
                valueGetter: function (e) {
                    if (e.data.isactive) {
                        return "Opened";
                    }
                    else {
                        return "closed";
                    }
                },
                cellStyle: function (params) {
                    if (params.data.isactive) {
                        //mark police cells as red
                        return { color: 'green' };
                    }
                    else {
                        return { color: 'red' };
                    }
                }
            },
            { headerName: 'Customer name', field: 'clientname1' },
            { headerName: 'Subject', field: 'subject' },
            { headerName: 'Actions', field: 'isactive', cellRenderer: this.CellRendererBtn.bind(this) },
            { headerName: 'Description', field: 'description', width: 600, cellClass: "cell-wrap-text" }
        ];
        this.gridOptions = {
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true,
                floatingFilter: true
            },
            pagination: true
        };
        this.rowData = [];
    }
    PendingComplaintsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getAllClientList();
        this.countryCtrl = new forms_1.FormControl();
        this.distibutor = this.storageService.getDistributor();
        if (this.distibutor) {
            this.clientService.getActivateListByDistributorOrAdmin(this.distibutor.username).subscribe(function (res) {
                _this.rowData = res.List;
                _this.pendingData = res;
                console.log(res);
            });
        }
        else {
            // this.getAllDeviceList();
            this.clientService.getActivateListByDistributorOrAdmin('admin').subscribe(function (res) {
                _this.rowData = res.List;
                _this.pendingData = res;
                // console.log(res);
            });
        }
        this.filteredClients = this.countryCtrl.valueChanges.pipe(rxjs_1.startWith(''), rxjs_1.map(function (client) {
            return client ? _this.filterClients(client) : _this.clientList;
        }));
    };
    PendingComplaintsComponent.prototype.getAllClientList = function () {
        var _this = this;
        this.clientService.getAllClientList().subscribe(function (res) {
            // console.log(res);
            _this.clientList = res;
            _this.filteredClients = _this.countryCtrl.valueChanges.pipe(rxjs_1.startWith(''), rxjs_1.map(function (client) {
                return client ? _this.filterClients(client) : Slice(_this.clientList);
            }));
        });
    };
    PendingComplaintsComponent.prototype.onChooseClient = function (clientname) {
        var _this = this;
        this.selectClient = clientname;
        this.clientService.getComplaintDetailsAllByClientname(clientname, "2").subscribe(function (res) {
            // console.log(res);
            _this.rowData = res;
        });
    };
    PendingComplaintsComponent.prototype.getActiveAndDeactiveRequest = function (type) {
        var _this = this;
        if (this.distibutor) {
            this.clientService.getActiveAndDeactiveRequest(this.distibutor.username, type).subscribe(function (res) {
                _this.rowData = res;
            });
        }
        else {
            this.clientService.getActiveAndDeactiveRequest('admin', type).subscribe(function (res) {
                _this.rowData = res;
            });
        }
    };
    PendingComplaintsComponent.prototype.solveComplaint = function (e) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: "Are you sure?",
            text: "you want to activate/upgrade!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, do it!"
        }).then(function (result) {
            if (result.isConfirmed) {
                var loader_1 = _this.matDialog.open(loader_component_1.LoaderComponent, {
                    panelClass: 'loader-upload'
                });
                _this.clientService.updateComplaint(e.id).subscribe(function (res) {
                    // console.log(res);
                    loader_1.close();
                    sweetalert2_1["default"].fire({
                        title: "Success!",
                        text: res.message,
                        icon: "success"
                    });
                    _this.ngOnInit();
                }, function (err) {
                    loader_1.close();
                    sweetalert2_1["default"].fire({
                        title: "Failed!",
                        text: err.error.message,
                        icon: "error"
                    });
                });
            }
        });
    };
    PendingComplaintsComponent.prototype.CellRendererBtn = function (params) {
        var _this = this;
        var _a, _b, _c, _d;
        var button = this.renderer.createElement('button');
        // console.log(params.data);
        this.renderer.addClass(button, 'mat-raised-button');
        this.renderer.setStyle(button, 'background', 'transparent');
        this.renderer.setStyle(button, 'margin', '0px 15%');
        this.renderer.setStyle(button, 'width', '50%');
        this.renderer.setStyle(button, 'line-height', '1.8');
        this.renderer.setStyle(button, "padding", "0px 5px");
        // this.renderer.setStyle(button, 'font-weight', '600');
        if (params.data.isactive) {
            if (((_b = (_a = params.data) === null || _a === void 0 ? void 0 : _a.type) === null || _b === void 0 ? void 0 : _b.type.includes('UPGRADE')) && ((_d = (_c = params.data) === null || _c === void 0 ? void 0 : _c.type) === null || _d === void 0 ? void 0 : _d.type) != "CLIENT_UPGRADE & DEVICE_CREATION") {
                this.renderer.setStyle(button, 'color', '#42aaf5');
                this.renderer.setStyle(button, 'border', '1px #42aaf5 solid');
                this.renderer.setProperty(button, 'innerText', 'Upgrade');
            }
            else {
                this.renderer.setStyle(button, 'color', '#f5902c');
                this.renderer.setStyle(button, 'border', '1px #f5902c solid');
                this.renderer.setProperty(button, 'innerText', 'Pending');
            }
            this.renderer.listen(button, 'click', function () {
                _this.solveComplaint(params.data);
            });
        }
        else {
            this.renderer.setStyle(button, 'color', 'green');
            this.renderer.setStyle(button, 'border', '1px green solid');
            this.renderer.setProperty(button, 'innerText', 'Approved');
            this.renderer.setAttribute(button, "disabled", "true");
        }
        var div = this.renderer.createElement('div');
        this.renderer.appendChild(div, button);
        return div;
    };
    PendingComplaintsComponent.prototype.onGridReady = function (params) {
        var _this = this;
        this.gridApi = params.api;
        if (this.distibutor) {
            this.clientService.getActivateListByDistributorOrAdmin(this.distibutor.username).subscribe(function (res) {
                _this.rowData = res.List;
                _this.gridApi.setRowData(res.List);
                // console.log(res);
            });
        }
        else {
            this.clientService.getActivateListByDistributorOrAdmin('admin').subscribe(function (res) {
                _this.rowData = res.List;
                // console.log(res);
                _this.gridApi.setRowData(res.List);
            });
            // this.clientService.getComplaintList().subscribe((data) => {
            //   this.gridApi.setRowData(data);
            // });
        }
    };
    PendingComplaintsComponent.prototype.getAllDeviceList = function () {
        var _this = this;
        this.clientService.getComplaintList().subscribe(function (res) {
            // console.log(res);
            _this.rowData = res;
        });
        // this.userService.getDeviceByAdroidId().subscribe((res: any) => {
        //   console.log(res);
        //   // this.rowData = res;
        // })
    };
    PendingComplaintsComponent.prototype.onQuickFilterChanged = function () {
        // console.log(this.gridApi);
        this.gridApi.setQuickFilter(document.getElementById('quickFilter').value);
    };
    PendingComplaintsComponent.prototype.filterClients = function (username) {
        var arr = this.clientList.filter(function (client) { return client.username.toLowerCase().indexOf(username.toLowerCase()) === 0; });
        return arr.length ? arr : [{ username: 'No Item found', code: 'null' }];
    };
    PendingComplaintsComponent.prototype.clearCountryCtrl = function () {
        this.countryCtrl.setValue("");
        // this.getAllDeviceList();
        this.ngOnInit();
    };
    PendingComplaintsComponent.prototype.exportAsExcelFile = function () {
    };
    PendingComplaintsComponent.prototype.exportPdf = function () {
    };
    PendingComplaintsComponent = __decorate([
        core_1.Component({
            selector: 'app-pending-complaints',
            templateUrl: './pending-complaints.component.html',
            styleUrls: ['./pending-complaints.component.scss']
        })
    ], PendingComplaintsComponent);
    return PendingComplaintsComponent;
}());
exports.PendingComplaintsComponent = PendingComplaintsComponent;
function Slice(list) {
    // console.log(list);onQuickFilterChanged
    var clientList = list.slice();
    return clientList;
}
