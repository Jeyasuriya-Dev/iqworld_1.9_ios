import { Component, OnInit } from '@angular/core';
import { log } from 'console';
import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  date = new Date().toLocaleString();
  dueDate = new Date().toDateString();
  allnode: any = 0;
  online: any = 0;
  deactive: any = 0;
  active: any = 0;
  offline: any = 0;
  storage: any = 0;
  totalspace: any = "2GB";
  usedspace: any = "0MB";
  clientname: any;
  remains:any = 400;
  clienlistcount:any=0;
  isDistributor=false;
  constructor(private clientService: ClientService, private storageService: StorageService) { }
  ngOnInit(): void {
    let username1 = this.storageService.getUser();
    // console.log(username1);
   this.remains = getFormatedStringFromDays(400)
    if (username1.roles[0] == 'ROLE_CLIENT') {
      this.clientname = this.storageService.getUser();
    }
    else if (username1.roles[0] == 'ROLE_ADMIN') {
      this.clientname = sessionStorage.getItem('auth-client');
      this.clientname = JSON.parse(this.clientname);
      // console.log(json_object);
      // console.log("clientname");


    }
    else {
      this.clientname = sessionStorage.getItem('auth-client');
    }
    // console.log(this.storageService.getDistributor()?.roles[0]=="ROLE_DISTRIBUTOR");
    
    if (this.storageService.getUserRole() == "DISTRIBUTOR" || this.storageService.getDistributor()?.roles[0]=="ROLE_DISTRIBUTOR") {
      this.isDistributor = true;
       
     let user=this.storageService.getUser();
       if(user?.roles[0]=="ROLE_DISTRIBUTOR"){
        this.clientService.getdistributorByUsername(user.username).subscribe((res: any) => {
          // console.log(res)
          
          
          this.clientService.getDistibutorDashboardData(res.id).subscribe((res: any) => {
            this.allnode = res.TotalDevice;
            this.online = res.OnlineDevice;
            this.deactive = res.DeactiveDevice;
            this.active = res.ActiveDevice;
            this.offline = res.OfflineDevice;
      
            this.clienlistcount=res.ClientCount;
      
          })
        })
        
       }else{
        
         user =this.storageService.getDistributor(); 
        this.clientService.getdistributorByUsername(user.username).subscribe((res: any) => {
        // console.log(res)
       
          
          this.clientService.getDistibutorDashboardData(res.id).subscribe((res: any) => {
            this.allnode = res.TotalDevice;
            this.online = res.OnlineDevice;
            this.deactive = res.DeactiveDevice;
            this.active = res.ActiveDevice;
            this.offline = res.OfflineDevice;
      
            this.clienlistcount=res.ClientCount;
      
          })
        })
        
       }
      //  console.log(user);
       
     
    } else {
      this.isDistributor = false;
    }
    
    
  }

}
function percentage1(totalspace: any, usedspace: any) {

  // console.log(totalspace.substring(totalspace.length()-1, totalspace.length()));
  // console.log(used);
  // console.log(totalspace.length());

  // console.log(totalspace.substring(0, totalspace.length - 2));


  const total = totalspace.substring(0, totalspace.length - 2) * 1000;
  const used = usedspace.substring(0, usedspace.length - 2);

  let percentage: any = ((used / total) * 100);
  let p = parseFloat(percentage).toFixed(2);
  return p;
}
function percentage(totalspace: any, usedspace: any) {


  // console.log(totalspace.substring(0,totalspace.length-2));

  // console.log(totalspace);
  // console.log(usedspace.slice(-2));
  let space;
  if (usedspace.slice(-2) == "KB") {
    space = usedspace.substring(0, usedspace.length - 2)
  } else if (usedspace.slice(-2) == "MB") {
    space = usedspace.substring(0, usedspace.length - 2) * 1024
  }
  else if (usedspace.slice(-2) == "GB") {
    space = usedspace.substring(0, usedspace.length - 2) * 1000 * 1024
  }
  // console.log(totalspace.substring(0, totalspace.length - 2));
  
  const total = totalspace.substring(0, totalspace.length - 2) * 1000 * 1024;
  const used = space;
  // console.log(total);
  // console.log(used);

  let percentage:any = ((used / total) * 100);
  let p = parseFloat(percentage).toFixed(3);
  return p;
}
function getFormatedStringFromDays(numberOfDays:any) {
  var years = Math.floor(numberOfDays / 365);
  var months = Math.floor(numberOfDays % 365 / 30);
  var days = Math.floor(numberOfDays % 365 % 30);

  return years+"y"+months+"m"+days+"d";
}