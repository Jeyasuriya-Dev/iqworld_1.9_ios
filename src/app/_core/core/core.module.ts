import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from 'src/app/login/login.component';
import { ForgetPassComponent } from 'src/app/forget-pass/forget-pass.component';
import { MatMaterialModule } from '../mat-material/mat-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateTimeRenderComponent } from '../cellrenders/date-time-render/date-time-render.component';
import { MatIconModule } from '@angular/material/icon';
import { IdleTimeOutComponent } from '../idle-time-out/idle-time-out.component';
import { CountdownTimerComponent } from '../countdown-timer/countdown-timer.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { VistaComponent } from '../vista/vista.component';
import { OtaComponent } from 'src/app/setting/ota/ota.component';
import { SettingComponent } from 'src/app/setting/setting.component';
import { AgGridModule } from 'ag-grid-angular';
import { ApkEnableBtnComponent } from '../cellrenders/apk-enable-btn/apk-enable-btn.component';
import { ResolveTicketBtnComponent } from '../cellrenders/resolve-ticket-btn/resolve-ticket-btn.component';
import { QrCodeGeneratorComponent } from '../cellrenders/qr-code-generator/qr-code-generator.component';
import { CostumerActivateBtnComponent } from '../cellrenders/costumer-activate-btn/costumer-activate-btn.component';
import { DeviceActivateBtnComponent } from '../cellrenders/device-activate-btn/device-activate-btn.component';
import { REditorComponent } from '../r-editor/r-editor.component';
import { EditorPanelComponent } from 'src/app/editor-panel/editor-panel.component';
import { MatStepperModule, matStepperAnimations } from '@angular/material/stepper';
import { ModelnameDropdownComponent } from '../cellrenders/modelname-dropdown/modelname-dropdown.component';
import { LogInComponent } from 'src/app/log-in/log-in.component';
import { EditCustomerComponent } from '../popups/edit-customer/edit-customer.component';
import { EditDistributorComponent } from '../popups/edit-distributor/edit-distributor.component';
import { EditDeviceComponent } from '../popups/edit-device/edit-device.component';
import { UpgradePlanComponent } from 'src/app/client/_core/upgrade-plan/upgrade-plan.component';
import { KtdGridModule } from '@katoid/angular-grid-layout';
import { GridsterModule } from 'angular-gridster2';
import { UserSettingsComponent } from 'src/app/client/_core/user-settings/user-settings.component';
import { PreviewComponent } from '../popups/preview/preview.component';
// import { SwiperModule } from "swiper/angular";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoaderComponent } from '../loader/loader.component';
import { ClientListComponent } from 'src/app/admin/_features/client-list/client-list.component';
import { PdfViewerComponent } from '../cellrenders/pdf-viewer/pdf-viewer.component';
import { YoutubePlayerComponent } from '../cellrenders/youtube-player/youtube-player.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
@NgModule({
  declarations: [
    LoginComponent,
    ForgetPassComponent,
    DateTimeRenderComponent,
    IdleTimeOutComponent,
    CountdownTimerComponent,
    VistaComponent,
    OtaComponent,
    SettingComponent,
    ApkEnableBtnComponent,
    ResolveTicketBtnComponent,
    QrCodeGeneratorComponent,
    CostumerActivateBtnComponent,
    DeviceActivateBtnComponent,
    REditorComponent,
    EditorPanelComponent,
    ModelnameDropdownComponent,
    LogInComponent,
    EditCustomerComponent,
    EditDistributorComponent,
    EditDeviceComponent,
    UpgradePlanComponent,
    UserSettingsComponent,
    PreviewComponent,
    LoaderComponent,
    ClientListComponent,
    PdfViewerComponent,
    YoutubePlayerComponent
  ],
  imports: [
    CommonModule,
    MatMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatProgressBarModule,
    CanvasJSAngularChartsModule,
    AgGridModule,
    KtdGridModule,
    GridsterModule,
    YouTubePlayerModule,
    // SwiperModule,
  ],
  exports: [IdleTimeOutComponent, PdfViewerComponent, YoutubePlayerComponent, ClientListComponent, KtdGridModule, GridsterModule, CanvasJSAngularChartsModule, QrCodeGeneratorComponent, REditorComponent, VistaComponent, SettingComponent, ResolveTicketBtnComponent, OtaComponent]
})
export class CoreModule { }
