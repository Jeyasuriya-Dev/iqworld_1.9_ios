import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// import { EditorComponent } from 'src/app/_core/editor/editor.component';
import { MediaUploadComponent } from '../_features/media-upload/media-upload.component';
import { ClientDeviceInfoComponent } from '../_features/client-device-info/client-device-info.component';
import { ScheduleComponent } from '../_features/schedule/schedule.component';
import { ClientPlaylistComponent } from '../_features/client-playlist/client-playlist.component';
import { ClientDashboardComponent } from '../_features/client-dashboard/client-dashboard.component';
import { ScrollerDesignComponent } from '../_core/scroller-design/scroller-design.component';
import { ScheduleHistoryComponent } from '../_features/schedule-history/schedule-history.component';
import { SettingComponent } from 'src/app/setting/setting.component';
import { RaiseNewTicketComponent } from '../_features/raise-new-ticket/raise-new-ticket.component';
import { DeviceRegistrationComponent } from '../_features/device-registration/device-registration.component';
import { REditorComponent } from 'src/app/_core/r-editor/r-editor.component';
import { EditorPanelComponent } from 'src/app/editor-panel/editor-panel.component';
import { UploadSteperComponent } from '../_features/upload-steper/upload-steper.component';
import { UpgradePlanComponent } from '../_core/upgrade-plan/upgrade-plan.component';
import { LayoutComponent } from '../_core/layout/layout.component';
import { ClientDeviceLogsComponent } from '../_features/client-device-logs/client-device-logs.component';
import { UserSettingsComponent } from '../_core/user-settings/user-settings.component';
import { StoreRegistrationComponent } from '../_core/store-registration/store-registration.component';
import { StoreInfoComponent } from '../_features/store-info/store-info.component';
import { CategoryInfoComponent } from '../_features/category-info/category-info.component';
import { ScheduleInfoComponent } from '../_features/schedule-info/schedule-info.component';
import { StoreMediaUploadComponent } from 'src/app/store/_features/store-media-upload/store-media-upload.component';

import { StorePlaylistComponent } from 'src/app/store/_features/store-playlist/store-playlist.component';
import { GalleryComponent } from 'src/app/store/_features/gallery/gallery.component';
import { VistaComponent } from 'src/app/_core/vista/vista.component';

const routes: Routes = [{
  path: "", children: [
    { path: 'client-dashboard', component: ClientDashboardComponent },
    { path: 'playlist', component: ClientPlaylistComponent },
    // { path: 'analytics', component: ClientAnalyticsComponent },
    { path: 'schedule', component: ScheduleComponent },
    { path: 'schedule-info', component: ScheduleInfoComponent },
    { path: 'schedule-history', component: ScheduleHistoryComponent },
    { path: 'upload-media/:id', component: MediaUploadComponent },
    { path: 'screen', component: ClientDeviceInfoComponent },
    { path: 'device-log-history', component: ClientDeviceLogsComponent },
    { path: 'raise-new-ticket', component: RaiseNewTicketComponent },
    { path: 'device-registration', component: DeviceRegistrationComponent },
    // { path: 'canvas', component: EditorComponent },
    // { path: "canvas/:id", component: EditorComponent },
    // { path: "canvas123//:username", component: VistaComponent },
    { path: "canvas123/:type/:username", component: VistaComponent },
    { path: 'scroll', component: ScrollerDesignComponent },
    { path: 'r-editor', component: EditorPanelComponent },
    { path: 'r-editor/:id', component: EditorPanelComponent },
    { path: 'c-setting', component: SettingComponent },
    { path: 'user-settings', component: UserSettingsComponent },
    { path: 'setting/upgrade-plan', component: UpgradePlanComponent },
    { path: 'setting/schedule-ota', component: UserSettingsComponent },
    { path: 'setting/master-settings', component: UserSettingsComponent },
    { path: 'stores-info', component: StoreInfoComponent },
    { path: 'categery-info/:id', component: CategoryInfoComponent },
    { path: 'lay-out/:id', component: LayoutComponent },
    { path: 'verify-playlist/:id', component: StoreMediaUploadComponent },
    { path: 'playlist-info', component: StorePlaylistComponent },
    { path: 'gellary', component: GalleryComponent }

  ]
}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
