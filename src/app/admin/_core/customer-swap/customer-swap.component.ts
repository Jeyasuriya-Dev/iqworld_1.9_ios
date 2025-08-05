import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/_core/services/client.service';

@Component({
  selector: 'app-customer-swap',
  templateUrl: './customer-swap.component.html',
  styleUrls: ['./customer-swap.component.scss']
})
export class CustomerSwapComponent implements OnInit {
  distributorList: any = [];
  clientList: any = [];
  swappedClientList = [];
  ToDistributorList: any = [];
  public filtereddistributorList = this.distributorList.slice();
  public filteredToDistributorList = this.ToDistributorList.slice();
  constructor(private clientService: ClientService) { }

  ngOnInit(): void {

    this.getDistibutorList2();
  }

  getDistibutorList2() {
    this.clientService.getDistibutorForClientFilter().subscribe((res: any) => {
      this.distributorList = res;
      this.filtereddistributorList = res;
    })
  }
  getClientListByDistributorId(distributor: any) {
    this.ToDistributorList = this.distributorList.filter((e: any) => e.id !== distributor.id);
    this.filteredToDistributorList = this.distributorList.filter((e: any) => e.id !== distributor.id);
    this.clientService.getClientListByDistributorId(distributor.id).subscribe((res: any) => {
      this.clientList = res;
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

}
