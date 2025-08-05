import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { DateTimeRenderComponent } from 'src/app/_core/cellrenders/date-time-render/date-time-render.component';
import { ClientService } from 'src/app/_core/services/client.service';
import { ExcelService } from 'src/app/_core/services/excel.service';
import { PdfService } from 'src/app/_core/services/pdf.service';
import { StorageService } from 'src/app/_core/services/storage.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  gridApi: any;
  clientUsername: any;
  dailogRef: any;

  fromdate: any;
  // todate: any;
  curdate: any;
  // today = new Date();
  currentDate!: string;
  type = 1;
  dateFormControl: any;
  // rowData: any;
  // dateRange: any;

  todate: any;
  image_path: any;
  selectedNodeId: any = 0;
  currentTime: any = new Date();
  search() {

  }
  changeDatePicker(data: any) {

  }
  selectNode(data: any) { }
  selecteddate: any
  nodeList: any = [];
  nodeFilteredList: any = [];
  url = '../assets/images/logo.png';
  dateRange = this.fb.group({
    fromdate: new UntypedFormControl(),
    todate: new UntypedFormControl()
  });
  isMoblie = false;
  constructor(private pdfService: PdfService, private observer: BreakpointObserver, private excelService: ExcelService, private fb: UntypedFormBuilder, private router: Router, private clientService: ClientService, private storage: StorageService, private matDailog: MatDialog) {
    // this.currentDate =   new Date().toISOString().slice(0, 16);

  }
  // ngDoCheck(): void {
  //   this.clientService.checkPlaylist().subscribe(res => {
  //     console.log(res);
  //   })
  // }


  isScheduleStyle(params: any): any {
    let current = new Date().getTime();
    var sch_start_time = new Date(params.data.sch_start_time).getTime();
    var sch_end_time = new Date(params.data.sch_end_time).getTime();

    if (sch_start_time > current) {
      return { color: 'Blue', "text-shadow": "0px 1px 0px ", "text-transform": "capitalize", };
    } else if (sch_start_time < current && current < sch_end_time) {
      return { color: '#21f900', "text-shadow": "0px 1px 0px ", "text-transform": "capitalize", };
    }
    else if (current > sch_end_time) {
      return { color: 'red', "text-shadow": "0px 1px 0px ", "text-transform": "capitalize", };
    }
    if (!sch_end_time && !sch_end_time) {
      return { color: '#cc34eb', "text-shadow": "0px 1px 0px ", "text-transform": "capitalize", };
    }

  }
  ispinned(s: any) {
    if (s) {
      return null;
    } else {
      return "left";
    }
  }
  currentUser: any;
  horizontalplaylist!: UntypedFormGroup
  ngOnInit(): void {
    let myVar = setInterval(async () => {
      // console.log(await this.dateService.getCurrentTime());
      // let json: any = await this.dateService.getCurrentTime();
      // // console.log(json);
      // this.currentTime = json.datetime;
      // console.log(currentTime);/
      this.currentTime = sessionStorage.getItem('currentTime');
      this.currentDate = new Date(this.currentTime).toISOString().slice(0, 19);
      // console.log(this.currentDate);

    }, 1000);

    this.clientUsername = this.storage.getClientUsername();
    this.currentUser = this.storage.getUser();
    this.getAllPlaylistByClientUsername(this.clientUsername);
    this.observer.observe(['(max-width: 768px)']).subscribe((res) => {

      if (res.matches) {
        this.isMoblie = true;

      } else {
        this.isMoblie = false;

      }
    })

    this.columnDefs = [
      { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', pinned: this.ispinned(this.isMoblie), cellClass: 'locked-col', width: 100, cellStyle: this.isScheduleStyle },
      {
        headerName: 'Playlist Name', field: 'filename', pinned: this.ispinned(this.isMoblie), cellStyle: this.isScheduleStyle, valueFormatter: (params: any) => {
          // console.log(params.data.filename);
          return params.data.filename + " [" + params.data.file_count + "]";
        }
      },



      { headerName: 'Start Date', field: 'sch_start_time', cellStyle: this.isScheduleStyle },
      { headerName: 'End Date', field: 'sch_end_time', cellStyle: this.isScheduleStyle },
      { headerName: 'Duration', field: 'duration', cellStyle: this.isScheduleStyle },

      {
        headerName: 'City', field: 'city', cellStyle: this.isScheduleStyle
      },
      {
        headerName: 'State', field: 'state', cellStyle: this.isScheduleStyle, width: 300
      },
      {
        headerName: 'Location', field: 'location', cellStyle: this.isScheduleStyle,
      },
      // {
      //   headerName: 'Allowed States', autoHeight: true, width: 200, field: 'state_list', onCellClicked: (params: any) => {
      //     this.dailogRef.close();
      //   }, cellStyle: this.isScheduleStyle, cellRenderer: DateTimeRenderComponent

      // },
      { headerName: 'Creationdate', field: 'creationdate', cellStyle: this.isScheduleStyle },
      { headerName: 'Updatedate', field: 'updationdate', cellStyle: this.isScheduleStyle },
      { headerName: 'Creationby', field: 'uploadedby', cellStyle: this.isScheduleStyle },
      // {
      //   headerName: 'Actions', autoHeight: true, onCellClicked: (params: any) => {
      //     this.dailogRef.close();
      //   }, field: 'uploadedby', cellStyle: this.isScheduleStyle, cellRenderer: ScheduleBtnComponent
      // },

    ];
  }
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', pinned: 'left', cellClass: 'locked-col', width: 100, cellStyle: this.isScheduleStyle },
    {
      headerName: 'Playlist Name', field: 'filename', pinned: 'left', cellStyle: this.isScheduleStyle, valueFormatter: (params: any) => {
        // console.log(params.data.filename);
        return params.data.filename + " [" + params.data.file_count + "]";
      }
    },



    { headerName: 'Start Date', field: 'sch_start_time', cellStyle: this.isScheduleStyle },
    { headerName: 'End Date', field: 'sch_end_time', cellStyle: this.isScheduleStyle },
    { headerName: 'Duration', field: 'duration', cellStyle: this.isScheduleStyle },

    {
      headerName: 'City', field: 'city', cellStyle: this.isScheduleStyle
    },
    {
      headerName: 'State', field: 'state', cellStyle: this.isScheduleStyle, width: 300
    },
    {
      headerName: 'Location', field: 'location', cellStyle: this.isScheduleStyle,
    },
    // {
    //   headerName: 'Allowed States', autoHeight: true, width: 200, field: 'state_list', onCellClicked: (params: any) => {
    //     this.dailogRef.close();
    //   }, cellStyle: this.isScheduleStyle, cellRenderer: DateTimeRenderComponent

    // },
    { headerName: 'Creationdate', field: 'creationdate', cellStyle: this.isScheduleStyle },
    { headerName: 'Updatedate', field: 'updationdate', cellStyle: this.isScheduleStyle },
    { headerName: 'Creationby', field: 'uploadedby', cellStyle: this.isScheduleStyle },
    // {
    //   headerName: 'Actions', autoHeight: true, onCellClicked: (params: any) => {
    //     this.dailogRef.close();
    //   }, field: 'uploadedby', cellStyle: this.isScheduleStyle, cellRenderer: ScheduleBtnComponent
    // },

  ];


  onClickedStartTime() {

  }
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 180,
      floatingFilter: true,
      editable: false,
    },
    // pagination: true,
    // paginationPageSize: 11,
    // cacheBlockSize: 10,
  }
  getAllPlaylistByClientUsername(clientname: any) {
    this.clientService.getAllPlaylistByClientUsername(clientname).subscribe((res: any) => {
      // console.log(res);
      this.rowData = res;
    })
  }

  rowData: any = []
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('quickFilter') as HTMLInputElement).value
    );
  }
  endDate: any
  startDate: any
  choosedPlaylist: any
  playlistMedia: any
  onCellClicked(event: any, template: any) {
    // Handle the cell click event here
    // console.log('Cell Clicked!', event);
    this.startDate = event.data.sch_start_time;
    this.endDate = event.data.sch_end_time;

    this.choosedPlaylist = event.data.id
    this.getAllMediaInfoByPlaylistId(event.data.id);

    this.dailogRef = this.matDailog.open(template, {
      minWidth: "360px"
    })
  }
  getAllMediaInfoByPlaylistId(playListId: any): any {
    this.clientService.getAllMediaInfoByPlaylistId(playListId).subscribe((res: any) => {
      // console.log(res);
      this.playlistMedia = res;
    });
    return this.playlistMedia;
  }
  mediaUpload(playlist: any) {
    // console.log(playlist);
    this.router.navigate(["/client/upload-media/", playlist]).then(() => {

      this.dailogRef.close();
    }
    );
  }
  closeDialog() {
    this.dailogRef.close();
  }
  dateTimePicker() {
    // console.log(this.endDate);
    // console.log(this.startDate);
    // console.log(this.choosedPlaylist);
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.clientService.setScheduleForPlaylist(this.choosedPlaylist, this.startDate, this.endDate, this.currentUser.username).subscribe((res: any) => {
          // console.log(res);
          Swal.fire('Saved!', '', 'success');
          window.location.reload();
        }, (err) => {
          // console.log(err.error.message == "Text '2023-07-27 14:40:00' could not be parsed at index 10");
          let dynamicHTML;
          // let Text = err.error.message;
          // let isIncludes = Text.length
          // console.log(isIncludes);

          if (err.error.message.length == 58) {
            dynamicHTML = "<h4>Please choose Valid Date and Time </h4>"
          } else {
            dynamicHTML = "<h4>" + err.error.message + "</h4>"
          }

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            html: dynamicHTML,
            text: "",
            footer: '<a style="color:#76b2e3; font-weight:600;"> <span style="color: blue; font-weight:600;">Note:</span> Please Check Playlist has data Or Not</a>'
          })

        })
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })

  }
  fdate: any;
  tdate: any;

  exportAsExcelFile() {
    const title = capitalize(this.clientUsername) + ' Device Details';
    let data = []
    for (let obj of this.rowData) {
      // console.log(obj);
      let g = {
        "filename": obj.filename,
        "state": obj.state,
        "city": obj.city,
        "creationdate": obj.creationdate,
        "uploadedby": obj.uploadedby,
        "updationdate": obj.updationdate,
        "isactive": obj.isactive,
        "sch_start_time": obj.sch_start_time,
        "sch_end_time": obj.sch_end_time
      }
      data.push(g)
      // console.log(g);

    }
    let cellSize = { a: "13", b: "30", c: "25", d: "25", e: "25", f: "25", g: "15", h: "25", i: "25" }
    let titleMerge = "'C1':'G4'";
    let imgMerge = "'A1':'B4'";
    let dateMerge = "'H1':'I4'";
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
    // this.excelService.exportAsExcelFile(data,title);
  }
  exportPdf() {
    // console.log(this.rowData);
    const title = capitalize(this.clientUsername) + ' Schedule Details';
    let Fields = [
      'Filename',
      'State',
      'City',
      'Creationdate',
      "Uploadedby",
      'updatedate',
      'isactive',
      'sch_start_time',
      'sch_end_time',
    ];
    let dataFields = [
      "filename",
      "state",
      "city",
      "creationdate",
      "uploadedby",
      "updationdate",
      "isactive",
      "sch_start_time",
      "sch_end_time"
    ];
    let data = []
    for (let obj of this.rowData) {
      // console.log(obj);
      let g = {
        "filename": obj.filename,
        "state": obj.state,
        "city": obj.city,
        "creationdate": obj.creationdate,
        "uploadedby": obj.uploadedby,
        "updationdate": obj.updationdate,
        "isactive": obj.isactive,
        "sch_start_time": obj.sch_start_time,
        "sch_end_time": obj.sch_end_time
      }
      data.push(g)
    }
    let column_width = ['9%', '11%', '11%', '13%', '8%', '11%', '12%', '13%', '13%']
    this.fdate = this.fromdate;
    this.tdate = this.todate;
    if (this.fdate === undefined && this.tdate === undefined) {
      this.fdate = 'NA';
      this.tdate = 'NA';
    }
    this.pdfService.generatePDFSP(
      'download',
      data,
      title,
      Fields,
      dataFields,
      column_width,
      this.fdate,
      this.tdate
    );
    // this.pdfService.generatePdf();
  }
}

function capitalize(word: any) {
  return word
    .toLowerCase()
    .replace(/\w/, (firstLetter: any) => firstLetter.toUpperCase());
}

function city(params: any) {

  if (params.cityname) {
    return params.cityname;
  } else {
    return "No City";
  }
}

function state(params: any) {
  // console.log(params);

  if (params.statename) {

    return params.statename;
  } else {
    return "No State";
  }
}
