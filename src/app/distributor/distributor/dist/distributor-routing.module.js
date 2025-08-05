"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DistributorRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var dashboard_component_1 = require("../_features/dashboard/dashboard.component");
var new_client_component_1 = require("src/app/admin/_features/new-client/new-client.component");
var client_list_component_1 = require("src/app/admin/_features/client-list/client-list.component");
var pending_complaints_component_1 = require("src/app/admin/_features/pending-complaints/pending-complaints.component");
var device_logs_component_1 = require("src/app/admin/_features/device-logs/device-logs.component");
var routes = [{
        path: "", children: [
            { path: 'distributor-dashboard', component: dashboard_component_1.DashboardComponent },
            { path: 'distributor-customer-registation', component: new_client_component_1.NewClientComponent },
            { path: 'distributor-customer-list', component: client_list_component_1.ClientListComponent },
            { path: 'device-log-history', component: device_logs_component_1.DeviceLogsComponent },
            { path: 'distributor-pending-approval', component: pending_complaints_component_1.PendingComplaintsComponent }
        ]
    }
];
var DistributorRoutingModule = /** @class */ (function () {
    function DistributorRoutingModule() {
    }
    DistributorRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule]
        })
    ], DistributorRoutingModule);
    return DistributorRoutingModule;
}());
exports.DistributorRoutingModule = DistributorRoutingModule;
