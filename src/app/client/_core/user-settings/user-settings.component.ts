import { toBoolean } from '@amcharts/amcharts4/.internal/core/utils/Type';
import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';
import { AlertService } from 'src/app/_core/services/alert.service';
import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  client: any;
  isautoupgrade: any = true;
  Ota: any;
  dt: any;
  is_ota_active: any = true;
  selected: any;
  isHorizontalChecked: any = false;
  isVerticalChecked: any = true;
  endDate: any = '23:59:59';
  currentDate: any;
  startDate: any = '00:00:00';
  currentTime: any = new Date();
  isScheduleSettings = true;
  masterForm!: FormGroup;
  masterFormSaved = true;
  masterSettings: any;
  constructor(private router: Router, private fb: FormBuilder, private clientService: ClientService, private tokenStorage: StorageService, private matDialog: MatDialog, private alertService: AlertService) {
    // this.currentDate = new Date().toISOString().slice(0, 16);

    console.log(router.url.split('/')[3]);
    if (router.url.split('/')[3] === 'schedule-ota') {
      this.isScheduleSettings = true;
    } else {
      this.isScheduleSettings = false;
    }

  }
  ngOnInit(): void {
    let myVar = setInterval(async () => {
      // console.log(await this.dateService.getCurrentTime());
      // let json: any = await this.dateService.getCurrentTime();
      // console.log(json);
      this.currentTime = sessionStorage.getItem('currentTime');
      // this.currentTime = json.datetime;
      // console.log(currentTime);/
      this.currentDate = new Date(this.currentTime).toISOString().slice(0, 19);
    }, 1000);
    let currentuser: any = this.tokenStorage.getClientUsername();
    // console.log(currentuser);
    this.getClientByUsername(currentuser);
    var today = new Date();
    $('input[name="daterange"]').daterangepicker({
      opens: 'left',
      timePicker: true,
      timePicker24Hour: true,
      timePickerIncrement: 1,
      timePickerSeconds: true,
      startDate: this.startDate,
      locale: {
        format: 'HH:mm:ss'
      }
    }, (start: any, end: any, label: any) => {
      // console.log("startDate" + start.format('HH:mm:ss') + ' endDate ' + end.format('HH:mm:ss'));
      this.startDate = start.format('HH:mm:ss');
      this.endDate = end.format('HH:mm:ss');
    }).on('show.daterangepicker', (ev: any, picker: any) => {
      picker.container.find(".calendar-table").hide();
    });
    let date = new Date();
    this.dt = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    this.masterForm = this.fb.group({
      isslot: [false, Validators.required],
      fileduration: ['', Validators.required],
      slotcount: [{ value: '', disabled: true }, Validators.required],
      cyclecount: ['', Validators.required],
      store_storage: ['', Validators.required],
      totalduration: ['', Validators.required],
      id: ['', Validators.required],
      clientid: ['', Validators.required]
    })

  }

  getClientByUsername(data: any) {
    this.clientService.getClientByUsername(data).subscribe((res: any) => {
      // console.log(res);
      this.client = res;
      this.getOtaForClient(res.id);
      this.clientService.getMasterSettings(res.id).subscribe((data: any) => {
        this.masterSettings = data;
        console.log(data);
        this.masterForm.patchValue({
          isslot: true,
          fileduration: data.fileduration,
          slotcount: data.slotcount,
          cyclecount: data.cyclecount,
          store_storage: data.store_storage,
          totalduration: data.totalduration,
          id: data.id,
          clientid: res.id
        })
        this.disableMasterForm();

      })
    })
  }
  ddate: any
  getOtaForClient(id: any) {
    this.clientService.getOtaForClient(id).subscribe((res: any) => {
      // console.log(res);
      this.Ota = res;
      // this.Ota.list[0].isvertical = true;
      // this.Ota.list[1].isvertical = false;
      // this.client = res;
      this.isVerticalChecked = res?.IsSelectVertical;
      this.isHorizontalChecked = res?.IsSelectHorizondal;
      this.endDate = res.ota_sch_endtime;
      this.startDate = res.ota_sch_starttime;
      this.isautoupgrade = res?.isautoupgrade;
      this.is_ota_active = res?.is_ota_active;
      this.ddate = this.startDate + '-' + this.endDate
      this.isScheduleDone();
      this.scheduleFormater();
    })
  }

  isScheduled: any = false;
  isScheduleDone() {
    let date = new Date();
    var dt = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    var a = this.startDate.split(':');
    var sch_start_time = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    var b = this.endDate.split(':');
    var sch_end_time = (+b[0]) * 60 * 60 + (+b[1]) * 60 + (+b[2]);
    var c = dt.split(':');
    var current = (+c[0]) * 60 * 60 + (+c[1]) * 60 + (+c[2]);
    if (sch_start_time < current && current < sch_end_time) {
      this.isScheduled = true;
      return true;
    }
    else {
      this.isScheduled = false;
      return false;
    }
  }

  scheduleFormater(): any {
    let date = new Date(this.currentTime);
    // let current = new Date().getTime();
    // var sch_start_time = new Date(this.startDate).getTime();
    // var sch_end_time = new Date(this.endDate).getTime();
    var dt = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    var a = this.startDate.split(':');
    var sch_start_time = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    var b = this.endDate.split(':');
    var sch_end_time = (+b[0]) * 60 * 60 + (+b[1]) * 60 + (+b[2]);
    var c = dt.split(':');
    var current = (+c[0]) * 60 * 60 + (+c[1]) * 60 + (+c[2]);
    // console.log(sch_start_time > current);
    // console.log(sch_start_time < current && current < sch_end_time);
    // console.log(current > sch_end_time);
    if (sch_start_time != 0 && sch_end_time != 0) {
      if (sch_start_time > current) {
        return 'Scheduled';
      } else if (sch_start_time < current && current < sch_end_time) {
        return 'Onprogress';
      } else if (current > sch_end_time) {
        return 'Finished';
      }
      else {
        return "Not-scheduled";
      }
    }

    else {
      return "Not-scheduled";
    }
  }
  dateTimePicker() {
    // console.log(this.startDate + "  " + this.endDate);
    // console.log(this.ddate);
    let date = new Date();
    // let current = new Date().getTime();
    // var sch_start_time = new Date(this.startDate).getTime();
    // var sch_end_time = new Date(this.endDate).getTime();
    var dt = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    let otalist: any = [];
    if (this.isHorizontalChecked && this.isVerticalChecked) {
      this.Ota.list.forEach((element: any) => {
        // console.log(element);
        otalist.push(element?.id)
      });

    } else if (this.isHorizontalChecked || this.isVerticalChecked) {
      if (this.isVerticalChecked) {
        this.Ota.list.forEach((element: any) => {
          // console.log(element);
          if (element?.isvertical) {
            otalist.push(element?.id)

          }
        });

      } else {
        this.Ota.list.forEach((element: any) => {
          // console.log(element);
          if (!element?.isvertical) {
            otalist.push(element?.id)

          }
        });

      }

    }

    if (otalist[0]) {
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          let loader = this.matDialog.open(LoaderComponent, {
            panelClass: 'loader-upload'
          });
          this.clientService.setScheduleForOta(this.client?.id, this.startDate == '00:00:00' ? dt : this.startDate, this.endDate == '00:00:00' ? '23:59:59' : this.endDate, otalist).subscribe((res: any) => {
            // console.log(res);
            loader.close();
            Swal.fire('Saved!', res.message, 'success');
            window.location.reload();
            this.ngOnInit();
          }, (err) => {
            let dynamicHTML;
            if (err.error.message.length == 58) {
              dynamicHTML = "<h4>Please choose Valid Date and Time </h4>"
            } else {
              dynamicHTML = "<h4>" + err.error.message + "</h4>"
            }
            loader.close();
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              html: dynamicHTML,
              text: "",
            })

          })
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })
    } else {
      this.alertService.showInfo('Kindy select Orientation for schedule Ota Upgrade')
    }
  }

  stopOTASchedule(type: any, isautoupgrade: any, is_ota_active: any) {
    if (type == 'stop') {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Stop it!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.clientService.disableOtaSchedule(this.client?.id).subscribe((res: any) => {
            Swal.fire({
              title: "Stoped!",
              text: res?.message,
              icon: "success"
            });
            // window.location.reload();
            this.ngOnInit();
          }, err => {
            Swal.fire({
              title: "Sorry!",
              text: err?.error?.message,
              icon: "error"
            });
          })

        }
      });
    }
    else {
      this.clientService.stopOtaScheduleCustomer(this.client?.id, isautoupgrade, is_ota_active).subscribe((res: any) => {
        // Swal.fire({
        //   title: "changed!",
        //   text: res?.message,
        //   icon: "success"
        // });
        this.alertService.showSuccess('Auto update modified Successfully')
        // window.location.reload();
        this.ngOnInit();
      }, err => {
        // Swal.fire({
        //   title: "Sorry!",
        //   text: err?.error?.message,
        //   icon: "error"
        // });
        this.alertService.showError(err?.error?.message)
      })
    }

  }

  saveMasterForm() {
    console.log(this.masterForm.value);
    this.masterForm.get('slotcount')?.enable()
    if (this.masterForm.invalid) {
      return
    }
    this.clientService.editMasterSettings(this.masterForm.value).subscribe((res: any) => {
      this.alertService.showSuccess(res.message);
      this.disableMasterForm();
      this.masterFormSaved = !this.masterFormSaved;
      this.ngOnInit();
    }, err => {
      this.masterForm.get('slotcount')?.disable();
      this.alertService.showError(err?.error?.message);
    })

  }
  enableMasterForm() {
    this.masterForm.enable();
    this.masterForm.get('slotcount')?.disable();
  }
  disableMasterForm() {
    this.masterForm.disable();
  }


}
