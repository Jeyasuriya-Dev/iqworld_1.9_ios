import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';
import { AlertService } from 'src/app/_core/services/alert.service';
import { ClientService } from 'src/app/_core/services/client.service';
import { DateService } from 'src/app/_core/services/date.service';
import { StorageService } from 'src/app/_core/services/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-store-schedule-info',
  templateUrl: './store-schedule-info.component.html',
  styleUrls: ['./store-schedule-info.component.scss']
})
export class StoreScheduleInfoComponent {
  rowData: any;
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 180,
      floatingFilter: true,
      editable: false,
    },
    pagination: true,
    paginationPageSize: 11,
    cacheBlockSize: 10,
  }
  gridApi: any;
  clientusername: any
  seletedplaylist_id: any = " ";
  userRole: any;
  store: any;
  constructor(private storageService: StorageService, private router: Router, private alertService: AlertService, private matDialog: MatDialog, private clientService: ClientService) {

  }
  ngOnInit(): void {
    let v = this.storageService.getUser();
    this.userRole = this.storageService.getUserRole();
    if (this.storageService.getUserRole() === 'STORE') {
      this.clientService.getStoreByUsername(v.username).subscribe((res: any) => {
        this.store = res
        this.clientService.getPlaylistScheduleHistoryByStoreId(this.store.id).subscribe(res => {
          this.rowData = res;
        })
      })
    } else {
      this.clientService.getSuserByUsername(v.username).subscribe((res: any) => {
        this.clientService.getPlaylistScheduleHistoryByStoreId(res.storeid).subscribe(res => {
          this.rowData = res;
        })
      });
    }

    if (this.storageService.getUserRole() === 'STORE') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 100 },
        {
          headerName: 'Playlist', field: 'filename',
        },
        {
          headerName: 'Actions', cellRenderer: (params: any) => {
            let currentUser = this.storageService.getUser();
            let rowData = params.data;
            if (this.storageService.getUserRole() === "STORE") {
              rowData.approvedby = currentUser.username;
            } else {
              rowData.approvedby = this.storageService.getClientUsername();
            }
            const editButton = document.createElement('button');
            editButton.innerHTML = "<i class='bx bxs-movie-play'></i>";
            editButton.style.backgroundColor = 'transparent';

            if (rowData.isapproved) {
              editButton.style.color = 'grey';
            }
            else {
              editButton.style.color = '#3085d6';
            }
            editButton.style.border = 'none';
            editButton.style.cursor = 'pointer';
            editButton.style.fontSize = "22px"
            editButton.title = "Check Content"
            editButton.addEventListener('click', () => {
              this.router.navigateByUrl("/store/mediaupload/" + rowData.playlistid);
            });

            const approveButton = document.createElement('button');
            approveButton.innerHTML = "<i class='bx bxs-checkbox-checked'></i>";
            approveButton.style.backgroundColor = 'transparent';
            if (rowData.isapproved) {
              approveButton.style.color = 'grey';
            }
            else {
              approveButton.style.color = '#50f27b';
            }
            approveButton.style.border = 'none';
            approveButton.style.cursor = 'pointer';
            approveButton.style.fontSize = "29px";
            approveButton.style.marginBottom = "-2px"
            approveButton.title = "Approve"
            approveButton.addEventListener('click', () => {
              Swal.fire({
                text: "Do you want to Approve the Schedule?",
                showCancelButton: true,
                confirmButtonText: "Yes, Approve",
                cancelButtonText: 'Close'
              }).then((result) => {
                if (result.isConfirmed) {
                  let loader = this.matDialog.open(LoaderComponent, {
                    panelClass: 'loader-upload'
                  })
                  rowData.isapproved = true;
                  this.clientService.approvePlaylistSchedule(rowData).subscribe((res: any) => {
                    this.alertService.showSuccess(res?.message);
                    loader.close();
                    this.ngOnInit();
                  }, err => {
                    this.alertService.showError(err?.error?.message);
                    loader.close();
                  })
                } else {
                  v.isapproved = false;
                }
              });
            });
            const rejectButton = document.createElement('button');
            rejectButton.innerHTML = "<i class='bx bxs-x-square'></i>";
            rejectButton.style.backgroundColor = 'transparent';
            if (rowData.isapproved) {
              rejectButton.style.color = 'grey';
            }
            else {
              rejectButton.style.color = '#f53b4a';
            }
            rejectButton.style.border = 'none';
            rejectButton.style.cursor = 'pointer';
            rejectButton.style.fontSize = "22px";
            rejectButton.title = "Reject"
            // rejectButton.style.marginBottom = "-2px";
            rejectButton.addEventListener('click', () => {
              Swal.fire({
                text: "Do you want to Reject the Schedule?",
                input: 'text',
                inputPlaceholder: 'Give me a good reason, why the schedule is rejected?',
                showCancelButton: true,
                cancelButtonText: 'Close',
                confirmButtonText: "Yes, Reject",
              }).then((result) => {
                if (result.isConfirmed) {
                  let loader = this.matDialog.open(LoaderComponent, {
                    panelClass: 'loader-upload'
                  })
                  rowData.isapproved = false;
                  console.log("Result: " + result.value);
                  rowData.comments = result.value;
                  this.clientService.approvePlaylistSchedule(rowData).subscribe((res: any) => {
                    this.alertService.showSuccess(res?.message);
                    loader.close();
                    this.ngOnInit();
                  }, err => {
                    this.alertService.showError(err?.error?.message);
                    loader.close();
                  })
                }
              });

            });

            const div = document.createElement('div');
            console.log(rowData);
            if (rowData.isapproved) {
              editButton.disabled = true;
              approveButton.disabled = true;
              rejectButton.disabled = true;

            }

            div.classList.add('d-flex');
            div.appendChild(editButton);
            div.appendChild(approveButton)
            div.appendChild(rejectButton)
            return div;
          }
        },
        {
          headerName: 'Store Name', field: 'sname',
        },
        {
          headerName: 'Category name', field: 'categoryname',
        },
        {
          headerName: 'Start At ', field: 'sch_start_time'
        },
        {
          headerName: 'End At', field: 'sch_end_time',
        },
        { headerName: 'Duration', field: "duration" }
        ,
        { headerName: 'Remarks', field: 'remark', },
        { headerName: 'Comments', field: 'comments', },

        { headerName: 'ActionBy', field: 'approvedby', },
      ];
    }
  }

  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 100 },
    {
      headerName: 'Playlist', field: 'filename',
    },
    {
      headerName: 'Store name', field: 'sname',
    }, {
      headerName: 'Category name', field: 'categoryname',
    },

    {
      headerName: 'Start At ', field: 'sch_start_time'
    },
    {
      headerName: 'End At', field: 'sch_end_time',
    },
    { headerName: 'Duration', field: "duration" }
    ,
    { headerName: 'Remarks', field: 'remark', },
    { headerName: 'Comments', field: 'comments', },
    { headerName: 'ActionBy', field: 'approvedby', }
  ];

  getScheduleInfo() {

  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('quickFilter') as HTMLInputElement).value
    );
  }
}
