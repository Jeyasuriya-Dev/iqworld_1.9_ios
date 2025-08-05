import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { ClientService } from 'src/app/_core/services/client.service';
import { DateService } from 'src/app/_core/services/date.service';
import { StorageService } from 'src/app/_core/services/storage.service';

@Component({
  selector: 'app-schedule-history',
  templateUrl: './schedule-history.component.html',
  styleUrls: ['./schedule-history.component.scss']
})
export class ScheduleHistoryComponent implements OnInit {
  max = new Date();
  gridApi: any;
  clientusername: any
  range = new UntypedFormGroup({
    start: new UntypedFormControl(),
    end: new UntypedFormControl()
  });
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
  seletedplaylist_id:any=" ";
  constructor(private storageService: StorageService, private dateService: DateService, private clientService: ClientService) {
    this.max.setDate(this.max.getDate())
  }

  ngOnInit(): void {
    this.clientusername = this.storageService.getClientUsername();
    let range = this.dateService.getTodayToLastOneMonth();
    // console.log(range);
    this.clientService.getScheduleHistoryByFilter(this.clientusername, range.start, range.end,this.seletedplaylist_id).subscribe(res => {
      // console.log(res);
      this.rowData = res;
    })

  }
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 100 },
    {
      headerName: 'Playlist', field: 'playlist_name',
    },
    { headerName: 'Status', field: 'remark', },
    { headerName: 'ActionBy', field: 'scheduledby', },
    {
      headerName: 'Old Schedule ', field: 'old_start_date'
    },
    {
      headerName: 'Now Schedule', field: 'new_start_date',
    },
    { headerName: 'Last Modified', field: "logdate" }
  ];

  getScheduleHistory() {
    // console.log(this.clientusername);
    // console.log(this.range.value.start);
    let start = this.dateService.getDateInDayMonthYear(this.range.value.start);
    let end = this.dateService.getDateInDayMonthYear(this.range.value.end);
    this.clientService.getScheduleHistoryByFilter(this.clientusername, start, end,this.seletedplaylist_id).subscribe(res => {
      // console.log(res);
      this.rowData = res;
    })
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
