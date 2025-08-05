import { Component, OnInit } from '@angular/core';
import { clienturl } from 'src/app/api-base';

@Component({
  selector: 'app-client-base',
  templateUrl: './client-base.component.html',
  styleUrls: ['./client-base.component.scss']
})
export class ClientBaseComponent implements OnInit {

  currentVersion = clienturl.CURRENT_VERSION();
  constructor() { }

  ngOnInit(): void {
  }

}
