import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import Swal from 'sweetalert2';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-resolve-ticket-btn',
  templateUrl: './resolve-ticket-btn.component.html',
  styleUrls: ['./resolve-ticket-btn.component.scss']
})
export class ResolveTicketBtnComponent implements OnInit, ICellRendererAngularComp {
  complaint: any;
  isSolved: any;
  constructor(private clientService:ClientService) { }
  agInit(params: ICellRendererParams<any, any, any>): void {
    // console.log(params.data.isactive);
    this.complaint = params.data;
    this.isSolved = params.data.isactive
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }
  resolveAction() {
    // console.log(this.complaint);
    
    Swal.fire({
      title: 'Are you sure?',
      text: "Did you get the solution?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Solved!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.updateIsActive(this.complaint.id).subscribe((res:any)=>{
          Swal.fire(
            'Thank You!',
            res.message,
            'success'
          )
          const timeoutId = setTimeout(() => {
            window.location.reload();
            clearTimeout(timeoutId)
          }, 1500)
          
          // later on
  
          
         
        })
        
      }
    })
  }
}
