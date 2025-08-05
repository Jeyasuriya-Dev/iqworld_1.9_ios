import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { clienturl } from 'src/app/api-base';
import { MediaUploadComponent } from 'src/app/client/_features/media-upload/media-upload.component';

const AUTH_API = clienturl.AUTH_URL();
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }

  login(requestBody: any): Observable<any> {
    return this.http.post(
      AUTH_API + '/signin',
      requestBody,
      httpOptions
    );
  }

  register(payload: any): Observable<any> {
    return this.http.post(
      AUTH_API + '/signup',
      payload,
      httpOptions
    );
  }
  signOut(): void {
    window.sessionStorage.clear();
    // window.location.reload();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
