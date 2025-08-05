import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminBaseComponent } from './admin/admin-base/admin-base.component';
import { AuthGuard } from './_core/services/auth.guard';
import { ClientBaseComponent } from './client/client-base/client-base.component';
import { ClientGuard } from './_core/services/client.guard';
import { ForgetPassComponent } from './forget-pass/forget-pass.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { OtaComponent } from './setting/ota/ota.component';
import { NewClientComponent, distributor } from './admin/_features/new-client/new-client.component';
import { DeviceRegistrationComponent } from './client/_features/device-registration/device-registration.component';
import { LogInComponent } from './log-in/log-in.component';
import { DistributorBaseComponent } from './distributor/distributor-base/distributor-base.component';
import { DevGuard } from './_core/services/dev.guard';
import { NewDistibutorComponent } from './admin/_features/new-distibutor/new-distibutor.component';
import { ClosedComponent } from './closed/closed.component';
import { StoreBaseComponent } from './store/store-base/store-base.component';
import { StoreGuard } from './_core/services/store.guard';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'login1', component: LoginComponent },
  { path: 'login', component: LogInComponent },
  { path: 'iqworld/digitalsignage/customer/registrationform/:id', component: NewClientComponent },
  { path: 'iqworld/digitalsignage/device/registrationform/:id', component: DeviceRegistrationComponent },
  { path: 'developer/ota-update', canActivate: [DevGuard], component: OtaComponent },
  { path: 'newdistributorregistration/:id/:expiry', component: NewDistibutorComponent },
  { path: 'newcustomerregistration/:id/:expiry', component: NewClientComponent },
  // { path: 'admin-mobile/newdistributor/:id', component: NewDistibutorComponent },
  // { path: 'admin-mobile/newclient/:m', component: NewClientComponent },
  // { path: 'client-mobile/playlist/:clientid', component: ClientPlaylistComponent },
  // { path: 'client-mobile/playlist/uploadmedia/:id', component: MediaUploadComponent },
  // { path: 'client-mobile/lay-out/:id', component: LayoutComponent },
  { path: "recovery-password", component: ForgetPassComponent, loadChildren: () => import('./_core/core/core.module').then(m => m.CoreModule) },
  { path: "reset-password/:username/:expiry", component: ForgetPassComponent },
  {
    path: "admin", component: AdminBaseComponent, canActivate: [AuthGuard], loadChildren: () => import('./admin/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: "client", component: ClientBaseComponent, canActivate: [ClientGuard], loadChildren: () => import('./client/client/client.module').then(m => m.ClientModule)
  },
  {
    path: "store", component: StoreBaseComponent, canActivate: [StoreGuard], loadChildren: () => import('./store/store.module').then(m => m.StoreModule)
  },
  {
    path: "distributor", component: DistributorBaseComponent, loadChildren: () => import('./distributor/distributor/distributor.module').then(m => m.DistributorModule)
  },
  { path: "expired", component: ClosedComponent },
  { path: "**", component: LogInComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }]
})
export class AppRoutingModule { }
