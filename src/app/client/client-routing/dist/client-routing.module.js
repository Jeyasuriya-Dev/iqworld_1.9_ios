"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ClientRoutingModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var editor_component_1 = require("src/app/_core/editor/editor.component");
var media_upload_component_1 = require("../_features/media-upload/media-upload.component");
var client_device_info_component_1 = require("../_features/client-device-info/client-device-info.component");
var schedule_component_1 = require("../_features/schedule/schedule.component");
var client_playlist_component_1 = require("../_features/client-playlist/client-playlist.component");
var client_dashboard_component_1 = require("../_features/client-dashboard/client-dashboard.component");
var scroller_design_component_1 = require("../_core/scroller-design/scroller-design.component");
var schedule_history_component_1 = require("../_features/schedule-history/schedule-history.component");
var setting_component_1 = require("src/app/setting/setting.component");
var raise_new_ticket_component_1 = require("../_features/raise-new-ticket/raise-new-ticket.component");
var device_registration_component_1 = require("../_features/device-registration/device-registration.component");
var editor_panel_component_1 = require("src/app/editor-panel/editor-panel.component");
var upgrade_plan_component_1 = require("../_core/upgrade-plan/upgrade-plan.component");
var layout_component_1 = require("../_core/layout/layout.component");
var client_device_logs_component_1 = require("../_features/client-device-logs/client-device-logs.component");
var routes = [{
        path: "", children: [
            { path: 'client-dashboard', component: client_dashboard_component_1.ClientDashboardComponent },
            { path: 'playlist', component: client_playlist_component_1.ClientPlaylistComponent },
            // { path: 'analytics', component: ClientAnalyticsComponent },
            { path: 'schedule', component: schedule_component_1.ScheduleComponent },
            { path: 'schedule-history', component: schedule_history_component_1.ScheduleHistoryComponent },
            { path: 'upload-media/:id', component: media_upload_component_1.MediaUploadComponent },
            { path: 'screen', component: client_device_info_component_1.ClientDeviceInfoComponent },
            { path: 'device-log-history', component: client_device_logs_component_1.ClientDeviceLogsComponent },
            { path: 'raise-new-ticket', component: raise_new_ticket_component_1.RaiseNewTicketComponent },
            { path: 'device-registration', component: device_registration_component_1.DeviceRegistrationComponent },
            { path: 'canvas', component: editor_component_1.EditorComponent },
            { path: 'scroll', component: scroller_design_component_1.ScrollerDesignComponent },
            { path: 'r-editor', component: editor_panel_component_1.EditorPanelComponent },
            { path: 'c-setting', component: setting_component_1.SettingComponent },
            { path: 'setting/upgrade-plan', component: upgrade_plan_component_1.UpgradePlanComponent },
            { path: 'lay-out', component: layout_component_1.LayoutComponent },
        ]
    }
];
var ClientRoutingModule = /** @class */ (function () {
    function ClientRoutingModule() {
    }
    ClientRoutingModule = __decorate([
        core_1.NgModule({
            declarations: [],
            imports: [
                common_1.CommonModule,
                router_1.RouterModule.forChild(routes)
            ],
            exports: [router_1.RouterModule]
        })
    ], ClientRoutingModule);
    return ClientRoutingModule;
}());
exports.ClientRoutingModule = ClientRoutingModule;
