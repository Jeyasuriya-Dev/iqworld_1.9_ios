import { Component, OnInit, Renderer2 } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { Client } from '../deviceinfo/deviceinfo.component';
import { ClientService } from 'src/app/_core/services/client.service';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/_core/services/storage.service';
import { ExcelService } from 'src/app/_core/services/excel.service';
import { PdfService } from 'src/app/_core/services/pdf.service';
import { ColDef } from 'ag-grid-community';
import Swal from 'sweetalert2';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';
import { type } from 'os';
import { NewClientComponent } from '../new-client/new-client.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NewDistibutorComponent } from '../new-distibutor/new-distibutor.component';

@Component({
  selector: 'app-pending-complaints',
  templateUrl: './pending-complaints.component.html',
  styleUrls: ['./pending-complaints.component.scss']
})
export class PendingComplaintsComponent implements OnInit {
  length!: number;
  selectClient: any = "null";
  countryCtrl!: UntypedFormControl;
  pendingData: any;
  filteredClients!: Observable<any[]>;
  gridApi: any;
  distibutor: any;
  isMoblie = false;
  clientList!: Client[] | any;
  constructor(private clientService: ClientService, private observer: BreakpointObserver, private matDialog: MatDialog, private renderer: Renderer2, private storageService: StorageService, private excelService: ExcelService, private pdfService: PdfService) {

  }

  ngOnInit(): void {
    this.countryCtrl = new UntypedFormControl();
    if (this.storageService.getUserRole() == "DISTRIBUTOR") {
      this.distibutor = this.storageService.getUser();
    } else if (this.storageService.getDistributor()?.roles) {
      this.distibutor = this.storageService.getDistributor();
    }


    this.getActiveAndDeactiveRequest("2");
    this.getAllClientList();
    // if (this.distibutor) {
    //   this.clientService.getActivateListByDistributorOrAdmin(this.distibutor.username).subscribe((res: any) => {
    //     this.rowData = res.List;
    //     this.pendingData = res;
    //     console.log(res);
    //   })
    // } else {
    //   // this.getAllDeviceList();
    //   this.clientService.getActivateListByDistributorOrAdmin('admin').subscribe((res: any) => {
    //     this.rowData = res.List;
    //     this.pendingData = res;
    //     // console.log(res);
    //   })
    // }
    this.filteredClients = this.countryCtrl.valueChanges.pipe(
      startWith(''),
      map((client: any) =>
        client ? this.filterClients(client) : this.clientList
      )
    );
    this.observer.observe(['(max-width: 768px)']).subscribe((res) => {
      const sidebar = document.querySelector(".sidebar");
      if (res.matches) {
        this.isMoblie = true;

      } else {
        this.isMoblie = false;

      }
    });
  }
  distributor: any;
  getAllClientList() {
    // console.log(this.distibutor);
    if (this.distibutor) {
      this.clientService.getdistributorByUsername(this.distibutor.username).subscribe(res => {
        // console.log(res);
        this.distributor = res;
        this.clientService.getClientListByDistributorId(this.distributor?.id).subscribe((res: any) => {
          // console.log(res);
          this.clientList = res;
          this.filteredClients = this.countryCtrl.valueChanges.pipe(
            startWith(''),
            map((client: any) =>
              client ? this.filterClients(client) : Slice(this.clientList)
            )
          );
        })
      })


    } else {
      this.clientService.getAllClientList().subscribe((res: any) => {
        // console.log(res);
        this.clientList = res;
        this.filteredClients = this.countryCtrl.valueChanges.pipe(
          startWith(''),
          map((client: any) =>
            client ? this.filterClients(client) : Slice(this.clientList)
          )
        );
      })
    }

  }
  onChooseClient(clientname: any) {
    this.selectClient = clientname;
    // this.clientService.getComplaintDetailsAllByClientname(clientname, "2").subscribe((res: any) => {
    //   // console.log(res);
    //   this.rowData = res;
    // })
    this.getActiveAndDeactiveRequest("2");
  }

  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 100 },
    { headerName: 'Requested On', field: 'createddate' },

    {
      headerName: 'Status', field: 'isactive', valueGetter: (e) => {
        if (e.data.isactive) {
          return "Opened"
        } else {
          return "closed"
        }
      },
      cellStyle: params => {
        if (params.data.isactive) {
          //mark police cells as red
          return { color: 'green' };
        } else {
          return { color: 'red' };
        }

      }
    },
    { headerName: 'Customer name', field: 'clientname1' },

    { headerName: 'Subject', field: 'subject' },
    { headerName: 'Actions', field: 'isactive', cellRenderer: this.CellRendererBtn.bind(this) },
    {
      headerName: 'Remarks', field: 'comments', width: 300, cellClass: "cell-wrap-text", cellStyle: params => {

        return { color: 'red' };
      }
    },
    { headerName: 'Description', field: 'description', width: 600, cellClass: "cell-wrap-text" }


  ];

  getActiveAndDeactiveRequest(type: any) {
    this.searchvalue = '';
    if (this.distibutor) {
      this.clientService.getActiveAndDeactiveRequest(this.selectClient, this.distibutor.username, type).subscribe((res: any) => {
        this.rowData = res.List;
        this.rowDatafilter = res.List;
        this.pendingData = res
      })
    } else {
      this.clientService.getActiveAndDeactiveRequest(this.selectClient, 'admin', type).subscribe((res: any) => {
        this.rowData = res.List;
        this.rowDatafilter = res.List;
        this.pendingData = res
      })
    }


  }
  searchvalue = ''
  solveComplaint(e: any) {
    // console.log(e?.type?.type == "OFFLINE_PLAN_ACTIVATION");
    if (e?.type?.type == 'CLIENT_CREATION & DEVICE_CREATION') {
      this.clientService.getComplaintDetailsById(e.id).subscribe((res: any) => {
        console.log(res);
        res.complaintid = e.id;
        this.matDialog.open(NewClientComponent, {
          height: '95vh',
          minWidth: '350px',
          data: res
        })
      }, err => {
        Swal.fire({
          title: "Failed!",
          text: err?.error?.message,
          icon: "error"
        });
      })
    }
    else if (e?.type?.type == 'DISTRIBUTOR_CREATION') {
      this.clientService.getDistributorForByComplaintid(e.id).subscribe((res: any) => {
        console.log(res);
        res.complaintid = e.id;
        this.matDialog.open(NewDistibutorComponent, {
          height: '95vh',
          minWidth: '350px',
          data: res
        })
      }, err => {
        Swal.fire({
          title: "Failed!",
          text: err?.error?.message,
          icon: "error"
        });
      })

    }
    else {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to activate/upgrade ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, do it!"
      }).then((result) => {
        if (result.isConfirmed) {

          let loader = this.matDialog.open(LoaderComponent, {
            panelClass: 'loader-upload'
          })
          this.clientService.updateComplaint(e.id).subscribe((res: any) => {
            // console.log(res);
            loader.close();
            Swal.fire({
              title: "Success!",
              text: res.message,
              icon: "success"
            });
            this.ngOnInit();
          }, err => {
            loader.close();
            Swal.fire({
              title: "Failed!",
              text: err.error.message,
              icon: "error"
            });
          })

        }
      });
    }

  }
  CellRendererBtn(params: any): HTMLElement {
    const button = this.renderer.createElement('button');
    this.renderer.addClass(button, 'mat-raised-button');
    this.renderer.setStyle(button, 'background', 'transparent');
    this.renderer.setStyle(button, 'margin', '0px 15%');
    this.renderer.setStyle(button, 'width', '50%');
    this.renderer.setStyle(button, 'line-height', '1.8');
    this.renderer.setStyle(button, "padding", "0px 5px")
    // this.renderer.setStyle(button, 'font-weight', '600');
    if (params.data.isactive) {
      if (params.data?.type?.type.includes('UPGRADE') && params.data?.type?.type != "CLIENT_UPGRADE & DEVICE_CREATION") {
        this.renderer.setStyle(button, 'color', '#42aaf5');
        this.renderer.setStyle(button, 'border', '1px #42aaf5 solid');
        this.renderer.setProperty(button, 'innerText', 'Upgrade');
      } else {
        this.renderer.setStyle(button, 'color', '#f5902c');
        this.renderer.setStyle(button, 'border', '1px #f5902c solid');
        this.renderer.setProperty(button, 'innerText', 'Pending');
      }
      this.renderer.listen(button, 'click', () => {
        this.solveComplaint(params.data);

      });
    } else {
      this.renderer.setStyle(button, 'color', 'green');
      this.renderer.setStyle(button, 'border', '1px green solid');
      this.renderer.setProperty(button, 'innerText', 'Approved');
      this.renderer.setAttribute(button, "disabled", "true");
    }



    const div = this.renderer.createElement('div');
    this.renderer.appendChild(div, button);

    return div;
  }
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true
    },
    paginationPageSize: 12,
    pagination: true,

  }
  rowData: any = [];
  rowDatafilter: any = [];
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    // if (this.distibutor) {
    //   this.clientService.getActivateListByDistributorOrAdmin(this.distibutor.username).subscribe((res: any) => {
    //     this.rowData = res.List;
    //     this.gridApi.setRowData(res.List);
    //     // console.log(res);
    //   })
    // } else {
    //   this.clientService.getActivateListByDistributorOrAdmin('admin').subscribe((res: any) => {
    //     this.rowData = res.List;
    //     // console.log(res);
    //     this.gridApi.setRowData(res.List);
    //   })
    //   // this.clientService.getComplaintList().subscribe((data) => {
    //   //   this.gridApi.setRowData(data);
    //   // });
    // }

  }
  getAllDeviceList() {
    this.clientService.getComplaintList().subscribe((res: any) => {
      // console.log(res);
      this.rowData = res;
      this.rowDatafilter = res;
    })
    // this.userService.getDeviceByAdroidId().subscribe((res: any) => {
    //   console.log(res);
    //   // this.rowData = res;
    // })
  }
  onQuickFilterChanged() {
    // console.log(this.gridApi);

    this.gridApi.setQuickFilter(
      (document.getElementById('quickFilter') as HTMLInputElement).value
    );
  }
  filterClients(username: string) {
    let arr = this.clientList.filter(
      (client: any) => client.username.toLowerCase().indexOf(username.toLowerCase()) === 0
    );

    return arr.length ? arr : [{ username: 'No Item found', code: 'null' }];
  }
  clearCountryCtrl() {
    this.countryCtrl.setValue("");
    // this.getAllDeviceList();
    // this.ngOnInit();
    this.selectClient = "null"
    this.getActiveAndDeactiveRequest("2");
  }
  fromdate: any;
  todate: any;
  fdate: any;
  tdate: any;

  exportAsExcelFile() {
    // console.log(this.rowData);
    const title = 'Pending Approval Information';
    let data: any = []
    for (let obj of this.rowData) {
      // console.log(obj);
      let g = {
        'Requested on': obj?.createddate,
        "Status": obj?.isactive ? 'Open' : 'Closed',
        'Customer name': obj?.clientname1,
        'Subject': obj?.subject,
        "Approval": obj?.isactive ? obj?.type?.type.includes('UPGRADE') && obj?.type?.type != "CLIENT_UPGRADE & DEVICE_CREATION" ? 'UPGRADE' : "Pending" : 'Approved',
        'Description': obj?.description,

      }
      data.push(g)
    }
    let cellSize = { a: "25", b: "15", c: "25", d: "20", e: "15", f: "100" }
    let titleMerge = "'B1':'E4'";
    let imgMerge = "'A1':'A4'";
    let dateMerge = "'F1':'F4'";
    let reportData = {
      title: title,
      data: data,
      headers: Object.keys(data[0]),
      cellSize: cellSize,
      titleMerge: titleMerge,
      imgMerge: imgMerge,
      dateMerge: dateMerge
    };

    this.excelService.exportExcel(reportData);
  }
  exportPdf() {

  }

  filterRowData(searchText: any) {
    this.rowData = this.rowDatafilter.filter((obj: any) => {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (typeof value === 'string' && value.toLowerCase().includes(searchText.toLowerCase())) {
            return true;
          }
          if (typeof value === 'object' && value !== null) {
            if (this.objectIncludesValue(value, searchText)) {
              return true;
            }
          }
          if (key === 'isactive') {
            let v1 = "pending";
            let v2 = "approved";
            if (v1.includes(searchText.toLowerCase())) {
              if (!value) {
                return true;
              } else {
                return false;
              }
            } else if (v2.includes(searchText.toLowerCase())) {
              if (value) {
                return true;
              } else {
                return false;
              }
            }
          }
          if (key === 'height_width') {
            let v1 = "horizontal";
            let v2 = "vertical";
            if (v1.includes(searchText.toLowerCase())) {
              if (value === '16:9') {
                return true;
              } else {
                return false;
              }
            } else if (v2.includes(searchText.toLowerCase())) {
              if (value === '9:16') {
                return true;
              } else {
                return false;
              }
            }
          }
          if (key === 'isonline') {
            let v1 = "online";
            let v2 = "offline";
            if (v1.includes(searchText.toLowerCase())) {
              if (value) {
                return true;
              } else {
                return false;
              }
            } else if (v2.includes(searchText.toLowerCase())) {
              if (!value) {
                return true;
              } else {
                return false;
              }
            }
          }
        }
      }
      return false;
    }
    )
  }

  objectIncludesValue(obj: any, searchText: any) {
    return Object.keys(obj).some(key => {
      const value = obj[key];
      if (typeof value === 'string' && value.toLowerCase().includes(searchText.toLowerCase())) {
        return true;
      }
      return false;
    });
  }


}

function Slice(list: any) {
  // console.log(list);onQuickFilterChanged

  let clientList: [] = list.slice()
  return clientList;
}


