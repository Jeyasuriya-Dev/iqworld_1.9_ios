import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const CLIENT_KEY = 'auth-client';
const DISTRIBUTOR_KEY = 'auth-distributor';
const USEROTP_KEY = 'auth-userotp';
const TEMP_USERNAME = 'tem-username';
const TEMP_LOGGER_USERNAME = 'tem-logger-username';
const TEMP_LOGGER_PASSWORD = 'tem-logger-password';
const PROVIDER_NAME = 'provider-name';
const NOTOKEN_DIRECT = 'notoken-direct';
const DEV_KEY = 'auth-dev'
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private router: Router) { }
  signOut(): void {
    window.sessionStorage.clear();
    this.router.navigate(['/login']);

    let myInterval = setInterval(() => {
      window.location.reload();
    }, 500);
    clearInterval(myInterval);
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  public saveDev(user: any): void {
    window.sessionStorage.removeItem(DEV_KEY);
    window.sessionStorage.setItem(DEV_KEY, JSON.stringify(user));
  }
  public getDev(): any {
    const user = window.sessionStorage.getItem(DEV_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }
  public saveClient(user: any): void {
    window.sessionStorage.removeItem(CLIENT_KEY);
    window.sessionStorage.setItem(CLIENT_KEY, JSON.stringify(user));
  }
  public saveDistributor(user: any): void {
    window.sessionStorage.removeItem(DISTRIBUTOR_KEY);
    window.sessionStorage.setItem(DISTRIBUTOR_KEY, JSON.stringify(user));
  }
  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }
  public getClient(): any {
    const user = window.sessionStorage.getItem(CLIENT_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }
  public getDistributor(): any {
    const user = window.sessionStorage.getItem(DISTRIBUTOR_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }
  public getUsername(): String {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user).username;
    }
    return '';
  }
  public getUserRole(): string {
    let user = this.getUser();
    if (!user || !user.roles) {
      return '';
    }
    const roleMapping: { [key: string]: string } = {
      'ROLE_ADMIN': 'ADMIN',
      'ROLE_DISTRIBUTOR': 'DISTRIBUTOR',
      'ROLE_CLIENT': 'CLIENT',
      'ROLE_DEVELOPER': 'DEVELOPER',
      'ROLE_CANUSER': 'CANUSER',
      'ROLE_STORE': 'STORE',
      'ROLE_SUSER': 'SUBUSER',
      'ROLE_EMPLOYEE': 'EMPLOYEE'
    };

    for (const role in roleMapping) {
      if (user.roles.includes(role)) {
        return roleMapping[role];
      }
    }
    return '';
  }


  public saveUserOTP(otp: any): void {
    window.sessionStorage.removeItem(USEROTP_KEY);
    window.sessionStorage.setItem(USEROTP_KEY, otp);
  }

  public verifyUserOTP(eteredOTP: any): boolean {
    return window.sessionStorage.getItem(USEROTP_KEY) === eteredOTP;
  }

  public getUserOTP(): String | null {
    return window.sessionStorage.getItem(USEROTP_KEY);
  }

  public removeUserOTP(): void {
    window.sessionStorage.removeItem(USEROTP_KEY);
  }

  public saveTempUsername(username: any): void {
    window.sessionStorage.removeItem(TEMP_USERNAME);
    window.sessionStorage.setItem(TEMP_USERNAME, username);
  }

  public getTempUsername(): String | null {
    return window.sessionStorage.getItem(TEMP_USERNAME);
  }

  public saveLoggerName(username: any): void {
    window.sessionStorage.removeItem(TEMP_LOGGER_USERNAME);
    window.sessionStorage.setItem(TEMP_LOGGER_USERNAME, username);
  }

  public getLoggerName(): String | null {
    return window.sessionStorage.getItem(TEMP_LOGGER_USERNAME);
  }

  public saveLoggerPass(username: any): void {
    window.sessionStorage.removeItem(TEMP_LOGGER_PASSWORD);
    window.sessionStorage.setItem(TEMP_LOGGER_PASSWORD, username);
  }

  public getLoggerPass(): String | null {
    return window.sessionStorage.getItem(TEMP_LOGGER_PASSWORD);
  }

  public saveProvidTo(username: any): void {
    window.sessionStorage.removeItem(PROVIDER_NAME);
    window.sessionStorage.setItem(PROVIDER_NAME, username);
  }

  public getProvidTo(): String | null {
    return window.sessionStorage.getItem(PROVIDER_NAME);
  }

  public saveNoToken(username: any): void {
    window.sessionStorage.removeItem(NOTOKEN_DIRECT);
    window.sessionStorage.setItem(NOTOKEN_DIRECT, username);
  }

  public getNoToken(): String | null {
    return window.sessionStorage.getItem(NOTOKEN_DIRECT);
  }
  public getClientUsername(): String | null {
    let clientname: any;
    let username = this.getUser();
    // console.log(username);

    if (username?.roles[0] == 'ROLE_CLIENT') {
      clientname = this.getUser();
    }
    else if (username?.roles[0] == 'ROLE_ADMIN') {
      clientname = sessionStorage.getItem('auth-client');
      clientname = JSON.parse(clientname);
      // console.log(json_object);
      // console.log("clientname");
    }
    else {
      clientname = sessionStorage.getItem('auth-client');
      clientname = JSON.parse(clientname);
    }
    return clientname?.username;
  }
  public getCurrentUser(): String | null {
    let clientname: any;
    let username = this.getUser();
    // console.log(username);

    if (username?.roles[0] == 'ROLE_CLIENT') {
      clientname = this.getUser();
    }
    else if (username?.roles[0] == 'ROLE_ADMIN') {
      clientname = sessionStorage.getItem('auth-client');
      clientname = JSON.parse(clientname);
      // console.log(json_object);
      // console.log("clientname");

    }
    else {
      clientname = sessionStorage.getItem('auth-client');
    }
    return clientname;
  }

}
