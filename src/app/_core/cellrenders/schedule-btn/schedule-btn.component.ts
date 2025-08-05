import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ClientService } from '../../services/client.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-schedule-btn',
  templateUrl: './schedule-btn.component.html',
  styleUrls: ['./schedule-btn.component.scss']
})
export class ScheduleBtnComponent implements OnInit, ICellRendererAngularComp {
  private params: any;
  editplaylist: any;
  selectedStateList: any = [{ id: "", statename: "", isSelected: false }]
  selectStateList: any = [];
  stateList: any = [];
  clientname:any;
  constructor(private matDailog: MatDialog, private fb: FormBuilder, private clientService: ClientService,private storage:StorageService) { }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    throw new Error('Method not implemented.');
  }


  ngOnInit(): void {
    let username1 = this.storage.getUser();

    if (username1.roles[0] == 'ROLE_CLIENT') {
      this.clientname = this.storage.getUser();
    } else {
      this.clientname = sessionStorage.getItem('auth-client');
      this.clientname = JSON.parse(this.clientname);
    }
    this.editplaylist = this.fb.group({
      filename: [this.params.data.filename, Validators.required],
      state: [this.params.data.clientname, Validators.required],
      city: [this.params.data.clientname],
      displaytype: ["horizental", Validators.required],
      client_id: [, Validators.required],
      username: [, Validators.required],
      clientname: [this.params.data.clientname, Validators.required],
      mediatype: ["0", Validators.required],
      statelist: this.fb.array([])
    });


  }


  agInit(params: any): void {
    this.params = params;
    // console.log(params.data);
    
    this.getStateAllList();
    this.selectStateList = this.params.data.state_list;
  }

  btnClickedHandler(event: any) {
    // console.log(this.stateList);
    // console.log(this.selectStateList);
    for (let state of this.stateList) {
      // console.log(o.statename);
      // console.log(this.selectStateList);
      let StateInstant = { id: state.id, statename: state.statename, isSelected: false }

      if (this.selectStateList.includes(state.statename)) {
        StateInstant = { id: state.id, statename: state.statename, isSelected: true }
        // console.log(state);

      }
      this.selectedStateList.push(StateInstant);
    }
    // console.log(this.selectedStateList);

    this.matDailog.open(event, {

    });

  }
  getStateAllList() {
    this.clientService.getAllStateList().subscribe(res => {
      // console.log(res);
      this.stateList = res;
    })
  }
}
