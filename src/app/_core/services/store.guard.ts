import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StoreGuard implements CanActivate {
  constructor(private storageService: StorageService, private auth: AuthService) {

  }
  token: any
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.token = sessionStorage.getItem('auth-token');
    let Role = this.storageService.getUserRole();
    if (!this.token || (Role != 'STORE' && Role != 'SUBUSER')) {
      this.auth.signOut();
      return false;
    }
    return true;
  }

}
