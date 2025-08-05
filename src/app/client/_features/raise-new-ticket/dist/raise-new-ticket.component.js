"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RaiseNewTicketComponent = void 0;
var core_1 = require("@angular/core");
var resolve_ticket_btn_component_1 = require("src/app/_core/cellrenders/resolve-ticket-btn/resolve-ticket-btn.component");
var RaiseNewTicketComponent = /** @class */ (function () {
    function RaiseNewTicketComponent(storageService, clientService, alertService) {
        this.storageService = storageService;
        this.clientService = clientService;
        this.alertService = alertService;
        this.columnDefs = [
            { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 100 },
            {
                headerName: 'Actions', field: '', cellRenderer: resolve_ticket_btn_component_1.ResolveTicketBtnComponent
            },
            { headerName: 'Complainted On', field: 'createddate' },
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
            {
                headerName: 'resolve', field: 'isresolved',
                valueGetter: function (e) {
                    if (e.data.isresolved) {
                        return "Resolved";
                    }
                    else {
                        return "Pending";
                    }
                },
                cellStyle: function (params) {
                    if (params.data.isresolved) {
                        //mark police cells as red
                        return { color: 'green' };
                    }
                    else {
                        return { color: 'red' };
                    }
                }
            },
            { headerName: 'Subject', field: 'subject' },
            { headerName: 'Description', cellClass: "cell-wrap-text", field: 'description', width: 600 },
        ];
        this.gridOptions = {
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true,
                width: 180,
                floatingFilter: true
            },
            pagination: true
        };
        this.rowData = [];
    }
    RaiseNewTicketComponent.prototype.onGridReady = function (params) {
        var _this = this;
        this.gridApi = params.api;
        this.clientService.getComplaintDetailsAllByClientname(this.clientUsername, 1).subscribe(function (res) {
            // console.log(res);
            _this.rowData = res;
            _this.gridApi.setRowData(res);
        });
    };
    RaiseNewTicketComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.clientUsername = this.storageService.getClientUsername();
        this.clientService.getComplaintDetailsAllByClientname(this.clientUsername, 1).subscribe(function (res) {
            // console.log(res);
            _this.rowData = res;
            // this.gridApi.setRowData(res);
        });
    };
    RaiseNewTicketComponent.prototype.sentComplaint = function (sub, disc) {
        var _this = this;
        // console.log(sub.value, disc.value);
        // console.log(this.clientUsername);
        if (sub.value && disc.value) {
            this.clientService.createComplaint(sub.value, disc.value, this.clientUsername).subscribe(function (res) {
                // console.log(res);
                _this.alertService.showSuccess(res.message);
                // window.location.reload();
                var v = document.getElementById("subject");
                var v1 = document.getElementById("message");
                v.value = null;
                v1.value = null;
                _this.ngOnInit();
            });
        }
        else {
            this.alertService.showWarning("Please Fill All fields");
        }
    };
    RaiseNewTicketComponent = __decorate([
        core_1.Component({
            selector: 'app-raise-new-ticket',
            templateUrl: './raise-new-ticket.component.html',
            styleUrls: ['./raise-new-ticket.component.scss']
        })
    ], RaiseNewTicketComponent);
    return RaiseNewTicketComponent;
}());
exports.RaiseNewTicketComponent = RaiseNewTicketComponent;
