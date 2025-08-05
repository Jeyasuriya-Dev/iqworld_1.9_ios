import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './_helper/auth.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CoreModule } from "@angular/flex-layout";
import { OtpVerificationComponent } from './_core/cellrenders/otp-verification/otp-verification.component';
import { ToastrModule } from 'ngx-toastr';
import { OnlynumbersDirective } from './_core/directves/onlynumbers.directive';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ClientModule } from './client/client/client.module';
import { AdminModule } from './admin/admin/admin.module';
import { PreloaderComponent } from './_core/loader/preloader/preloader.component';
import { ClosedComponent } from './closed/closed.component';
import { StoreModule } from './store/store.module';
import { ClientSidebarComponent } from './client/client-sidebar/client-sidebar.component';


@NgModule({
  declarations: [
    AppComponent,
    OtpVerificationComponent,
    OnlynumbersDirective,
    PreloaderComponent,
    ClosedComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    ClientModule,
    AdminModule,
    StoreModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgIdleKeepaliveModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 4000, // 10 seconds
      closeButton: true,
      progressBar: true,
    }),
  ],
  exports: [],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
