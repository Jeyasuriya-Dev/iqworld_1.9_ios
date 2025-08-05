import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { JSONParser } from '@amcharts/amcharts4/core';

@Injectable({
  providedIn: 'root'
})
export class ClientGuard implements CanActivate {
  token: any;
  constructor(private storageService: StorageService, private router: Router, private auth: AuthService) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.token = sessionStorage.getItem('auth-token');
    let Role: any = sessionStorage.getItem('auth-client');
    let Role1: any = sessionStorage.getItem('auth-user');
    let r = JSON.parse(Role);
    let r1 = JSON.parse(Role1);
    if (!this.token || !(r?.roles[0] == 'ROLE_CLIENT' || r1?.roles[0] == 'ROLE_CLIENT')) {
      this.auth.signOut();
      return false;
    }
    return true;
  }

}
