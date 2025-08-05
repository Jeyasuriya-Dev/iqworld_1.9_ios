import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-modelname-dropdown',
  templateUrl: './modelname-dropdown.component.html',
  styleUrls: ['./modelname-dropdown.component.scss']
})
export class ModelnameDropdownComponent implements ICellRendererAngularComp {
 params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    // console.log(params);
  
    this.params = params;
  }

  refresh() {
    return false;
  }

}
