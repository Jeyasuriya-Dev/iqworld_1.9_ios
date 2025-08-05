import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientAnalyticsComponent } from '../_features/client-analytics/client-analytics.component';
import { ClientBarChartComponent } from '../_core/client-bar-chart/client-bar-chart.component';
import { ClientDashboardComponent } from '../_features/client-dashboard/client-dashboard.component';
import { ClientDeviceInfoComponent } from '../_features/client-device-info/client-device-info.component';
import { ClientPlaylistComponent } from '../_features/client-playlist/client-playlist.component';
import { MediaUploadComponent } from '../_features/media-upload/media-upload.component';
import { NewDashComponent } from '../_features/new-dash/new-dash.component';
import { ScheduleComponent } from '../_features/schedule/schedule.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMaterialModule } from 'src/app/_core/mat-material/mat-material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AgGridModule } from 'ag-grid-angular';
import { DeviceAnalyticsComponent } from '../_core/device-analytics/device-analytics.component';
import { ClientPieChartComponent } from '../_core/client-pie-chart/client-pie-chart.component';
import { ClientDeviceAnalyticsComponent } from '../_core/client-device-analytics/client-device-analytics.component';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { ClientSidebarComponent } from '../client-sidebar/client-sidebar.component';
import { ClientBaseComponent } from '../client-base/client-base.component';
import { CoreModule } from 'src/app/_core/core/core.module';
import { ClientRoutingModule } from '../client-routing/client-routing.module';
import { ScrollerDesignComponent } from '../_core/scroller-design/scroller-design.component';
import { ScheduleHistoryComponent } from '../_features/schedule-history/schedule-history.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RaiseNewTicketComponent } from '../_features/raise-new-ticket/raise-new-ticket.component';
import { DeviceRegistrationComponent } from '../_features/device-registration/device-registration.component';
import { MatStepperModule } from '@angular/material/stepper';
import { UploadSteperComponent } from '../_features/upload-steper/upload-steper.component';
import { LayoutComponent } from '../_core/layout/layout.component';
import { ClientDeviceLogsComponent } from '../_features/client-device-logs/client-device-logs.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeMediafileOrderComponent } from '../_core/change-mediafile-order/change-mediafile-order.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
// import { SwiperModule } from 'swiper/angular';
import { StoreRegistrationComponent } from '../_core/store-registration/store-registration.component';
import { StoreInfoComponent } from '../_features/store-info/store-info.component';
import { CategoryInfoComponent } from '../_features/category-info/category-info.component';
import { ScheduleInfoComponent } from '../_features/schedule-info/schedule-info.component';



@NgModule({
  declarations: [
    ClientAnalyticsComponent,
    ClientBarChartComponent,
    ClientDashboardComponent,
    ClientDeviceInfoComponent,
    ClientPlaylistComponent,
    MediaUploadComponent,
    NewDashComponent,
    ScheduleComponent,
    DeviceAnalyticsComponent,
    ClientPieChartComponent,
    ClientDeviceAnalyticsComponent,
    ClientSidebarComponent,
    ClientBaseComponent,
    ScrollerDesignComponent,
    ScheduleHistoryComponent,
    RaiseNewTicketComponent,
    DeviceRegistrationComponent,
    UploadSteperComponent,
    LayoutComponent,
    ClientDeviceLogsComponent,
    ChangeMediafileOrderComponent,
    StoreRegistrationComponent,
    StoreInfoComponent,
    CategoryInfoComponent,
    ScheduleInfoComponent,
  ],
  imports: [
    FormsModule,
    ClientRoutingModule,
    MatMaterialModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    AgGridModule,
    AgChartsAngularModule,
    CommonModule,
    MatDatepickerModule,
    // CanvasJSAngularChartsModule,
    CoreModule,
    YouTubePlayerModule,
    // SwiperModule
  ],
  exports: [],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class ClientModule { }
