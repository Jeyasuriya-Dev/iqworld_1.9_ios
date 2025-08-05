import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }
  internetQuetion() {
    Swal.fire(
      'The Internet?',
      'That thing is still around?',
      'question'
    )
  }
  errorAlert(message: any) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      footer: '<a >Why do I have this issue?</a>'
    })

  }
  successAlert(message: any) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500
    })
  }
  deleteAlert(){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }
}
