import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { ResolveTicketBtnComponent } from 'src/app/_core/cellrenders/resolve-ticket-btn/resolve-ticket-btn.component';
import { AlertService } from 'src/app/_core/services/alert.service';
import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';


@Component({
  selector: 'app-raise-new-ticket',
  templateUrl: './raise-new-ticket.component.html',
  styleUrls: ['./raise-new-ticket.component.scss']
})
export class RaiseNewTicketComponent implements OnInit {
  clientUsername: any;
  selectedFile!: File;
  gridApi: any;
  distributor: any;
  supportData: any;
  constructor(private storageService: StorageService, private clientService: ClientService, private alertService: AlertService) {
    clientService.getDomainDetails().subscribe(res => {
      this.supportData = res;
    })
  }


  // columnDefs: ColDef[] = [
  //   { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 100 },
  //   {
  //     headerName: 'Actions', field: '', cellRenderer: ResolveTicketBtnComponent

  //   },
  //   { headerName: 'Complainted On', field: 'createddate' },
  //   {
  //     headerName: 'Status', field: 'isactive', valueGetter: (e) => {
  //       if (e.data.isactive) {
  //         return "Opened"
  //       } else {
  //         return "closed"
  //       }
  //     },
  //     cellStyle: params => {
  //       if (params.data.isactive) {
  //         //mark police cells as red
  //         return { color: 'green' };
  //       } else {
  //         return { color: 'red' };
  //       }

  //     }
  //   },
  //   {
  //     headerName: 'resolve', field: 'isresolved', valueGetter: (e) => {
  //       if (e.data.isresolved) {
  //         return "Resolved"
  //       } else {
  //         return "Pending"
  //       }
  //     },
  //     cellStyle: params => {
  //       if (params.data.isresolved) {
  //         //mark police cells as red
  //         return { color: 'green' };
  //       } else {
  //         return { color: 'red' };
  //       }

  //     }
  //   },
  //   { headerName: 'Subject', field: 'subject' },
  //   { headerName: 'Description', cellClass: "cell-wrap-text", field: 'description', width: 600 },

  // ];
  user: any;
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 180,
      floatingFilter: true
    },
    pagination: true,
  }
  rowData: any = []
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    this.clientService.getComplaintDetailsAllByClientname(this.clientUsername, 1).subscribe((res: any) => {
      // console.log(res);
      this.rowData = res;
      this.gridApi.setRowData(res);
    });

  }
  ngOnInit(): void {
    this.clientUsername = this.storageService?.getClientUsername();
    // console.log(this.clientUsername);
    this.distributor = this.storageService.getDistributor();
    this.user = this.storageService.getUser();
    // console.log(this.distributor?.username);
    // this.clientService.getComplaintDetailsAllByClientname(this.clientUsername, 1).subscribe((res: any) => {
    //   // console.log(res);
    //   this.rowData = res;
    //   // this.gridApi.setRowData(res);
    // });
  }
  sentComplaint(sub: any, disc: any) {
    // console.log(sub.value, disc.value);
    // console.log(this.clientUsername);
    // console.log(this.selectedFile);

    console.log(this.user);


    if (sub.value && disc.value) {
      if (this.selectedFile) {
        this.clientService.createComplaint1(sub.value, disc.value, this.user.roles[0] === 'ROLE_DISTRIBUTOR' ? this.user.username : this.distributor?.username ? this.distributor?.username : this.clientUsername, this.selectedFile).subscribe((res: any) => {
          // console.log(res);
          this.alertService.showSuccess(res.message);
          // window.location.reload();
          let v: any = document.getElementById("subject");
          let v1: any = document.getElementById("message");
          v.value = null
          v1.value = null
          // this.ngOnInit();
        }, err => {
          this.alertService.showError(err?.error?.message);
        })
      } else {
        this.clientService.createComplaint(sub.value, disc.value, this.user.roles[0] === 'ROLE_DISTRIBUTOR' ? this.user.username : this.distributor?.username ? this.distributor?.username : this.clientUsername, this.selectedFile).subscribe((res: any) => {
          // console.log(res);
          this.alertService.showSuccess(res.message);
          // window.location.reload();
          let v: any = document.getElementById("subject");
          let v1: any = document.getElementById("message");
          v.value = null
          v1.value = null
          // this.ngOnInit();
        }, err => {
          this.alertService.showError(err?.error?.message);
        })
      }

    } else {
      this.alertService.showWarning("Please Fill All fields");
    }
  }

  onFileChange(event: any) {
    // console.log(event);
    let e: any = document.getElementById("fileuploadurl");
    if (event.target.files[0].size > 20971520) {
      e!.value = "The file size is more than 20 MB, please choose another file";
      e.style.color = 'red'
    } else {
      e!.value = event.target.files[0].name;
      // console.log(this.selectedFile);
      e.style.color = 'green'
      this.selectedFile = event.target.files[0];
      // console.log(this.selectedFile);
    }

  }
}
