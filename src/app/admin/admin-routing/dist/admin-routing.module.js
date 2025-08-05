"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AdminRoutingModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var dashboard_component_1 = require("../_features/dashboard/dashboard.component");
var new_client_component_1 = require("../_features/new-client/new-client.component");
var client_list_component_1 = require("../_features/client-list/client-list.component");
var deviceinfo_component_1 = require("../_features/deviceinfo/deviceinfo.component");
var setting_component_1 = require("src/app/setting/setting.component");
var ota_component_1 = require("src/app/setting/ota/ota.component");
var new_distibutor_component_1 = require("../_features/new-distibutor/new-distibutor.component");
var complaints_all_component_1 = require("../_features/complaints-all/complaints-all.component");
var distributor_info_component_1 = require("../_features/distributor-info/distributor-info.component");
var pending_complaints_component_1 = require("src/app/admin/_features/pending-complaints/pending-complaints.component");
var device_logs_component_1 = require("../_features/device-logs/device-logs.component");
var routes = [{
        path: "", children: [
            { path: 'dashboard', component: dashboard_component_1.DashboardComponent },
            { path: 'add-client', component: new_client_component_1.NewClientComponent },
            { path: 'client-list', component: client_list_component_1.ClientListComponent },
            { path: 'device-list', component: deviceinfo_component_1.DeviceinfoComponent },
            { path: 'add-distributor', component: new_distibutor_component_1.NewDistibutorComponent },
            { path: 'distributor-list', component: distributor_info_component_1.DistributorInfoComponent },
            { path: 'complaints', component: complaints_all_component_1.ComplaintsAllComponent },
            { path: 'pending-approval', component: pending_complaints_component_1.PendingComplaintsComponent },
            { path: 'device-log-history', component: device_logs_component_1.DeviceLogsComponent },
            { path: 'setting', component: setting_component_1.SettingComponent },
            { path: 'setting/ota', component: ota_component_1.OtaComponent },
        ]
    }];
var AdminRoutingModule = /** @class */ (function () {
    function AdminRoutingModule() {
    }
    AdminRoutingModule = __decorate([
        core_1.NgModule({
            declarations: [],
            imports: [
                common_1.CommonModule,
                router_1.RouterModule.forChild(routes)
            ],
            exports: [router_1.RouterModule]
        })
    ], AdminRoutingModule);
    return AdminRoutingModule;
}());
exports.AdminRoutingModule = AdminRoutingModule;
