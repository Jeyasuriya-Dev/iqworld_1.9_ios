import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private toastrService: ToastrService) {
  }

  public showSuccess(message: any): void {
    // console.log(message);
    
    this.toastrService.success(message, 'Success!');
  }

  public showInfo(message: any): void {
    this.toastrService.info(message, 'Info!');
  }

  public showWarning(message: any): void {
    this.toastrService.warning(message, 'Warning!');
  }

  public showError(message: any): void {
    this.toastrService.error(message, 'Error!');
  }
}
