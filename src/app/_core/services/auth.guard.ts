import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  token: any;
  constructor(private storageService: StorageService, private router: Router,private auth:AuthService) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.token = sessionStorage.getItem('auth-token');
    let Role = this.storageService.getUserRole();
    if (!this.token || Role != 'ADMIN') {
      this.auth.signOut();
      return false;
    }
    return true;
  }


}
