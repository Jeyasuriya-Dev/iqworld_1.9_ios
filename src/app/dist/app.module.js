"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var animations_1 = require("@angular/platform-browser/animations");
var auth_interceptor_1 = require("./_helper/auth.interceptor");
var http_1 = require("@angular/common/http");
var flex_layout_1 = require("@angular/flex-layout");
var editor_component_1 = require("./_core/editor/editor.component");
var otp_verification_component_1 = require("./_core/cellrenders/otp-verification/otp-verification.component");
var ngx_toastr_1 = require("ngx-toastr");
var loader_component_1 = require("./_core/loader/loader.component");
var onlynumbers_directive_1 = require("./_core/directves/onlynumbers.directive");
var keepalive_1 = require("@ng-idle/keepalive");
var client_module_1 = require("./client/client/client.module");
var admin_module_1 = require("./admin/admin/admin.module");
var preloader_component_1 = require("./_core/loader/preloader/preloader.component");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                editor_component_1.EditorComponent,
                otp_verification_component_1.OtpVerificationComponent,
                loader_component_1.LoaderComponent,
                onlynumbers_directive_1.OnlynumbersDirective,
                preloader_component_1.PreloaderComponent,
            ],
            imports: [
                platform_browser_1.BrowserModule,
                flex_layout_1.CoreModule,
                app_routing_module_1.AppRoutingModule,
                client_module_1.ClientModule,
                // MatStepperModule,
                admin_module_1.AdminModule,
                animations_1.BrowserAnimationsModule,
                http_1.HttpClientModule,
                keepalive_1.NgIdleKeepaliveModule.forRoot(),
                ngx_toastr_1.ToastrModule.forRoot({
                    timeOut: 4000,
                    closeButton: true,
                    progressBar: true
                }),
            ],
            exports: [],
            providers: [{ provide: http_1.HTTP_INTERCEPTORS, useClass: auth_interceptor_1.AuthInterceptor, multi: true }],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
