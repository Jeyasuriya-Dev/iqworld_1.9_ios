import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { StoreDashboardComponent } from './_features/store-dashboard/store-dashboard.component';
import { StoreSidebarComponent } from './store-sidebar/store-sidebar.component';
import { StoreBaseComponent } from './store-base/store-base.component';
import { CoreModule } from "../_core/core/core.module";
import { MatMaterialModule } from '../_core/mat-material/mat-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StoreDeviceInfoComponent } from './_features/store-device-info/store-device-info.component';
import { UserInfoComponent } from './_features/user-info/user-info.component';
import { StoreCategoryInfoComponent } from './_features/store-category-info/store-category-info.component';
import { StorePlaylistComponent } from './_features/store-playlist/store-playlist.component';
import { StoreMediaUploadComponent } from './_features/store-media-upload/store-media-upload.component';
import { AgGridModule } from 'ag-grid-angular';
import { StoreScheduleInfoComponent } from './_features/store-schedule-info/store-schedule-info.component';
import { GalleryComponent } from './_features/gallery/gallery.component';
@NgModule({
    declarations: [
        StoreDashboardComponent,
        StoreSidebarComponent,
        StoreBaseComponent,
        StoreDeviceInfoComponent,
        UserInfoComponent,
        StoreCategoryInfoComponent,
        StorePlaylistComponent,
        StoreMediaUploadComponent,
        StoreScheduleInfoComponent,
        GalleryComponent,
      
    ],
    imports: [
        CommonModule,
        StoreRoutingModule,
        MatMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        CoreModule,
        MatFormFieldModule ,
        AgGridModule,
    ]
})
export class StoreModule { }
