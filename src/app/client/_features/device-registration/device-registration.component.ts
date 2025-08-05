import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';
import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';
import Swal from 'sweetalert2';
export class models {
  constructor(public modelname: string, public id: string) { }
}
@Component({
  selector: 'app-device-registration',
  templateUrl: './device-registration.component.html',
  styleUrls: ['./device-registration.component.scss']
})
export class DeviceRegistrationComponent implements OnInit {
  deviceModelist: any = [];
  selecetedlocation: any;
  isSelectedNeedUpgrade = false;
  isSelectedAllNeedUpgrade = false;
  isNeedUpgrade = false;
  deviceUsername: any
  submitted = false;
  count = "1";
  cityname = "";
  statename = "";
  landmark = "";
  area = "";
  pincode = "";
  routerState: any;
  isEnter = false;
  isEnterArea = false;
  selectedHrCity: any;
  cityListByStateid: any = [];
  filtercityListByStateid: any = [];
  selectedHrCountry: any;
  client: any;
  versionList: any;
  selectedDistrict: any;
  selectedPlanId: any;
  choosedCity: any;
  choosedState: any;
  choosedLocation: any;
  choosedDistrict: any;

  constructor(private formBuilder: UntypedFormBuilder, private router: Router, private tokenStorage: StorageService, private matDailog: MatDialog, private activatedRoute: ActivatedRoute, private clientService: ClientService) {

    this.routerState = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.routerState);
    
    if (this.routerState) {
      this.onSubmit()
    }
    else {
      let currentuser: any = this.tokenStorage.getClientUsername();
      // console.log(currentuser);
      this.clientService.getClientByUsername(currentuser).subscribe((res: any) => {
        this.clientDiscount = res.discount;
        this.clientid = res.id;
        this.client = res;
        this.selectedPlanId = res?.versionMaster?.id
        this.selectedLocationByPin = {
          country: res?.country?.countryname,
        }
        this.clientService.getCustomerLastDevice(res.id).subscribe((res: any) => {
          console.log(res);
          this.selectedHrState = res?.state?.statename;
          this.selectedDistrict = res?.district?.name;
          this.selectedHrCity = res.city.cityname;
          this.selecetedlocation = res.location?.area;
          this.landmark = res.landmark;
          this.deviceUsername = res?.username;
          this.clientService.getDistrictListByState(res?.state?.statename, res?.state?.id).subscribe(districtList => {
            // console.log(res);
            this.districtList = districtList;
            this.filterDistrictList = districtList;
            this.clientService.getCityListByDistrictNdState(res?.district?.name, res?.district?.id, res?.state?.id).subscribe(cityListByStateid => {
              // console.log(res);
              this.cityListByStateid = cityListByStateid;
              this.filtercityListByStateid = cityListByStateid;
              this.clientService.getLocationListByDistrictNdCityNdState(res?.city?.cityname, res?.district?.id, res?.state?.id, res?.city?.id).subscribe(locationList => {
                this.locationList = locationList;
                this.filterlocationList = locationList;
              })
            })
          })

          // this.clientService.getDistrictListByStatenameOrId(this.selectedHrState, "null").subscribe(res => {
          //   // console.log(res);
          //   this.districtList = res;
          //   this.clientService.getCityListByDistrictnameOrId(this.selectedDistrict, "null").subscribe(res => {
          //     // console.log(res);
          //     this.cityListByStateid = res;
          //     this.clientService.getLocationListByCity(this.selectedHrCity).subscribe(res => {
          //       this.locationList = res;
          //     })
          //   })
          // })

        })
      });
    }
    // console.log(this.routerState);
  }

  onRadioButtonChange1(event: any) {
    // console.log(event);
    // console.log(this.isSelectedAllNeedUpgrade);

  }

  CustomerDetails() {
    // console.log(this.form.controls['clientid'].value);
    this.clientService.getCustomerLastDevice(this.form.controls['clientid'].value).subscribe((res: any) => {
      // console.log(res);

      this.selectedHrState = res?.state?.statename;
      this.selectedDistrict = res?.district?.name;
      this.selectedHrCity = res.city.cityname;
      this.selecetedlocation = res.location?.area;
      this.landmark = res.landmark;
      this.deviceUsername = res?.username;
      this.getStateAllList(res?.clientname);
      this.clientService.getDistrictListByStatenameOrId(this.selectedHrState, "null").subscribe(res => {
        // console.log(res);
        this.districtList = res;
        this.filterDistrictList = res;
        this.clientService.getCityListByDistrictnameOrId(this.selectedDistrict, "null").subscribe(res => {
          // console.log(res);
          this.cityListByStateid = res;
          this.filtercityListByStateid = res;
          this.clientService.getLocationListByCity(this.selectedHrCity).subscribe(res => {
            this.locationList = res;
            this.filterlocationList = res;
          })
        })
      })

    })
  }
  onRadioButtonChange(event: any) {
    if (!event) {
      this.isSelectedAllNeedUpgrade = false
    }
    // console.log(this.isSelectedNeedUpgrade);
  }
  clientDiscount: number = 0;
  form: UntypedFormGroup = new UntypedFormGroup({
    landmark: new UntypedFormControl(''),
    clientid: new UntypedFormControl(''),
    // count: new FormControl(''),
    city: new UntypedFormControl(""),
    state: new UntypedFormControl(""),
    district: new UntypedFormControl(""),
    location: new UntypedFormControl(""),
    height_width: new UntypedFormControl(""),
    device: this.formBuilder.array([]),
    discount: new UntypedFormControl(this.clientDiscount),
    createdby: new UntypedFormControl("user"),
    acceptTerms: new UntypedFormControl(false),
    // zipcode:new UntypedFormControl("")
  });
  countryCtrl!: UntypedFormControl;
  clientid: any;

  countryList: any;
  filteredModels!: Observable<any[]>;
  ngOnInit(): void {
    let cuser = this.tokenStorage.getClientUsername();
    // console.log(cuser);

    this.getStateAllList(cuser);
    this.clientService.getAllCountryList().subscribe(res => {
      // console.log(res);
      this.countryList = res;
    })
    this.getPlanList();
    this.getAllDeviceModel();
    this.countryCtrl = new UntypedFormControl();
    this.filteredModels = this.countryCtrl.valueChanges.pipe(
      startWith(''),
      map((client: any) =>
        client ? this.filterClients(client) : this.modelList
      )
    );
    // console.log(this.clientDiscount);

    this.form = this.formBuilder.group(
      {
        clientid: new UntypedFormControl("", [Validators.required]),
        landmark: new UntypedFormControl(""),
        count: ['1', [Validators.required]],
        city: new UntypedFormControl("", [Validators.required]),
        state: new UntypedFormControl("", [Validators.required]),
        location: new UntypedFormControl("", [Validators.required]),
        height_width: new UntypedFormControl("9:16"),
        country: new UntypedFormControl(this.client?.country?.countryname),
        device: this.formBuilder.array([]),
        district: new UntypedFormControl(""),
        createdby: new UntypedFormControl("user"),
        // createdby: [cuser ? cuser.username : 'user'],
        android_id: new UntypedFormControl(this.routerState),
        discount: [this.clientDiscount, [Validators.required]],
        acceptTerms: [false, Validators.requiredTrue],
      }
    )

    // console.log(this.form.controls['discount'].value);

  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  getPlanList() {
    this.clientService.getCustomerVersion().subscribe((res: any) => {
      // console.log(res);
      this.versionList = res;
    })
  }
  onSelectPlan(event: any, device: any) {
    const service: UntypedFormArray = this.form?.get('device') as UntypedFormArray;
    let i: number = 0;
    service.controls.forEach((item: any) => {
      if (item.value.modelname == device.modelname) {
        item.value.versionid = event.value;
        if (event.value == 1) {
          item.value.version = "BASIC";
        } else if (event.value == 2) {
          item.value.version = "LITE";
        } else {
          item.value.version = "PRO";
        }
      }
      i++;
    });
    this.isNeedUpgradeList = [];
    this.DeviceList = this.form.controls['device'].value;
    this.DeviceList.forEach((e: any) => {
      if (this.client?.versionMaster?.id < e.versionid) {
        this.isNeedUpgradeList.push(true);
      } else {
        this.isNeedUpgradeList.push(false);
      }
    })
    this.isNeedUpgrade = this.isNeedUpgradeList.includes(true);
  }

  onSelectPlans(e: any) {
    // console.log(e);

    const service: UntypedFormArray = this.form?.get('device') as UntypedFormArray;
    let i: number = 0;
    service.controls.forEach((item: any) => {
      // console.log(item.);

      item.value.versionid = e.value;
      i++;
      return;
    });

    // console.log(this.form.value);


  }
  onChooseModel(data: any) {
    const service: UntypedFormArray = this.form?.get('device') as UntypedFormArray;
    let v: any = { device: data.modelname, count: 1, versionid: this.client?.versionMaster?.id, version: this.client?.versionMaster?.version }
    data.count = 1;
    data.versionid = 1;
    let i: number = 0;
    service.controls.forEach((item: any) => {
      service.removeAt(i);
      i++;
      return;
    });
    service.push(new UntypedFormControl(data));
    // console.log(this.form.value);

  }
  clearCountryCtrl() {
    this.countryCtrl.setValue("");

  }
  stateList: any;
  filteredStateList: any = [];
  districtList: any
  filterDistrictList: any = [];
  selectedHrState: any;
  chooseOrEnterCity() {
    this.isEnter = !this.isEnter;
  }
  chooseOrEnterArea() {
    this.isEnterArea = !this.isEnterArea;
  }
  onChooseCountry(event: any) {
    // console.log(event);
    this.stateList = []
    this.clientService.getStateListBycountryIdOrcountry(event, "null").subscribe((res: any) => {
      // console.log(res);
      this.stateList = res;
      this.filteredStateList = res;
    })
  }

  onChooseState(stateid: any) {
    this.cityListByStateid = [];
    this.locationList = [];
    this.districtList = [];
    this.selectedDistrict = null;
    this.selectedHrCity = null;
    this.selecetedlocation = null;
    this.choosedState = stateid;
    this.clientService.getDistrictListByState(stateid.statename, stateid?.id).subscribe(res => {
      // console.log(res);
      this.districtList = res;
      this.filterDistrictList = res;
    })

    // this.selectedStateId = stateid;
    // this.clientService.getDistrictListByStatenameOrId(stateid, "null").subscribe(res => {
    //   // console.log(res);
    //   this.districtList = res;
    // })

    // this.filterPlaylist(this.selectedStateId, "null", "null", "null");
  }
  onChooseDistrict(district: any) {
    this.cityListByStateid = [];
    this.locationList = [];
    this.selectedHrCity = null;
    this.selecetedlocation = null;
    this.choosedDistrict = district;
    this.clientService.getCityListByDistrictNdState(district.name, district?.id, this.choosedState?.id).subscribe(res => {
      // console.log(res);
      this.cityListByStateid = res;
      this.filtercityListByStateid = res;
    })
  }
  getStateAllList(cuser: any) {
    this.clientService.getAllStateListByClient(cuser).subscribe(res => {
      // console.log(res);
      this.stateList = res;
      this.filteredStateList = res;
    })
    // this.clientService.getAllStateList().subscribe(res => {
    //   // console.log(res);
    //   this.stateList = res;
    //   this.filteredStateList = res;
    // })
  }
  locationList: any;
  filterlocationList: any = [];
  onChooseCity(cityid: any) {
    // console.log(cityid);
    // console.log(this.selectedHrState);
    this.locationList = [];
    this.selecetedlocation = null;
    this.choosedCity = cityid;
    this.clientService.getLocationListByDistrictNdCityNdState(cityid.cityname, this.choosedDistrict?.id, this.choosedState?.id, cityid?.id).subscribe(res => {
      this.locationList = res;
      this.filterlocationList = res;
    })
    // this.clientService.getLocationListByCity(cityid).subscribe(res => {
    //   this.locationList = res;
    // })
  }
  getAddress() {
    // console.log(_zone_symbol__value);

    this.clientService.getCurrentAddress().then((e: any) => {
      // console.log(e);
      this.cityname = e.features[0].properties.state_district;
      this.statename = e.features[0].properties.state;
      this.landmark = e.features[0].properties.suburb;
      if (e.features[0].properties.city) {
        this.area = e.features[0].properties.city + "," + e.features[0].properties.suburb;
      } else {
        this.area = e.features[0].properties.suburb;
      }

    })
    // console.log(address);

  }
  isNeedUpgradeList: boolean[] = [];


  onSubmit() {
    this.submitted = true;
    // console.log(this.form.value);
    // console.log(this.isSelectedNeedUpgrade);
    // console.log(this.isSelectedAllNeedUpgrade);
    // console.log(this.isNeedUpgrade);

    this.form.removeControl('modelname');
    if (this.countryCtrl) {
      this.form.addControl('modelname', this.countryCtrl)
    } if (this.routerState) {

    } else {
      this.form.removeControl('clientid');
      if (this.clientid) {
        this.form.addControl('clientid', new UntypedFormControl(this.clientid, Validators.required))
      }
    }
    // console.log(this.form.value);
    this.form.removeControl('android_id');
    if (this.routerState) {
      this.form.addControl('android_id', new UntypedFormControl(this.routerState, Validators.required))
    } else {
      this.form.addControl('android_id', new UntypedFormControl(""))
    }
    console.log(this.form);

    if (this.form.invalid) {
      return;
    }

    this.form.addControl("isclient_upgrade", new UntypedFormControl(this.isSelectedNeedUpgrade, Validators.required))
    this.form.addControl("isupgrade_all", new UntypedFormControl(this.isSelectedNeedUpgrade, Validators.required))
    // this.isSelectedNeedUpgrade
    if (this.form.value.acceptTerms) {
      // if (this.form.valid) {
      // console.log(this.form.value);
      this.form.removeControl("acceptTerms");
      // console.log(this.form.value);
      let loader = this.matDailog.open(LoaderComponent, {
        panelClass: 'loader-upload'
      })
      this.clientService.registorDevice2(this.form.value).subscribe((res: any) => {
        loader.close();
        if (res.message == "Device registered successfully!" || res.message == "Devices are registered successfully!") {
          // this.Alert.successAlert("New Profile Created successfully!!");
          this.onReset();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: res.message,
            showConfirmButton: false,
            timer: 1500
          })
          if (!this.routerState) {
            this.router.navigate(['client/screen'])
          } else {
            window.location.reload();
          }

        } else {
          // this.Alert.errorAlert(res.message);
          if (res.message == "The Device is already Registored!") {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: res.message + ", Please Scan Another Device",
              footer: '<a >Why do I have this issue?</a>'
            })

          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: res.message,
              footer: '<a >Why do I have this issue?</a>'
            })
          }
        }
        this.form.addControl('acceptTerms', new UntypedFormControl(false));

      }, (err) => {
        loader.close();
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error.message,
          footer: '<a >Why do I have this issue?</a>'
        })
        window.location.reload();
        this.form.addControl('acceptTerms', new UntypedFormControl(false));
      })
    }
    else {


    }
  }
  modelList1: any = [];
  saveThis(id: any) {
    let v: any = document.getElementById(id + "SAVE");
    let btn: any = document.getElementById("save" + id);
    v.innerText = "saved";
    // v!.style!.border = "1px green solid";
    v.style!.margin = "0px 0px 0px 5px";
    v.style!.backgroundColor = "green";
    v.style!.color = "white";
    v.style!.padding = "2px";
    v!.style!.display = "block";
    btn!.style!.display = "none";
    setTimeout(function () {
      v.innerText = "";
      v!.style!.display = "none";
      btn!.style!.display = "block"
    }, 1000);

  }
  modelList: models[] | any;
  getAllDeviceModel() {
    this.clientService.getAllDeviceModel().subscribe((res: any) => {
      // console.log(res);
      this.modelList = res;
      this.filteredModels = this.countryCtrl.valueChanges.pipe(
        startWith(''),
        map((client: any) =>
          client ? this.filterClients(client) : Slice(this.modelList)
        )
      );
    })
    this.clientService.getDevieceBymodelwise().subscribe((res: any) => {
      // console.log(res);

      this.modelList1 = res;
    });
  }
  DeviceList: any = [{
    "id": 12,
    "modelname": "unknown",
    count: 0,
    price: 10
  }]
  // onCheckboxChange(e: any, model: any) {
  //   const service: FormArray = this.form?.get('device') as FormArray;
  //   console.log(e.target?.value);
  //   if (e.target?.value) {
  //     let i: number = 0;
  //     service.controls.forEach((item: any) => {
  //       if (item.value.modelname == model.modelname) {
  //         service.removeAt(i);
  //         model.count = e.target?.value;
  //         service.push(new FormControl(model));
  //       }
  //       i++;
  //     });

  //   } else {
  //     if (e.checked) {
  //       model.count = "1";
  //       service.push(new FormControl(model));
  //     } else {
  //       let i: number = 0;
  //       service.controls.forEach((item: any) => {
  //         if (item.value.modelname == model.modelname) {
  //           service.removeAt(i);
  //           return;
  //         }
  //         i++;
  //       });
  //     }
  //   }
  //   this.DeviceList = this.form.controls['device'].value;
  //   console.log(this.DeviceList);

  //   this.totalAmount1 = 0;
  //   this.totalAmount = 0;
  //   this.DeviceList.forEach((e: any) => {
  //     let v: number = e.count * e.price;
  //     this.totalAmount = this.totalAmount + v;
  //     this.totalAmount1 = this.totalAmount.toFixed(2);
  //   })
  //   this.FinaltotalAmount = ((this.totalAmount1 / 100) * this.form.controls['discount'].value).toFixed(2);
  // }

  onCheckboxChange(e: any, model: any) {
    const service: UntypedFormArray = this.form?.get('device') as UntypedFormArray;
    // console.log(e);
    // console.log(service);
    // console.log(model);
    // if (e.type == "keyup" || e.type == "keydown" && e.target.value.length > 0) {
    // e.keyCode != 38;
    // e.keyCode != 40;
    // e.preventDefault();
    // }
    if (e.target?.value) {
      let i: number = 0;
      service?.controls.forEach((item: any) => {
        if (item.value.modelname == model.modelname) {
          service.removeAt(i);
          model.count = e.target?.value;
          model.versionid = this.client?.versionMaster?.id
          model.version = this.client?.versionMaster?.version;
          service.push(new UntypedFormControl(model));
        }
        i++;
      });

    } else {
      if (e.checked) {
        let v = e.source._elementRef.nativeElement?.parentElement?.parentElement?.parentElement?.parentElement?.children[1]?.children[0]?.children[0]?.children[0]?.children[0];
        model.count = v.value;
        model.versionid = this.client?.versionMaster?.id
        model.version = this.client?.versionMaster?.version;
        service.push(new UntypedFormControl(model));
      } else if (e.type == 'keydown') {

      }
      else {
        let i: number = 0;
        service?.controls.forEach((item: any) => {
          if (item.value.modelname == model.modelname) {
            service.removeAt(i);
            return;
          }
          i++;
        });
        let v = e.source._elementRef.nativeElement?.parentElement?.parentElement?.parentElement?.parentElement?.children[1]?.children[0]?.children[0]?.children[0]?.children[0]
        v.value = 1;
      }
    }
    // console.log(this.form.controls['device'].value);

    this.DeviceList = this.form.controls['device'].value;
    // console.log(this.DeviceList);
    this.totalAmount1 = 0;
    this.totalAmount = 0;
    this.totalquantity = 0;

    this.isNeedUpgradeList = []
    this.DeviceList.forEach((e: any) => {
      var actualNumber = parseInt(e.count);
      this.totalquantity = this.totalquantity + actualNumber;
      let v: number = e.count * e.price;
      this.totalAmount = this.totalAmount + v;
      this.totalAmount1 = this.totalAmount.toFixed(2);
      if (this.client?.versionMaster?.id < e.versionid) {
        this.isNeedUpgradeList.push(true);
      } else {
        this.isNeedUpgradeList.push(false);
      }
    })
    this.isNeedUpgrade = this.isNeedUpgradeList.includes(true);
    this.FinaltotalAmount = ((this.totalAmount1 / 100) * this.form.controls['discount'].value).toFixed(2);
  }
  FinaltotalAmount: any = 0;
  totalquantity: number = 0;
  totalAmount1: any = 0;
  totalAmount = 0;
  mathRound(data: any) {
    // this.totalAmount = ;
    return parseFloat(data).toFixed(2);;
  }
  // console.log(address);

  discountCalculator(e: any) {
    // console.log(e);
    this.FinaltotalAmount = ((this.totalAmount1 / 100) * this.form.controls['discount'].value).toFixed(2);
  }
  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  filterClients(username: string) {
    let arr = this.modelList.filter(
      (client: any) => client.modelname.toLowerCase().indexOf(username.toLowerCase()) === 0
    );
    return arr.length ? arr : [{ modelname: 'No Item found', code: 'null' }];
  }
  openImage(event: any, model: any) {
    Swal.fire({
      title: "Model : " + model?.model,
      // text: "Size : " + model?.size + " inchs. price : " + model?.price +"Rs",
      // text: "Size : " + model?.list?.size + " inchs",
      imageUrl: event?.target?.src,
      imageWidth: '100%',
      imageHeight: '100%',
      // timer: 2000,
      imageAlt: "Custom image"
    });
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

  selectedLocationByPin: any;
  selectLocationByPin(loc: any) {
    this.selectedLocationByPin = loc
    this.form.get("state")?.setValue(loc.state)
    this.form.get("city")?.setValue(loc.city)
    this.form.get("district")?.setValue(loc.district)
    this.form.get("country")?.setValue(loc.country.toUpperCase())
  }
  onKeydown(e: any) {
    if (e.target.value.length === e.target.maxLength) {
      // e.stopPropagation();
      // e.preventDefault();
      if (e.keyCode === 8 ||
        e.keyCode === 46 ||
        e.keyCode === 39 ||
        e.keyCode === 37) {
        return true;
      }
      return false;
    }
    return true;
  }
  locationsByPincodeList = []
  getLocationByPincode(e: any) {
    if (this.form.get("country")?.value != "INDIA" && this.form.get("country")?.value != "India") {
      this.selectedLocationByPin = ""
      this.locationsByPincodeList = []
      if (3 < e.target.value.length) {
        this.clientService.getLocationByPincode(e.target.value).subscribe((res: any) => {
          this.locationsByPincodeList = res;
        })
      }
    }
  }
}
function Slice(list: any) {
  // console.log(list);onQuickFilterChanged
  let clientList: [] = list.slice()
  return clientList;
}