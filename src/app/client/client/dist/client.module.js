"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ClientModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var client_analytics_component_1 = require("../_features/client-analytics/client-analytics.component");
var client_bar_chart_component_1 = require("../_core/client-bar-chart/client-bar-chart.component");
var client_dashboard_component_1 = require("../_features/client-dashboard/client-dashboard.component");
var client_device_info_component_1 = require("../_features/client-device-info/client-device-info.component");
var client_playlist_component_1 = require("../_features/client-playlist/client-playlist.component");
var media_upload_component_1 = require("../_features/media-upload/media-upload.component");
var new_dash_component_1 = require("../_features/new-dash/new-dash.component");
var schedule_component_1 = require("../_features/schedule/schedule.component");
var forms_1 = require("@angular/forms");
var mat_material_module_1 = require("src/app/_core/mat-material/mat-material.module");
var form_field_1 = require("@angular/material/form-field");
var ag_grid_angular_1 = require("ag-grid-angular");
var device_analytics_component_1 = require("../_core/device-analytics/device-analytics.component");
var client_pie_chart_component_1 = require("../_core/client-pie-chart/client-pie-chart.component");
var client_device_analytics_component_1 = require("../_core/client-device-analytics/client-device-analytics.component");
var ag_charts_angular_1 = require("ag-charts-angular");
var client_sidebar_component_1 = require("../client-sidebar/client-sidebar.component");
var client_base_component_1 = require("../client-base/client-base.component");
var core_module_1 = require("src/app/_core/core/core.module");
var client_routing_module_1 = require("../client-routing/client-routing.module");
var scroller_design_component_1 = require("../_core/scroller-design/scroller-design.component");
var schedule_history_component_1 = require("../_features/schedule-history/schedule-history.component");
var datepicker_1 = require("@angular/material/datepicker");
var raise_new_ticket_component_1 = require("../_features/raise-new-ticket/raise-new-ticket.component");
var device_registration_component_1 = require("../_features/device-registration/device-registration.component");
var upload_steper_component_1 = require("../_features/upload-steper/upload-steper.component");
var layout_component_1 = require("../_core/layout/layout.component");
var client_device_logs_component_1 = require("../_features/client-device-logs/client-device-logs.component");
var ClientModule = /** @class */ (function () {
    function ClientModule() {
    }
    ClientModule = __decorate([
        core_1.NgModule({
            declarations: [
                client_analytics_component_1.ClientAnalyticsComponent,
                client_bar_chart_component_1.ClientBarChartComponent,
                client_dashboard_component_1.ClientDashboardComponent,
                client_device_info_component_1.ClientDeviceInfoComponent,
                client_playlist_component_1.ClientPlaylistComponent,
                media_upload_component_1.MediaUploadComponent,
                new_dash_component_1.NewDashComponent,
                schedule_component_1.ScheduleComponent,
                device_analytics_component_1.DeviceAnalyticsComponent,
                client_pie_chart_component_1.ClientPieChartComponent,
                client_device_analytics_component_1.ClientDeviceAnalyticsComponent,
                client_sidebar_component_1.ClientSidebarComponent,
                client_base_component_1.ClientBaseComponent,
                scroller_design_component_1.ScrollerDesignComponent,
                schedule_history_component_1.ScheduleHistoryComponent,
                raise_new_ticket_component_1.RaiseNewTicketComponent,
                device_registration_component_1.DeviceRegistrationComponent,
                upload_steper_component_1.UploadSteperComponent,
                layout_component_1.LayoutComponent,
                client_device_logs_component_1.ClientDeviceLogsComponent
            ],
            imports: [
                forms_1.FormsModule,
                client_routing_module_1.ClientRoutingModule,
                mat_material_module_1.MatMaterialModule,
                forms_1.ReactiveFormsModule,
                form_field_1.MatFormFieldModule,
                ag_grid_angular_1.AgGridModule,
                ag_charts_angular_1.AgChartsAngularModule,
                common_1.CommonModule,
                datepicker_1.MatDatepickerModule,
                // CanvasJSAngularChartsModule,
                core_module_1.CoreModule,
            ],
            exports: []
        })
    ], ClientModule);
    return ClientModule;
}());
exports.ClientModule = ClientModule;
