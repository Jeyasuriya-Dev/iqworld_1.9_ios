"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AdminModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var mat_material_module_1 = require("src/app/_core/mat-material/mat-material.module");
var ag_grid_angular_1 = require("ag-grid-angular");
var forms_1 = require("@angular/forms");
var form_field_1 = require("@angular/material/form-field");
var sidebar_component_1 = require("../sidebar/sidebar.component");
var dashboard_component_1 = require("../_features/dashboard/dashboard.component");
var admin_base_component_1 = require("../admin-base/admin-base.component");
var client_list_component_1 = require("../_features/client-list/client-list.component");
var deviceinfo_component_1 = require("../_features/deviceinfo/deviceinfo.component");
var pie_charts_component_1 = require("../_core/pie-charts/pie-charts.component");
var bar_charts_component_1 = require("../_core/bar-charts/bar-charts.component");
var revenue_analasys_component_1 = require("../_core/revenue-analasys/revenue-analasys.component");
var registration_chart_component_1 = require("../_core/registration-chart/registration-chart.component");
var new_client_component_1 = require("../_features/new-client/new-client.component");
var ag_charts_angular_1 = require("ag-charts-angular");
var core_module_1 = require("src/app/_core/core/core.module");
var admin_routing_module_1 = require("../admin-routing/admin-routing.module");
var new_dashboard_component_1 = require("../_features/new-dashboard/new-dashboard.component");
var new_distibutor_component_1 = require("../_features/new-distibutor/new-distibutor.component");
var complaints_all_component_1 = require("../_features/complaints-all/complaints-all.component");
var distributor_info_component_1 = require("../_features/distributor-info/distributor-info.component");
var pending_complaints_component_1 = require("src/app/admin/_features/pending-complaints/pending-complaints.component");
var device_logs_component_1 = require("../_features/device-logs/device-logs.component");
var AdminModule = /** @class */ (function () {
    function AdminModule() {
    }
    AdminModule = __decorate([
        core_1.NgModule({
            declarations: [
                sidebar_component_1.SidebarComponent,
                dashboard_component_1.DashboardComponent,
                admin_base_component_1.AdminBaseComponent,
                client_list_component_1.ClientListComponent,
                deviceinfo_component_1.DeviceinfoComponent,
                new_dashboard_component_1.NewDashboardComponent,
                pie_charts_component_1.PieChartsComponent,
                bar_charts_component_1.BarChartsComponent,
                revenue_analasys_component_1.RevenueAnalasysComponent,
                registration_chart_component_1.RegistrationChartComponent,
                new_client_component_1.NewClientComponent,
                new_distibutor_component_1.NewDistibutorComponent,
                complaints_all_component_1.ComplaintsAllComponent,
                distributor_info_component_1.DistributorInfoComponent,
                pending_complaints_component_1.PendingComplaintsComponent,
                device_logs_component_1.DeviceLogsComponent
            ],
            imports: [
                common_1.CommonModule,
                mat_material_module_1.MatMaterialModule,
                ag_grid_angular_1.AgGridModule,
                forms_1.ReactiveFormsModule,
                forms_1.FormsModule,
                form_field_1.MatFormFieldModule,
                admin_routing_module_1.AdminRoutingModule,
                ag_charts_angular_1.AgChartsAngularModule,
                core_module_1.CoreModule
            ],
            exports: [new_dashboard_component_1.NewDashboardComponent]
        })
    ], AdminModule);
    return AdminModule;
}());
exports.AdminModule = AdminModule;
