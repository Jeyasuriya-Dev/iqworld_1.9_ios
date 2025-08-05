import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { Observable, map, startWith } from 'rxjs';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';
import { ClientService } from 'src/app/_core/services/client.service';
import { ExcelService } from 'src/app/_core/services/excel.service';
import { PdfService } from 'src/app/_core/services/pdf.service';
import { StorageService } from 'src/app/_core/services/storage.service';
import Swal from 'sweetalert2';
export class Client {
  constructor(public username: string, public id: string) { }
}
@Component({
  selector: 'app-complaints-all',
  templateUrl: './complaints-all.component.html',
  styleUrls: ['./complaints-all.component.scss']
})
export class ComplaintsAllComponent implements OnInit {
  length!: number;
  selectClient: any = "All";
  countryCtrl!: UntypedFormControl;
  isMoblie = false;
  filteredClients!: Observable<any[]>;
  gridApi: any;
  distibutor: any;
  clientList!: Client[] | any;
  constructor(private clientService: ClientService, private observer: BreakpointObserver, private matDialog: MatDialog, private renderer: Renderer2, private storageService: StorageService, private excelService: ExcelService, private pdfService: PdfService) {

  }

  ngOnInit(): void {
    if (this.storageService.getUserRole() == "DISTRIBUTOR") {
      this.distibutor = this.storageService.getUser();
    } else if (this.storageService.getDistributor()?.roles) {
      this.distibutor = this.storageService.getDistributor();
    }
    this.getAllClientList();
    this.countryCtrl = new UntypedFormControl();
    // this.distibutor = this.storageService.getDistributor();
    if (this.distibutor) {
      this.clientService.getComplaintListByDistributorOrAdmin(this.distibutor.username).subscribe((res: any) => {
        this.rowData = res;
        this.rowDatafilter = res;
        // console.log(res);
      })
    } else {
      // this.getAllDeviceList();
      this.clientService.getComplaintListByDistributorOrAdmin('admin').subscribe((res: any) => {
        this.rowData = res;
        this.rowDatafilter = res;
        // console.log(res);
      })
    }
    this.filteredClients = this.countryCtrl.valueChanges.pipe(
      startWith(''),
      map((client: any) =>
        client ? this.filterClients(client) : this.clientList
      )
    );
    if (!this.distibutor) {
      this.columnDefs = [
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
        { headerName: 'Customer/Distributor name', field: 'clientname1', minWidth: 230 },

        { headerName: 'Subject', field: 'subject' },
        { headerName: 'Actions', field: 'isresolved', cellRenderer: this.CellRendererBtn.bind(this) },
        { headerName: 'Issue Media', field: 'image_url', cellRenderer: this.CellRendererIssueMedia.bind(this) },
        { headerName: 'Resolved Media', field: 'resolved_url', cellRenderer: this.CellRendererResolvedMedia.bind(this) },
        { headerName: 'Remarks', field: 'comments' },
        { headerName: 'Description', field: 'description', width: 600, cellClass: "cell-wrap-text" }


      ];
    }
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
  // getAllClientList() {
  //   this.clientService.getAllClientList().subscribe((res: any) => {
  //     // console.log(res);
  //     this.clientList = res;
  //     this.filteredClients = this.countryCtrl.valueChanges.pipe(
  //       startWith(''),
  //       map((client: any) =>
  //         client ? this.filterClients(client) : Slice(this.clientList)
  //       )
  //     );
  //   })
  // }
  onChooseClient(clientname: any) {
    this.selectClient = clientname;
    this.clientService.getComplaintDetailsAllByClientname(clientname, 1).subscribe((res: any) => {
      // console.log(res);
      this.rowData = res;
      this.rowDatafilter = res;
    })
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
    { headerName: 'Actions', field: 'isresolved', cellRenderer: this.CellRendererBtn.bind(this) },
    { headerName: 'Issue Media', field: 'image_url', cellRenderer: this.CellRendererIssueMedia.bind(this) },
    { headerName: 'Resolved Media', field: 'resolved_url', cellRenderer: this.CellRendererResolvedMedia.bind(this) },
    { headerName: 'Remarks', field: 'comments' },
    { headerName: 'Description', field: 'description', width: 600, cellClass: "cell-wrap-text" }


  ];

  //   Swal.fire({
  //     title: 'Upload File',
  //     html: '<input type="file" id="fileInput">',
  //     confirmButtonText: 'Upload',
  //     preConfirm: function () {
  //         return new Promise(function (resolve) {
  //             const fileInput = document.getElementById('fileInput');
  //             const file = fileInput.files[0];

  //             if (file) {
  //                 resolve(file);
  //             } else {
  //                 Swal.showValidationMessage('Please choose a file');
  //             }
  //         });
  //     }
  // }).then(function (result) {
  //     if (result.isConfirmed) {
  //         const uploadedFile = result.value;
  //         // Handle the uploaded file as needed (e.g., send it to the server)
  //         console.log('File uploaded:', uploadedFile);
  //     }
  // });
  // });
  solveComplaint(e: any) {
    Swal.fire({
      title: 'Resolve Complaint',
      html:
        `<div class="file-upload btn btn-primary">
        <input  type="file" name="FileAttachment" id="FileAttachment" accept="video/*,image/*" class="upload" /> '<input type="text" id="swal-input1" class="swal2-input" placeholder="Type something...">
       </div>`
      ,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const textValue: any = document!.getElementById('swal-input1');
        const fileInput: any = document!.getElementById('FileAttachment');
        const file = fileInput!.files[0];
        if (file) {
          const maxSizeInBytes = 20 * 1024 * 1024; // 20 MB
          if (file.size <= maxSizeInBytes) {
            return { text: textValue?.value ? textValue?.value : 'null', file: file };
          } else if (textValue?.value) {
            return { text: textValue?.value ? textValue?.value : 'null', file: file };
            // reject('File size exceeds the limit (20 MB)');
          }
        }

        // return null;
        return { text: textValue?.value ? textValue?.value : 'null', file: file };
        // return { text: textValue?.value, file: file };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const data = result.value;
        // console.log(data);

        // console.log('Uploaded file:', data.file.name);
        // console.log('Entered text:', data.text);

        if (result.isConfirmed) {
          // console.log(result);

          const uploadedFile: any = result.value;
          // console.log(uploadedFile);

          let loader = this.matDialog.open(LoaderComponent, {
            panelClass: 'loader-upload'
          })
          if (data!.file && data!.text) {
            this.clientService.updateComplaint1(e.id, data!.file, data!.text ? data!.text : 'null').subscribe((res: any) => {
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
          } else {
            this.clientService.updateComplaint2(e.id, data!.text ? data!.text : 'null').subscribe((res: any) => {
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
        }
      }
    });
    // Swal.fire({
    //   title: "Are you sure?",
    //   text: "Are you Resolved!!",
    //   icon: "warning",
    //   html: `<div class="file-upload btn btn-primary">
    //   <input (change)="onFileChange($event)" type="file" name="FileAttachment" id="FileAttachment" accept="video/*,image/*" class="upload" />
    // </div>`,
    //   input: 'text',
    //   inputPlaceholder: 'Type something...',
    //   showCancelButton: true,
    //   confirmButtonColor: "#3085d6",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: "Yes, Resolved!",
    //   preConfirm: function () {
    //     return new Promise(function (resolve, reject) {
    //       const fileInput: any = document.getElementById('FileAttachment');
    //       const file = fileInput?.files[0];

    //       if (file) {
    //         const maxSizeInBytes = 20 * 1024 * 1024; // 20 MB
    //         if (file.size <= maxSizeInBytes) {
    //           resolve(file);
    //         } else {
    //           resolve(null);
    //           // reject('File size exceeds the limit (20 MB)');
    //         }
    //       } else {
    //         // reject('Please choose a file');
    //         resolve(null);
    //       }

    //     });
    //   }
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     console.log(result);

    //     const uploadedFile: any = result.value;
    //     console.log(uploadedFile);

    //     let loader = this.matDialog.open(LoaderComponent, {
    //       panelClass: 'loader-upload'
    //     })
    //     if (uploadedFile) {
    //       this.clientService.updateComplaint1(e.id, uploadedFile).subscribe((res: any) => {
    //         // console.log(res);
    //         loader.close();
    //         Swal.fire({
    //           title: "Success!",
    //           text: res.message,
    //           icon: "success"
    //         });
    //         this.ngOnInit();
    //       }, err => {
    //         loader.close();
    //         Swal.fire({
    //           title: "Failed!",
    //           text: err.error.message,
    //           icon: "error"
    //         });
    //       })
    //     } else {
    //       this.clientService.updateComplaint(e.id).subscribe((res: any) => {
    //         // console.log(res);
    //         loader.close();
    //         Swal.fire({
    //           title: "Success!",
    //           text: res.message,
    //           icon: "success"
    //         });
    //         this.ngOnInit();
    //       }, err => {
    //         loader.close();
    //         Swal.fire({
    //           title: "Failed!",
    //           text: err.error.message,
    //           icon: "error"
    //         });
    //       })
    //     }


    //   }
    // });
  }
  CellRendererIssueMedia(params: any) {
    // console.log(params.data?.image_url);
    // console.log(params.data?.image_url.includes('mp4'));
    const div = this.renderer.createElement('div');
    const img = this.renderer.createElement('img');
    const video = this.renderer.createElement('video');
    img.src = params.data?.image_url;
    this.renderer.setStyle(img, 'width', '40px');
    this.renderer.setStyle(img, 'height', '40px');
    this.renderer.setStyle(video, 'width', '40px');
    this.renderer.setStyle(video, 'height', '40px');
    video.src = params.data?.image_url;
    // video.controls = true;
    // video.autoplay = true;
    if (params.data?.image_url) {
      if (params.data?.image_url.includes('mp4')) {
        this.renderer.appendChild(div, video);
        this.renderer.listen(div, 'click', () => {
          // console.log(params?.data?.image_url);
          // console.log(video);
          let v = params?.data?.image_url;
          Swal.fire({
            html: "<video width='400' src=" + v + " controls='true' autoplay='true'></video>",
          });
        });

        // this.ngOnInit();
        return div;
      } else {
        this.renderer.appendChild(div, img);
        this.renderer.listen(div, 'click', () => {

          Swal.fire({

            imageUrl: params?.data?.image_url,
            // imageWidth: '100%',
            // imageHeight: '100%',
            imageAlt: "Custom image"
          });
        });

        // this.ngOnInit();
        return div;
      }
    } else {
      this.renderer.appendChild(div, img);
      this.renderer.listen(div, 'click', () => {

        Swal.fire({

          imageUrl: params?.data?.image_url,
          // imageWidth: '100%',
          // imageHeight: '100%',
          imageAlt: "Custom image"
        });
      });


      // this.ngOnInit();
      return div;


    }
  }
  viewMedia(url: any, type: any) {
    if (type === 'image') {
      Swal.fire({
        imageUrl: url,
        // imageWidth: '100%',
        // imageHeight: '100%',
        imageAlt: "Custom image"
      });
    } else if (type === 'video') {
      Swal.fire({
        html: "<video width='250' src=" + url + " controls='true' autoplay='true'></video>",
      });
    } else {
      Swal.fire('sorry')
    }
  }
  CellRendererResolvedMedia(params: any) {
    const div = this.renderer.createElement('div');
    const img = this.renderer.createElement('img');
    const video = this.renderer.createElement('video');
    img.src = params.data?.resolved_url;
    this.renderer.setStyle(img, 'width', '40px');
    this.renderer.setStyle(img, 'height', '40px');
    this.renderer.setStyle(video, 'width', '40px');
    this.renderer.setStyle(video, 'height', '40px');
    video.src = params.data?.resolved_url;

    if (params.data?.resolved_url) {
      if (params.data?.resolved_url.includes('mp4')) {
        this.renderer.appendChild(div, video);
        this.renderer.listen(div, 'click', () => {
          let v = params?.data?.resolved_url;
          Swal.fire({
            html: "<video width='400' src=" + v + " controls='true' autoplay='true'></video>",
          });
        });
        // this.ngOnInit();
        return div;
      } else {
        this.renderer.appendChild(div, img);
        this.renderer.listen(div, 'click', () => {
          Swal.fire({
            imageUrl: params?.data?.resolved_url,
            // imageWidth: '100%',
            // imageHeight: '100%',
            imageAlt: "Custom image"
          });
        });

        // this.ngOnInit();
        return div;
      }
    } else {
      this.renderer.appendChild(div, img);
      this.renderer.listen(div, 'click', () => {

        Swal.fire({

          imageUrl: params?.data?.resolved_url,
          // imageWidth: '100%',
          // imageHeight: '100%',
          imageAlt: "Custom image"
        });
      });


      // this.ngOnInit();
      return div;


    }

  }
  CellRendererBtn(params: any): HTMLElement {
    const button = this.renderer.createElement('button');
    // console.log(params.data);
    this.renderer.addClass(button, 'mat-raised-button');
    this.renderer.setStyle(button, 'background', 'transparent');
    this.renderer.setStyle(button, 'margin', '0px 15%');
    this.renderer.setStyle(button, 'width', '50%');
    this.renderer.setStyle(button, 'line-height', '1.8');
    this.renderer.setStyle(button, "padding", "0px 5px")
    // this.renderer.setStyle(button, 'font-weight', '600');
    if (params.data.isactive) {
      if (params.data?.type.type.includes('UPGRADE')) {
        this.renderer.setStyle(button, 'color', '#42aaf5');
        this.renderer.setStyle(button, 'border', '1px #42aaf5 solid');
        this.renderer.setProperty(button, 'innerText', 'Upgrade');
      } else {
        if (params.data.isresolved) {
          this.renderer.setStyle(button, 'color', 'green');
          this.renderer.setStyle(button, 'border', '1px green solid');
          this.renderer.setProperty(button, 'innerText', 'Resolved');
          this.renderer.setAttribute(button, "disabled", "true");
        } else {
          this.renderer.setStyle(button, 'color', '#f5902c');
          this.renderer.setStyle(button, 'border', '1px #f5902c solid');
          this.renderer.setProperty(button, 'innerText', 'Pending');
        }
      }

      this.renderer.listen(button, 'click', () => {
        this.solveComplaint(params.data);
      });
    } else {
      this.renderer.setStyle(button, 'color', 'green');
      this.renderer.setStyle(button, 'border', '1px green solid');
      this.renderer.setProperty(button, 'innerText', 'Resolved');
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
    paginationPageSize: 13,
    pagination: true,

  }
  rowData: any = [];
  rowDatafilter: any = [];
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    if (this.distibutor) {
      this.clientService.getComplaintListByDistributorOrAdmin(this.distibutor.username).subscribe((res: any) => {
        this.rowData = res;
        this.rowDatafilter = res;
        this.gridApi.setRowData(res);
        // console.log(res);
      })
    } else {
      this.clientService.getComplaintListByDistributorOrAdmin('admin').subscribe((data) => {
        this.gridApi.setRowData(data);
        this.rowData = data;
        this.rowDatafilter = data;
      });
    }

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
    this.ngOnInit();
  }
  fromdate: any;
  todate: any;
  fdate: any;
  tdate: any;

  exportAsExcelFile() {

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


