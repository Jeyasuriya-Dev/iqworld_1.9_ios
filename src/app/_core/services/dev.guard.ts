import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DevGuard implements CanActivate {
  constructor(private token: StorageService, private auth: AuthService) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let v = this.token.getDev();
    let t = sessionStorage.getItem('auth-dev');
    // console.log(v);
    if (!t || v.roles[0] != 'ROLE_DEVELOPER') {
      this.auth.signOut();
      return false;
    }
    return true;
  }

}
