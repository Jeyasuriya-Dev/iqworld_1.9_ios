import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ClientService } from '../../services/client.service';
import { StorageService } from '../../services/storage.service';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-date-time-render',
  templateUrl: './date-time-render.component.html',
  styleUrls: ['./date-time-render.component.scss']
})
export class DateTimeRenderComponent implements OnInit, ICellRendererAngularComp {
  isStateId: any;
  statelist: any;

  params: any;
  editplaylist: any;
  selectedStateList: any = []
  selectStateList: any = [];
  stateList: any = [];
  clientname: any;
  selectedOptions: any = []
  constructor(private matDailog: MatDialog, private fb: UntypedFormBuilder, private clientService: ClientService, private storage: StorageService) { }


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

    // this.btnClickedHandler();
  }


  agInit(params: any): void {
    this.params = params;
    // console.log(params.data);
    this.getStateAllList();
    this.selectStateList = this.params.data.state_list;
    this.isStateId = this.params.data.state;
    // console.log(this.isStateId);

    // this.btnClickedHandler();
  }

  btnClickedHandler() {
    // console.log(this.stateList);
    // console.log(this.selectStateList);

    for (let state of this.stateList) {

      // console.log(this.selectStateList);
      let StateInstant = { id: state.id, statename: state.statename, isSelected: false }

      if (this.selectStateList.includes(state.statename)) {
        StateInstant = { id: state.id, statename: state.statename, isSelected: true }
        if (state.id != 0) {
          this.selectedOptions.push(StateInstant.id)
        }
        // console.log(state);

      }
      if (state.id != 0) {
        this.selectedStateList.push(StateInstant);
      }
    }

    // console.log(this.selectedStateList);
    // console.log(this.selectedOptions);

    // this.matDailog.open(event, {

    // });

  }
  getStateAllList() {
    this.clientService.getAllStateList().subscribe(res => {
      // console.log(res);
      this.stateList = res;
    })
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    throw new Error('Method not implemented.');
  }


  onEditClick(): void {
    this.params.edit(this.params.node.rowIndex);
  }

  onDeleteClick(): void {
    this.params.delete(this.params.node.rowIndex);
  }

  onSaveClick(): void {
    // console.log(this.selectedOptions);
    // console.log(this.params.data.id);
    let payload = {
      playlist_id: this.params.data.id,
      statelist: this.selectedOptions
    }
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.clientService.editPlaylistStateList(payload).subscribe((res:any) => {
          // console.log(res);
          Swal.fire('Saved!', res.message, 'success')
        })
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
    
  }

  @ViewChild('select') select!: MatSelect;

  allSelected = false;

  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }
  optionClick() {

    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }
}
