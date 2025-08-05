import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import Swal from 'sweetalert2';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-costumer-activate-btn',
  templateUrl: './costumer-activate-btn.component.html',
  styleUrls: ['./costumer-activate-btn.component.scss']
})
export class CostumerActivateBtnComponent implements OnInit, ICellRendererAngularComp {
  isactive: any;
  customer: any;
  versionList: any = {};
  selectedVersion: any = 0;
  constructor(private clientService: ClientService) { }
  agInit(params: ICellRendererParams<any, any, any>): void {
    // console.log(params);
    this.customer = params.data;
    this.isactive = params.data.isactive;
    this.selectedVersion = params.data?.versionMaster?.id;
    this.clientService.getCustomerVersion().subscribe((res: any) => {
      // console.log(res);
      res.forEach((element: any) => {
        // console.log(element);
        if (!this.versionList.hasOwnProperty(element.id)) {
          this.versionList[element.id] = element.version;
        }
      })
    })
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
   
  }


  activate(data: any) {
    let btn;
    // console.log(data);

    if (data == "true") {
      btn = "activate"
    } else {
      btn = "deactivate"
    }
    if (data == "true") {
      Swal.fire({
        title: 'Are you sure?',
        text: "Do You Want " + btn + " Mr/Mrs " + this.customer.clientname + " !",
        icon: 'warning',
        input: 'select',
        inputOptions: this.versionList,
        inputPlaceholder: 'choose Customer version',
        inputValue: this.selectedVersion,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, ' + btn + '!'
      }).then((result) => {
        if (result.isConfirmed) {
          // console.log(result);

          this.clientService.activateClient(this.customer.username, data, result.value).subscribe((res: any) => {
            Swal.fire(
              'Activated!',
              res.message,
              'success'
            )
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }, err => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: err.message,
              // footer: '<a href="">Why do I have this issue?</a>'
            })
          })

        }
      })
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: "Do You Want " + btn + " Mr/Mrs " + this.customer.clientname + " !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, ' + btn + '!'
      }).then((result) => {
        if (result.isConfirmed) {
          // console.log(result);
          this.clientService.activateClient(this.customer.username, data, this.selectedVersion).subscribe((res: any) => {
         
            Swal.fire(
              'Activated!',
              res.message,
              'success'
            )
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }, err => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: err.message,
              // footer: '<a href="">Why do I have this issue?</a>'
            })
          })

        }
      })
    }

  }
}
