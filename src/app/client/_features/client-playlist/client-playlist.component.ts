import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
// import * as moment from 'moment';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';
import { AlertService } from 'src/app/_core/services/alert.service';
import { AuthService } from 'src/app/_core/services/auth.service';
import { ClientService } from 'src/app/_core/services/client.service';
import { DateService } from 'src/app/_core/services/date.service';
import { StorageService } from 'src/app/_core/services/storage.service';
import { SweetAlertService } from 'src/app/_core/services/sweet-alert.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-client-playlist',
  templateUrl: './client-playlist.component.html',
  styleUrls: ['./client-playlist.component.scss']
})
export class ClientPlaylistComponent implements OnInit {
  @ViewChild('statechecks') statechecks!: any;
  dailogRef: any;
  stateList: any;
  filteredStateList: any = []
  selectedTeam: any;
  selectedHrTeam: any;
  selectedHrState: any;
  selectedHrDistrict: any;
  selectedHrCity: any
  selectedOptions: any = []
  ipAdress: any;
  horizontalplaylist!: UntypedFormGroup;
  verticalplaylist!: UntypedFormGroup;
  channelplaylist!: UntypedFormGroup;
  videoplaylist!: UntypedFormGroup;
  defaultplaylist!: UntypedFormGroup
  isEnter = true;
  isEnterArea = true;
  cityListByStateid: any = [];
  filtercityListByStateid: any = [];
  locationList: any = [];
  filterlocationList: any = []
  selectedlocation: any;
  clientname: any = {};
  selectedStateId: any;
  selectedCityId: any;
  playlistMedia: any;
  isStateAllSelected = false;
  stateListIds: any;
  currentTime: any = new Date();
  clientUsername: any;
  isMoblie = false;
  customer: any
  constructor(private dateService: DateService, private authService: AuthService, private observer: BreakpointObserver, private tokenStorage: StorageService, private Alert: SweetAlertService, private activatedRoute: ActivatedRoute, private alertService: AlertService, private router: Router, private storage: StorageService, private matDailog: MatDialog, private fb: UntypedFormBuilder, private clientService: ClientService) {
    this.clientUsername = this.activatedRoute.snapshot.paramMap.get('clientid');

    if (this.clientUsername) {
      sessionStorage.setItem('clientid', this.clientUsername);
      clientService.getClientByUsername(this.clientUsername).subscribe((res: any) => {
        this.customer = res;
        let v = {
          username: res?.username,
          password: res?.password,
        }
        this.authService.login(v).subscribe(resp => {
          // console.log(res);
          // console.log(res.roles.includes('ROLE_ADMIN'));
          // console.log(res.roles.includes('ROLE_CLIENT'));

          if (resp.roles.includes('ROLE_ADMIN') || resp.roles.includes('ROLE_CLIENT') || resp.roles.includes('ROLE_DISTRIBUTOR')) {
            // alert(res)
            this.tokenStorage.saveToken(resp.accessToken);
            this.tokenStorage.saveUser(resp);
            this.tokenStorage.saveLoggerName(resp?.username);
            this.tokenStorage.saveLoggerPass(res?.password);
          } else {
            sessionStorage.setItem('mclient', JSON.stringify(res));
          }
        })
      })
    }
  }
  storageData: any = [];
  customerStorage: any;
  ngOnInit(): void {
    let myVar = setInterval(async () => {
      // console.log(await this.dateService.getCurrentTime());
      // let json: any = await this.dateService.getCurrentTime();
      // // console.log(json);
      // this.currentTime = json.datetime;
      // console.log(currentTime);/
      this.currentTime = sessionStorage.getItem('currentTime');
    }, 1000);

    let username1 = this.storage.getUser();
    if (username1) {
      if (username1?.roles[0] == 'ROLE_CLIENT') {
        this.clientname = this.storage.getUser();
      }
      else if (username1?.roles[0] == 'ROLE_ADMIN') {
        this.clientname = sessionStorage.getItem('auth-client');
        this.clientname = JSON.parse(this.clientname);
        // console.log(json_object);
        // console.log("clientname");
      }
      else {
        this.clientname = sessionStorage.getItem('auth-client');
        this.clientname = JSON.parse(this.clientname);
      }
    } else {
      username1 = sessionStorage.getItem("mclient");
      username1 = JSON.parse(username1);
      console.log(username1);
      this.clientname = username1
    }

    this.stateListIds = this.fb.group({
      statelist: this.fb.array([])
    })
    // this.filterSelectionDup("all");


    this.horizontalplaylist = this.fb.group({
      filename: ['', Validators.required],
      state: ['', Validators.required],
      city: [''],
      displaytype: ["horizental", Validators.required],
      client_id: [username1?.id, Validators.required],
      username: [username1?.username, Validators.required],
      clientname: [this.clientname?.username, Validators.required],
      mediatype: ["0", Validators.required],
      statelist: this.fb.array([])
    });
    this.verticalplaylist = this.fb.group({
      filename: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      district: ['', Validators.required],
      displaytype: ["vertical", Validators.required],
      client_id: [username1?.id, Validators.required],
      username: [username1?.username, Validators.required],
      clientname: [this.clientname?.username, Validators.required],
      mediatype: ["3", Validators.required],
      statelist: this.fb.array([]),
      location: ['', Validators.required]

    });
    // this.verticalplaylist = this.fb.group({
    //   filename: ['', Validators.required],
    //   state: ['', Validators.required],
    //   city: ['', Validators.required],
    //   displaytype: ["vertical", Validators.required],
    //   client_id: [username1.id, Validators.required],
    //   username: [username1.username, Validators.required],
    //   clientname: [this.clientname.username, Validators.required],
    //   mediatype: ["0", Validators.required],
    //   statelist: this.fb.array([])
    // });
    this.channelplaylist = this.fb.group({
      filename: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      displaytype: ["", Validators.required],
      team: ['']
    });
    this.videoplaylist = this.fb.group({
      filename: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      displaytype: ["vertical", Validators.required],
      client_id: [username1?.id, Validators.required],
      username: [username1?.username, Validators.required],
      clientname: [this.clientname?.username, Validators.required],
      mediatype: ["2", Validators.required],
    });
    this.defaultplaylist = this.fb.group({
      filename: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      displaytype: ["vertical", Validators.required],
      district: ['', Validators.required],
      client_id: [username1?.id, Validators.required],
      username: [username1?.username, Validators.required],
      clientname: [this.clientname?.username, Validators.required],
      mediatype: ["4", Validators.required],
      location: ['', Validators.required],
    });
    this.clientService.getClientStorageDetails(this.clientname?.username).subscribe((res: any) => {
      console.log(res);
      this.customerStorage = res;
      let v: any = setPercentage(this.customerStorage);
      console.log(v);
      
      this.storageData = [
        { label: 'Total Space', color: 'red', value: 100 },
        { label: 'Used Space', color: 'green', value:v?.userspace  },
        { label: 'Free Space', color: 'blue', value:v?.freespace },
        { label: 'Schedule Playlist Space', color: 'black', value: v?.playlistspace },
        { label: 'Default Content Space', color: 'purple', value: v?.defaultplaylistspace }
      ];
    })
    this.getStateAllList();
    // this.getAllPlaylist(this.clientname.username, "0")
    this.mediaFilebyClientAndDate(this.clientname?.username, "null", "null", "null", "3", "null", "null");
    this.clientService.getClientByUsername(this.clientname?.username).subscribe((res: any) => {
      this.customer = res
      this.getStateAllList();
    })

    this.observer.observe(['(max-width: 768px)']).subscribe((res) => {

      if (res.matches) {
        this.isMoblie = true;

      } else {
        this.isMoblie = false;

      }
    })

  }
  selectedOption: any;
  onCheckboxChange(e: any, id: any) {
    const service: UntypedFormArray = this.stateListIds?.get('statelist') as UntypedFormArray;
    // if (id == 0 && e.target.checked) {
    //   for (let state of this.stateList) {
    //     service.push(new FormControl(state.id));
    //   }
    // }
    // else if(id == 0 && !e.target.checked){
    //   for (let i:any;i<=this.stateList.length;i++) {
    //     service.removeAt(i);
    //   }
    // }
    // console.log(e.target.checked);
    if (e.target.checked) {
      service.push(new UntypedFormControl(id));
    } else {
      let i: number = 0;
      service.controls.forEach((item: any) => {
        if (item.value == id) {
          service.removeAt(i);
          return;
        }
        i++;
      });

    }
    // console.log(service.controls);
  }
  onMenuItemClick(value: any) {

  }
  settingPlaylist(playlist: any, template: any) {
    // console.log(playlist);
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete content? , if you would, You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let loader = this.matDailog.open(LoaderComponent, {
          panelClass: 'loader-upload'
        })
        this.clientService.deletePlaylist(playlist.id).subscribe((res: any) => {
          // console.log(res);
          loader.close();
          Swal.fire(
            'Deleted!',
            res.message,
            'success'
          )
          this.mediaFilebyClientAndDate(this.clientname?.username, "null", 'null', "null", playlist?.mediainfo?.id, "null", "null");
        }, err => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.error.message,
          });
        })

        // window.location.reload();

      }
    })

  }
  selectedDefaultTabValue(event: any) {
    // console.log(event.index == 0);
    if (event.index == 0) {
      this.clientService.getDefaultAllPlaylistByClient(this.clientname?.username, "0").subscribe((res: any) => {
        // console.log(res);
        this.Playlist = res;
        this.rowDatafilter = res;
      });
    } else if (event.index == 1) {
      this.clientService.getDefaultAllPlaylistByClient(this.clientname?.username, "1").subscribe((res: any) => {
        // console.log(res);
        this.Playlist = res;
        this.rowDatafilter = res;
      });
    } else {
      this.Playlist = [];
      this.rowDatafilter = [];
    }

  }
  selectedTabValue(data: any) {
    // console.log(data.index);
    let username1 = this.storage.getUser();
    if (username1) {
      if (username1?.roles[0] == 'ROLE_CLIENT') {
        this.clientname = this.storage.getUser();
      } else {
        this.clientname = sessionStorage.getItem('auth-client');
        this.clientname = JSON.parse(this.clientname);
      }
    } else {
      username1 = sessionStorage.getItem("mclient");
      username1 = JSON.parse(username1);
      console.log(username1);
      this.clientname = username1
    }
    // console.log(this.clientname);
    // console.log(data.index);

    if (data.index == 0) {
      this.mediaFilebyClientAndDate(this.clientname?.username, "null", "null", "null", "3", "null", "null");
    }
    else if (data.index == 3) {
      // this.mediaFilebyClientAndDate(this.clientname.username, "null", "null", "null", "1");
      this.Playlist = [];
      this.rowDatafilter = [];
    }
    // else if (data.index == 3) {
    // this.mediaFilebyClientAndDate(this.clientname.username, "null", "null", 2, "null")
    // }
    else if (data.index == 2) {
      this.Playlist = [];
      this.rowDatafilter = [];
      this.mediaFilebyClientAndDate(this.clientname?.username, "null", "null", "null", "3", "null", "null");
    }
    else if (data.index == 1) {
      this.Playlist = [];
      this.rowDatafilter = [];
      // this.mediaFilebyClientAndDate(this.clientname.username, "null", "null", "4", "null");
      this.clientService.getDefaultAllPlaylistByClient(this.clientname?.username, "0").subscribe((res: any) => {
        // console.log(res);
        this.Playlist = res;
        this.rowDatafilter = res;
      });
    }
    // if (data.index == 0 || data.index == 1 || data.index == 4) {
    //   this.getAllPlaylist(clientname.username, data.index);
    // }
    else {
      this.Playlist = [];
      this.rowDatafilter = [];
    }
  }
  getAllMediaInfoByPlaylistId(playListId: any): any {
    this.clientService.getAllMediaInfoByPlaylistId(playListId).subscribe((res: any) => {
      // console.log(res);
      this.playlistMedia = res;
    });
    return this.playlistMedia;
  }

  isEmptyOrnot(playlist: any): any {
    // console.log(playlist);

    let data = this.getAllMediaInfoByPlaylistId(playlist);
    // console.log(data.length);
    return data.length;
  }
  scheduleFormater(playlist: any): any {
    let current;
    var sch_start_time = new Date(playlist.sch_start_time).getTime();
    var sch_end_time = new Date(playlist.sch_end_time).getTime();
    if (this.customer?.country?.countryname == "INDIA") {
      current = new Date(this.currentTime).getTime();
    } else {
      // let tokyoTime = moment().tz(this.customer?.timezone).format('YYYY-MM-DDTHH:mm:ss.SSSSSS+00:00');
      // let currentDate = moment(tokyoTime).tz(this.customer?.timezone).utc().format('YYYY-MM-DDTHH:mm:ss');
      // current = new Date(currentDate).getTime();
    current=this.currentTime
    }

    // console.log(sch_start_time > current);
    // console.log(sch_start_time < current && current < sch_end_time);
    // console.log(current > sch_end_time);
    if (sch_start_time != 0 && sch_end_time != 0) {
      if (sch_start_time > current) {
        return 'Scheduled';
      } else if (sch_start_time < current && current < sch_end_time) {
        return 'Onprogress';
      } else if (current > sch_end_time) {
        return 'Finished';
      }
      else {
        return "Not Scheduled";
      }
    }

    else {
      return "Not Scheduled";
    }
  }

  filterSelectionDup(data: any) {
    // filterSelection(data)
    // console.log(data);
    // console.log(this.selectedStateId);
    // console.log(this.selectedCityId);
    if (data == "all") {
      this.mediaFilebyClientAndDate(this.clientname?.username, 'null', "null", "null", "3", "null", "null");
      this.selectedStateId = null;
      this.selectedCityId = null;
    }
    if (this.selectedCityId && this.selectedStateId && this.selectedDistrictId) {
      if (data == "Images") {
        this.filterPlaylist(this.selectedStateId, this.selectedDistrictId, this.selectedCityId, 1, "null", "");
      } else if (data == "Video") {
        this.filterPlaylist(this.selectedStateId, this.selectedDistrictId, this.selectedCityId, 2, "null", "");
      }
    }


  }
  openPopUp(template: any) {
    this.dailogRef = this.matDailog.open(template, {
      minWidth: '320px'
    })
  }
  searchFunction() {
    searchFunction()
  }
  showAsList(data: any) {

  }
  getStateAllList() {
    // this.clientService.getAllStateList().subscribe(res => {
    //   // console.log(res);
    //   this.stateList = res;
    // })

    // this.clientService.getStateListbyClientdeviceLocation(this.clientname?.username).subscribe(res => {
    //   // console.log(res);
    //   this.stateList = res;
    // })
    console.log(this.customer);

    this.clientService.getStateListForPlaylist(this.customer?.country?.countryname, this.customer?.country?.id, this.clientname?.username).subscribe(res => {
      // console.log(res);
      this.stateList = res;
      this.filteredStateList = res;
    })

  }
  statechecksModel: any;
  closeStatechecksModel() {
    this.statechecksModel.close();

  }
  selectedDistrictId: any;
  choosedDistrict: any;
  onChooseDistrict(district: any) {
    this.selectedDistrictId = district?.id
    this.cityListByStateid = [];
    this.filtercityListByStateid = [];
    this.locationList = [];
    this.filterlocationList = [];
    this.choosedDistrict = district;
    // this.filterPlaylist(this.selectedStateId, this.selectedDistrictId, "null", "3", "null", "null");
    let payload = {
      district_list: [this.selectedDistrictId],
      clientname: this.clientname?.username
    }


    this.clientService.getCityListByDistrictNdStateForPlaylist(district?.name, district?.id, this.selectedStateId, this.clientname?.username).subscribe(res => {
      // console.log(res);
      this.cityListByStateid = res;
      this.filtercityListByStateid = res;
    })
    // this.clientService.getCityListByDistrictList(payload).subscribe(res => {
    //   // console.log(res);
    //   this.cityListByStateid = res;

    // })
    // this.clientService.getCityListByDistrictnameOrId(district?.name, "null").subscribe(res => {
    //   // console.log(res);
    //   this.cityListByStateid = res;
    // })
  }
  districtList: any;
  filterDistrictList: any;
  choosedState: any;
  onChooseState(stateid: any) {
    console.log(stateid);
    this.districtList = [];
    this.filterDistrictList = [];
    this.cityListByStateid = [];
    this.filtercityListByStateid = [];
    this.locationList = [];
    this.filterlocationList = [];
    if (stateid?.id == 0) {
      this.statechecksModel = this.matDailog.open(this.statechecks, {})
      this.isStateAllSelected = true;
    } else {
      this.selectedStateId = stateid?.id;
      this.isStateAllSelected = false;

      let payload = {
        state_list: [this.selectedStateId],
        clientname: this.clientname?.username
      }
      this.choosedState = stateid
      this.clientService.getDistrictListByStateForPlaylist(stateid?.statename, stateid?.id, this.clientname?.username).subscribe(res => {
        // console.log(res);
        this.districtList = res;
        this.filterDistrictList = res;
      })

      // this.clientService.getDistrictListByStateIdList(payload).subscribe(res => {
      //   // console.log(res);
      //   this.districtList = res;
      // })
      // this.clientService.getCitybyStatelist(payload).subscribe(res => {
      //   // console.log(res);
      //   this.cityListByStateid = res;
      //   // this.filteredListCity = res;
      // })
      // this.clientService.getCityListByStateId(stateid).subscribe(res => {
      //   // console.log(res);
      //   this.cityListByStateid = res;
      // })
    }
    // this.filterPlaylist(this.selectedStateId, "null", "null", "null");
  }
  selectedDistrict: any;

  commonWallStateChoose(stateid: any) {
    this.selectedStateId = stateid;
    this.districtList = [];
    this.filterDistrictList = [];
    this.cityListByStateid = [];
    this.filtercityListByStateid = [];
    this.locationList = [];
    this.filterlocationList = [];
    let payload = {
      state_list: [this.selectedStateId],
      clientname: this.clientname?.username
    }
    this.clientService.getDistrictListByStateIdList(payload).subscribe(res => {
      // console.log(res);
      this.districtList = res;
      this.filterDistrictList = res;
      // this.filteredListCity = res;
    })
    // this.clientService.getCityListByStateId(stateid).subscribe(res => {
    //   // console.log(res);
    //   this.cityListByStateid = res;
    // });
    this.filterPlaylist(this.selectedStateId, "null", "null", "3", "null", "");
  }
  onEnterCityname(event: any) {
    // console.log(event.target.value);
    this.clientService.getLocationListByCity(event.target.value).subscribe(res => {
      // console.log(res);
      this.locationList = res;
      this.filterlocationList = res;
    })
  }
  isCityAllSelected = false;
  onChooseCityname(cityid: any) {
    this.verticalplaylist.removeControl('location');
    this.verticalplaylist.addControl('location', new UntypedFormControl(""));
    this.defaultplaylist.removeControl('location');
    this.defaultplaylist.addControl('location', new UntypedFormControl(""));
    this.locationList = [];
    this.filterlocationList = []
    this.selectedCityId = cityid?.id;
    // console.log(this.selectedHrState);
    // console.log(this.selectedHrCity);
    // console.log(this.selectedHrState);
    //  console.log(cityid);
    if (this.selectedCityId == 0) {
      this.isCityAllSelected = true;
    } else {
      this.isCityAllSelected = false;
    }
    // this.clientService.getLocationListByCity1(this.selectedCityId).subscribe(res => {
    //   // console.log(res);
    //   this.locationList = res;
    // })
    this.clientService.getLocationListByDistrictNdCityNdStateForPlaylist(cityid.cityname, this.choosedDistrict?.id, this.choosedState?.id, cityid?.id, this.clientname?.username).subscribe(res => {
      this.locationList = res;
      this.filterlocationList = res;
    })
  }
  onChooseCity(cityid: any) {
    this.selectedCityId = cityid;
    // console.log(this.selectedHrState);
    // console.log(this.selectedHrCity);

    this.filterPlaylist(this.selectedStateId, this.selectedDistrict, this.selectedCityId, "3", "null", "null");
    // console.log(this.selectedHrState);
    this.clientService.getLocationListByCityId(this.selectedCityId).subscribe(res => {
      // console.log(res);
      this.locationList = res;
      this.filterlocationList = res;
    })
  }
  onChooseLocation(location_id: any) {
    this.filterPlaylist(this.selectedStateId, this.selectedDistrictId, this.selectedCityId, "3", "null", location_id);
  }
  chooseOrEnterCity() {
    this.isEnter = !this.isEnter;
  }
  chooseOrEnterLocation() {
    this.isEnterArea = !this.isEnterArea;
  }
  Playlist: any = [];
  rowDatafilter: any = [];
  getAllPlaylist(clientname: any, vertical: any) {
    this.clientService.getAllPlaylistByClient(clientname, vertical).subscribe((res: any) => {
      // console.log(res);
      this.Playlist = res;
      this.rowDatafilter = res;
    })
  }

  mediaFilebyClientAndDate(clientname: any, state_id: any, district_id: any, city_id: any, mediatype: any, vertical: any, location_id: any) {
    let payload = {
      "clientname": clientname,
      "state": state_id,
      "city": city_id,
      "mediatype": mediatype,
      "vertical": vertical,
      "location_id": location_id,
      "district_id": district_id
    }
    this.clientService.mediaFilebyClientAndDate(payload).subscribe((res: any) => {
      // console.log(res);
      this.Playlist = res;
      this.rowDatafilter = res;
    })
  }
  closeMatDialog() {
    this.dailogRef.close();
  }

  createPlaylist(form: any) {
    console.log(form.value);
    if (form.value.filename) {
      let loader = this.matDailog.open(LoaderComponent, {
        panelClass: 'loader-upload'
      })
      this.clientService.createPlaylist(form.value, this.selectedOptions).subscribe((res: any) => {
        // console.log(res);
        loader.close();
        this.Alert.successAlert(res.message);
        this.dailogRef.close()
        // window.location.reload();
        this.mediaFilebyClientAndDate(this.clientname?.username, "null", "null", "null", form.value.mediatype, "null", "null");
        form.reset();
      }, err => {
        loader.close();
        this.Alert.errorAlert(err.error.message);
      })
    } else {
      this.alertService.showWarning("Kindly Enter Playlist Name")
    }

  }
  mediaUpload(playlist: any) {
    // console.log(playlist);
    // sessionStorage.setItem("playlist",playlist);
    if (this.clientUsername) {
      console.log("red");
      this.router.navigate(["client-mobile/playlist/uploadmedia", playlist.id]);
    } else {
      this.router.navigate(["/client/upload-media/", playlist.id]);
    }
  }

  filterPlaylist(state_id: any, district_id: any, city_id: any, mediatype: any, vertical: any, location_id: any) {

    this.mediaFilebyClientAndDate(this.clientname?.username, state_id, district_id, city_id, mediatype, vertical, location_id);
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

  onSaveClick(data: any): void {
    let payload = {
      playlist_id: data.id,
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
        this.clientService.editPlaylistStateList(payload).subscribe((res: any) => {
          // console.log(res);
          Swal.fire('Saved!', res.message, 'success')
        })
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })

  }
  setDefault(playlist: any, setdefault: any) {
    // console.log(setdefault.checked);
    // console.log(playlist);
    let v: any = this.tokenStorage.getCurrentUser()
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.clientService.setPlaylistAsDefault(this.clientname?.username, setdefault.checked, playlist.state.id, playlist.id, playlist.isvertical, v.username).subscribe((res: any) => {
          // console.log(res);
          Swal.fire('Saved!', res.message, 'success');
          window.location.reload();
        }, err => {
          this.alertService.showError(err?.error?.message);
          setdefault.checked = false;
        })
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    })
  }

  filterStates(searchText: string): void {
    this.filteredStateList = this.stateList.filter((state: any) =>
      state.statename.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  filterDistricts(searchText: string): void {
    this.filterDistrictList = this.districtList.filter((state: any) =>
      state.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  filterCities(searchText: string): void {
    this.filtercityListByStateid = this.cityListByStateid.filter((state: any) =>
      state.cityname.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  filterLocation(searchText: string): void {
    this.filterlocationList = this.locationList.filter((state: any) =>
      state.area.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  filterRowData(searchText: any) {
    this.Playlist = this.rowDatafilter.filter((obj: any) => {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (typeof value === 'string' && value.toLowerCase().includes(searchText.toLowerCase())) {
            return true;
          }
          if (typeof value === 'object' && value !== null) {
            if (this.objectIncludesValue(value, searchText)) {
              return true;
            }
          }
          if (key === 'isactive') {
            let v1 = "pending";
            let v2 = "approved";
            if (v1.includes(searchText.toLowerCase())) {
              if (!value) {
                return true;
              } else {
                return false;
              }
            } else if (v2.includes(searchText.toLowerCase())) {
              if (value) {
                return true;
              } else {
                return false;
              }
            }
          }
          if (key === 'height_width') {
            let v1 = "horizontal";
            let v2 = "vertical";
            if (v1.includes(searchText.toLowerCase())) {
              if (value === '16:9') {
                return true;
              } else {
                return false;
              }
            } else if (v2.includes(searchText.toLowerCase())) {
              if (value === '9:16') {
                return true;
              } else {
                return false;
              }
            }
          }
          if (key === 'isonline') {
            let v1 = "online";
            let v2 = "offline";
            if (v1.includes(searchText.toLowerCase())) {
              if (value) {
                return true;
              } else {
                return false;
              }
            } else if (v2.includes(searchText.toLowerCase())) {
              if (!value) {
                return true;
              } else {
                return false;
              }
            }
          }
        }
      }
      return false;
    }
    )
  }

  objectIncludesValue(obj: any, searchText: any) {
    return Object.keys(obj).some(key => {
      const value = obj[key];
      if (typeof value === 'string' && value.toLowerCase().includes(searchText.toLowerCase())) {
        return true;
      }
      return false;
    });
  }
}



function filterSelection(c: any) {
  var x, i;
  x = document.getElementsByClassName("filterDiv");
  if (c == "all") c = "";
  // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
}

// Show filtered elements
function w3AddClass(element: any, name: any) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

// Hide elements that are not selected
function w3RemoveClass(element: any, name: any) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}


/*####################### Filter Suche ####################################### */

function searchFunction() {
  // Declare variables
  var i;
  var input: any = document.getElementById('searchinput');
  var filter = input.value.toUpperCase();
  var list = document.getElementsByClassName('tag');
  for (i = 0; i < list.length; i++) {
    if (list[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
      let n: any = list[i].parentElement?.parentElement;
      n.style.display = ""
    } else {
      let n: any = list[i].parentElement?.parentElement;
      n.style.display = "none"
    }
  }


}
function setPercentage(value: any) {

  console.log(value);



  // Convert data sizes to bytes

  const units: any = {

    'KB': 1 / 1024,

    'MB': 1,

    'GB': 1024

  };



  const dataSizeToBytes = (size: any) => {

    const [val, unit] = size.split(' ');

    return parseFloat(val) * units[unit];

  };



  // Convert all sizes to bytes

  for (const key in value) {

    value[key] = dataSizeToBytes(value[key]);

  }



  let obj: any = {}; // Define an empty object to store percentages



  // Calculate percentages

  const totalSpace = value['totalspace'];

  for (const key in value) {

    if (key !== 'totalspace') {

      const percentage = (value[key] / totalSpace) * 100;

      console.log(`${key} occupies ${percentage.toFixed(2)}% of the total space.`);

      obj[key] = percentage.toFixed(2); // Store percentage in the object

    }

  }

  console.log(obj);

  return obj

}