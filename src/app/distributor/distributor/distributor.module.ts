import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributorRoutingModule } from './distributor-routing.module';
import { DashboardComponent } from '../_features/dashboard/dashboard.component';
import { CoreModule } from 'src/app/_core/core/core.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMaterialModule } from 'src/app/_core/mat-material/mat-material.module';
import { DistributorBaseComponent } from '../distributor-base/distributor-base.component';
import { DistributorSidebarComponent } from '../distributor-sidebar/distributor-sidebar.component';
import { AdminModule } from 'src/app/admin/admin/admin.module';


@NgModule({
  declarations: [
    DashboardComponent,
    DistributorSidebarComponent,
    DistributorBaseComponent,
  ],
  imports: [
    CommonModule,
    DistributorRoutingModule,
    FormsModule,
    MatMaterialModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    AgGridModule,
    AgChartsAngularModule,
    AdminModule,
    MatDatepickerModule,
    // CanvasJSAngularChartsModule,
    CoreModule,

  ]
})
export class DistributorModule { }
