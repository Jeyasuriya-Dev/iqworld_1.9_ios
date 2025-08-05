import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../_features/dashboard/dashboard.component';
import { NewClientComponent } from 'src/app/admin/_features/new-client/new-client.component';
import { ClientListComponent } from 'src/app/admin/_features/client-list/client-list.component';
import { PendingComplaintsComponent } from 'src/app/admin/_features/pending-complaints/pending-complaints.component';
import { DeviceLogsComponent } from 'src/app/admin/_features/device-logs/device-logs.component';
import { RaiseNewTicketComponent } from 'src/app/client/_features/raise-new-ticket/raise-new-ticket.component';

const routes: Routes = [{
  path: "", children: [
    { path: 'distributor-dashboard', component: DashboardComponent },
    { path: 'distributor-customer-registation', component: NewClientComponent },
    { path: 'distributor-customer-list', component: ClientListComponent },
    { path: 'device-log-history', component: DeviceLogsComponent },
    { path: 'distributor-pending-approval', component: PendingComplaintsComponent },
    { path: 'raise-new-ticket', component: RaiseNewTicketComponent }
  ]
}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistributorRoutingModule { }
