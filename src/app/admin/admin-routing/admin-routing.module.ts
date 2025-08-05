import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../_features/dashboard/dashboard.component';
import { NewClientComponent, distributor } from '../_features/new-client/new-client.component';
import { ClientListComponent } from '../_features/client-list/client-list.component';
import { DeviceinfoComponent } from '../_features/deviceinfo/deviceinfo.component';
import { SettingComponent } from 'src/app/setting/setting.component';
import { OtaComponent } from 'src/app/setting/ota/ota.component';
import { NewDistibutorComponent } from '../_features/new-distibutor/new-distibutor.component';
import { ComplaintsAllComponent } from '../_features/complaints-all/complaints-all.component';
import { DistributorInfoComponent } from '../_features/distributor-info/distributor-info.component';
import { PendingComplaintsComponent } from 'src/app/admin/_features/pending-complaints/pending-complaints.component';
import { DeviceLogsComponent } from '../_features/device-logs/device-logs.component';
import { PaymentHistoryComponent } from '../_features/payment-history/payment-history.component';


const routes: Routes = [{
  path: "", children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'add-client', component: NewClientComponent },
    { path: 'client-list', component: ClientListComponent },
    { path: 'device-list', component: DeviceinfoComponent },
    { path: 'add-distributor', component: NewDistibutorComponent },
    { path: 'distributor-list', component: DistributorInfoComponent },
    { path: 'complaints', component: ComplaintsAllComponent },
    { path: 'pending-approval', component: PendingComplaintsComponent },
    { path: 'device-log-history', component: DeviceLogsComponent },
    { path: 'setting', component: SettingComponent },
    { path: 'setting/ota', component: OtaComponent },
    { path: "payment-history", component: PaymentHistoryComponent }
  ]
}]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
