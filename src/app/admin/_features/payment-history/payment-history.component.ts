import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AlertService } from 'src/app/_core/services/alert.service';
import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent {


  gridApi: any;
  paymentHistory: any;
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
  constructor(private clientService: ClientService, private storageService: StorageService, private alertService: AlertService) { }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('quickFilter') as HTMLInputElement).value
    );
  }

  exportAsExcelFile() {

  }

  getPaymentHistoryByMode(type: any) {
    this.clientService.getPaymentHistoryByMode(type, this.storageService.getClientUsername(), this.storageService.getUserRole()).subscribe(res => {
      this.rowData = res;
    })
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    this.getPaymentHistoryByMode("2");
  }
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 100 },
    { headerName: 'Amount', field: 'amount' },
    { headerName: 'Transaction id', field: 'txnid' },
    {
      headerName: 'Status', field: 'status',
      cellStyle: params => {
        if (params.data.status == "Success") {
          return { color: 'green' };
        } else {
          return { color: 'red' };
        }
      }
    }, {
      headerName: 'Actions', width: 100, cellRenderer: (params: any) => {
        const rowData = params.data;
        const refreshButton = document.createElement('button');
        refreshButton.innerHTML = '<i class="fa fa-refresh"></i>';
        refreshButton.style.backgroundColor = 'transparent';
        refreshButton.style.color = '#3085d6';
        refreshButton.style.border = 'none';
        refreshButton.style.cursor = 'pointer';
        refreshButton.style.fontSize = "18px";
        if (!rowData.mode || rowData.status != "Transaction Pending") {
          refreshButton.disabled = true;
          refreshButton.style.color = 'gray';
          refreshButton.style.cursor = 'not-allowed';
        }

        refreshButton.addEventListener('click', () => {
          this.clientService.getEasebuzzPaymentStatus(rowData.txnid).subscribe((ress: any) => {
            this.alertService.showSuccess(ress.message)
          }, err => {
            this.alertService.showError(err?.error?.message)
          })
        });

        return refreshButton;
      }
    },
    {
      headerName: 'Mode', field: 'mode',
      cellStyle: params => {
        if (params.data.mode) {
          return { color: 'green' };
        } else {
          return { color: 'red' };
        }
      }, valueGetter: (e) => {
        if (e.data.mode) {
          return "Online"
        } else {
          return "Offline"
        }
      },
    },
    { headerName: 'Client username', field: 'username' },
    { headerName: 'Requested On', field: 'createddate' },
    { headerName: "Updated date", field: "updateddate" }

  ]
}
