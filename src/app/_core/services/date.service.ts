import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { clienturl } from 'src/app/api-base';
import { MediaUploadComponent } from 'src/app/client/_features/media-upload/media-upload.component';
const BASE_API = clienturl.BASE_URL();
const AUTH_API = clienturl.AUTH_URL();
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(private http: HttpClient) { }

  getDateInDayMonthYear(date: any) {
    let currentDay = String(date.getDate()).padStart(2, '0');
    let currentMonth = String(date.getMonth() + 1).padStart(2, "0");
    let currentYear = date.getFullYear();
    let currentDate = `${currentYear}/${currentMonth}/${currentDay}`;
    return currentDate;
  }

  getTodayToLastOneMonth() {
    var today = new Date();
    var dateLimit = new Date(new Date().setDate(today.getDate() - 30));
    let end = this.getDateInDayMonthYear(today);
    let start = this.getDateInDayMonthYear(dateLimit);
    return { end: end, start: start };

  }

  async getCurrentTime() {
    // http://worldtimeapi.org/api/timezone/Asia/Kolkata
    let response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
    let json = await response.json();
    return json;
  }
  getCurrentTimeByTimeApi(): Observable<any> {
    return this.http.get('https://timeapi.io/api/Time/current/zone?timeZone=Asia/Kolkata');

  }
  getCurrentTimeByaim() {
    // http://worldtimeapi.org/api/timezone/Asia/Kolkata
    // return this.http.get("https://tools.aimylogic.com/api/now?tz=Asia/Calcutta&format=yyyy-MM-dd%27T%27HH:mm:ss.SSSZ");
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
      })
    };
    let response = this.http.get("https://tools.aimylogic.com/api/now?tz=Asia/Calcutta&format=yyyy-MM-dd%27T%27HH:mm:ss.SSSZ", httpOptions);

    return response;
  }
 
}

// Get the current time for the Asia/Kolkata time zone

