import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreDashboardComponent } from './_features/store-dashboard/store-dashboard.component';
import { StoreDeviceInfoComponent } from './_features/store-device-info/store-device-info.component';
import { UserInfoComponent } from './_features/user-info/user-info.component';
import { StoreCategoryInfoComponent } from './_features/store-category-info/store-category-info.component';
import { StorePlaylistComponent } from './_features/store-playlist/store-playlist.component';
import { StoreMediaUploadComponent } from './_features/store-media-upload/store-media-upload.component';
import { LayoutComponent } from '../client/_core/layout/layout.component';
import { StoreScheduleInfoComponent } from './_features/store-schedule-info/store-schedule-info.component';
import { GalleryComponent } from './_features/gallery/gallery.component';
const routes: Routes = [{
  path: "", children: [
    { path: 'dashboard', component: StoreDashboardComponent },
    { path: 'device-info', component: StoreDeviceInfoComponent },
    { path: 'user-info', component: UserInfoComponent },
    { path: 'category', component: StoreCategoryInfoComponent },
    { path: 'playlist', component: StorePlaylistComponent },
    { path: 'schedule-info', component: StoreScheduleInfoComponent },
    { path: 'mediaupload/:id', component: StoreMediaUploadComponent },
    { path: 'lay-out/:id', component: LayoutComponent },
    { path: 'gellary', component: GalleryComponent },
  ]
}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
