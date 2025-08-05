import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upgrade-plan',
  templateUrl: './upgrade-plan.component.html',
  styleUrls: ['./upgrade-plan.component.scss']
})
export class UpgradePlanComponent implements OnInit {
  currentUser: any;
  client: any;
  versionMasterId: any;
  constructor(private clientService: ClientService, private storageService: StorageService) {

  }

  ngOnInit(): void {
    this.currentUser = this.storageService.getClient();
    if (!this.currentUser) {
      this.currentUser = this.storageService.getUser();
    }
    // console.log(this.currentUser);
    this.clientService.getClientByUsername(this.currentUser.username).subscribe((res: any) => {
      // console.log(res);
      this.client = res;
      this.versionMasterId = res?.versionMaster?.id
      // console.log(this.versionMasterId);
    })


  }
  upgradeRequest(type: any) {
    // console.log(type);

    // const swalWithBootstrapButtons = Swal.mixin({
    //   customClass: {
    //     confirmButton: "btn btn-success",
    //     cancelButton: "btn btn-danger"
    //   },
    //   buttonsStyling: false
    // });
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to upgrade?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Upgrade it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      input: 'radio',
      inputOptions: {
        // '1': 'I Want To Upgrade all Devices \n',
        // '0': 'Upgrade Me Only',
        '1': 'all Devices will be Upgraded to ' + type
      },
      inputValue: '1',
      inputValidator: function (result) {
        if (!result) {
          'You need to select something!';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(result.value);
        this.clientService.upgradeClientVersion(this.client.id, type, result.value).subscribe((res: any) => {
          Swal.fire({
            title: "Upgraded!",
            text: res.message,
            icon: "success"
          });
        }, err => {
          Swal.fire({
            title: "Sorry!!",
            text: err.error.message,
            icon: "error"
          });
        })

      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Your request is Cancelled:)",
          icon: "error"
        });
      }
    })
    // Swal.fire({
    //   title: "Are you sure?",
    //   text: "Do you want to upgrade?",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonText: "Yes, Upgrade it!",
    //   cancelButtonText: "No, cancel!",
    //   reverseButtons: true
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this.clientService.upgradeClientVersion(this.client.id, type).subscribe((res: any) => {
    //       Swal.fire({
    //         title: "Upgraded!",
    //         text: res.message,
    //         icon: "success"
    //       });
    //     }, err => {
    //       Swal.fire({
    //         title: "Sorry!!",
    //         text: err.error.message,
    //         icon: "error"
    //       });
    //     })

    //   } else if (
    //     /* Read more about handling dismissals below */
    //     result.dismiss === Swal.DismissReason.cancel
    //   ) {
    //     Swal.fire({
    //       title: "Cancelled",
    //       text: "Your request is Cancelled:)",
    //       icon: "error"
    //     });
    //   }
    // });
  }
}
