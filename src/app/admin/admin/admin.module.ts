import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMaterialModule } from 'src/app/_core/mat-material/mat-material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DashboardComponent } from '../_features/dashboard/dashboard.component';
import { AdminBaseComponent } from '../admin-base/admin-base.component';
import { DeviceinfoComponent } from '../_features/deviceinfo/deviceinfo.component';
import { PieChartsComponent } from '../_core/pie-charts/pie-charts.component';
import { BarChartsComponent } from '../_core/bar-charts/bar-charts.component';
import { RevenueAnalasysComponent } from '../_core/revenue-analasys/revenue-analasys.component';
import { RegistrationChartComponent } from '../_core/registration-chart/registration-chart.component';
import { NewClientComponent } from '../_features/new-client/new-client.component';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { CoreModule } from 'src/app/_core/core/core.module';
import { AdminRoutingModule } from '../admin-routing/admin-routing.module';
import { NewDashboardComponent } from '../_features/new-dashboard/new-dashboard.component';
import { NewDistibutorComponent } from '../_features/new-distibutor/new-distibutor.component';
import { ComplaintsAllComponent } from '../_features/complaints-all/complaints-all.component';
import { DistributorInfoComponent } from '../_features/distributor-info/distributor-info.component';
import { PendingComplaintsComponent } from 'src/app/admin/_features/pending-complaints/pending-complaints.component';
import { DeviceLogsComponent } from '../_features/device-logs/device-logs.component';
import { CustomerSwapComponent } from '../_core/customer-swap/customer-swap.component';
import { PaymentHistoryComponent } from '../_features/payment-history/payment-history.component';


@NgModule({
  declarations: [
    SidebarComponent,
    DashboardComponent,
    AdminBaseComponent,
    DeviceinfoComponent,
    NewDashboardComponent,
    PieChartsComponent,
    BarChartsComponent,
    RevenueAnalasysComponent,
    RegistrationChartComponent,
    NewClientComponent,
    NewDistibutorComponent,
    ComplaintsAllComponent,
    DistributorInfoComponent,
    PendingComplaintsComponent,
    DeviceLogsComponent,
    CustomerSwapComponent,
    PaymentHistoryComponent,
  ],
  imports: [
    CommonModule,
    MatMaterialModule,
    AgGridModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    AdminRoutingModule,
    AgChartsAngularModule,
    CoreModule

  ],
  exports: [NewDashboardComponent]
})
export class AdminModule { 
  
}
