import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { VERSION } from 'ag-charts-community';
import { City, Country, State } from 'country-state-city';
import { saveAs } from 'file-saver';
import { Observable, from, map, startWith } from 'rxjs';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';
import { AlertService } from 'src/app/_core/services/alert.service';
import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';
import Validation from 'src/app/_core/utils/validation';
import { clienturl } from 'src/app/api-base';
import Swal from 'sweetalert2';
export class distributor {
  constructor(public distributor: string, public id: string) { }
}
const BASE_API = clienturl.WEB_URL();
@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss']
})
export class NewClientComponent implements OnInit {
  currentDate = new Date().toISOString().split("T")[0];
  selectedPremium: any = false;
  selectedMbc: any = false;
  selectedType: any;
  deviceModelist: any = [
  ]
  choosedCity: any;
  choosedState: any;
  choosedLocation: any;
  choosedDistrict: any;
  isShow = false;
  countryName = "India";
  cityName = "";
  locationName = "";
  locationList: any = []
  stateName = "";
  distributorName: any;
  countryCtrl!: UntypedFormControl;
  isDistributor = false;
  filteredDistributors!: Observable<any[]>;
  gridApi: any;
  isEnter = true;
  clientList!: distributor[] | any;
  selectedContactInfo!: number[];
  @ViewChild('country') country!: ElementRef
  @ViewChild('city') city!: ElementRef
  @ViewChild('state') state!: ElementRef
  @ViewChild('location') location!: ElementRef

  // name = 'Angular ' + VERSION.major;
  countries = Country.getAllCountries();
  states: any = null;
  cities: any = null;

  selectedCountry: any = 1;
  selectedState: any;
  selectedCity: any;
  distributorpremium: any
  routerState: any;
  submitted = false;
  planVersionList: any;
  selectedPlanId: number = 1;
  divice: any;
  isAndroid: any;
  newCustomer: any;
  expiry: any;
  constructor(private formBuilder: UntypedFormBuilder, private alertService: AlertService, private activatedRoute: ActivatedRoute, private matDialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private clientService: ClientService, private storageService: StorageService) {
    this.routerState = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.routerState);
    this.newCustomer = data
    this.selectedType = data?.type;
    this.distributor = data.distributorid;
    this.distributorName = data.distributor;
    this.isAndroid = this.activatedRoute.snapshot.paramMap.get('m');
    this.expiry = this.activatedRoute.snapshot.paramMap.get('expiry');
    if (this.expiry) {
      clientService.checkRegistrationFormStatusByCode(this.expiry).subscribe((res: any) => {
        // console.log(res);
        if (res?.isexpired) {
          router.navigate(['/expired'])
        }
      }, err => {
        router.navigate(['/expired'])
      })
    }
    console.log(this.expiry);
    if (this.routerState) {
      this.getDistributorById(this.routerState);
      this.onSubmit()
    }
    // console.log(this.routerState);
    // this.onCountryChange("W");
  }
  choosedStateId: any;
  choosedDistrictId: any;
  choosedCityId: any;
  choosedLocationname: any;
  ngOnInit(): void {
    let user: any = this.storageService.getUser();

    this.getAllClientList();
    this.getCustomerVersion();
    this.getAllCountryList();
    // console.log(this.router);
    this.countryCtrl = new UntypedFormControl();

    this.selectedPlanId = 1;
    this.filteredDistributors = this.countryCtrl.valueChanges.pipe(
      startWith(''),
      map((client: any) =>
        client ? this.filterClients(client) : this.clientList
      )
    );

    this.clientService.getStateListByCountrynameOrId("INDIA", "NULL").subscribe((res: any) => {
      this.stateList = res;
    })

    this.form = this.formBuilder.group(
      {
        fname: [this.newCustomer?.fname ? this.newCustomer?.fname : '', [Validators.required]],
        lname: [this.newCustomer?.lname ? this.newCustomer?.lname : ''],
        username: [
          this.newCustomer?.username ? this.newCustomer?.username : '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(20),
          ],
        ],
        company: [this.newCustomer?.country],
        email: [this.newCustomer?.email ? this.newCustomer?.email : '', [Validators.required, Validators.email]],
        password: [
          this.newCustomer?.password ? this.newCustomer?.password : '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
            strong
          ],
        ],
        code: [this.expiry ? this.expiry : null],
        phone: [this.newCustomer?.phone ? this.newCustomer?.phone : '', [
          Validators.required,
          // Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern(/^\d+$/)
        ]],
        ismbc: [false],
        phone2: [this.newCustomer?.phone2 ? this.newCustomer?.phone2 : ''],
        gender: [this.newCustomer?.gender ? this.newCustomer?.gender : ''],
        zip: [this.newCustomer?.zipcode ? this.newCustomer?.zipcode : '', [Validators.required,
        Validators.minLength(3),
        ]],
        location: [this.newCustomer?.location],
        ispremium: [this.newCustomer?.ispremium ? this.newCustomer?.ispremium : false],
        dob: [this.newCustomer?.dob ? this.newCustomer?.dob : ''],
        device: this.formBuilder.array([[]]),
        discount: [0, [Validators.required]],
        versionid: ['1'],
        createdby: user ? user?.username : 'user',
        gst_no: new UntypedFormControl(this.newCustomer?.gst_no ? this.newCustomer?.gst_no : '', [Validators.required]),
        tan_no: new UntypedFormControl(this.newCustomer?.tan_no ? this.newCustomer?.tan_no : ''),
        acceptTerms: [this.newCustomer?.username ? true : false, Validators.requiredTrue],
      }

    );



    if (this.newCustomer?.username) {
      this.selectedstaten = this.newCustomer?.state;
      this.choosedState = this.newCustomer?.stateobj;
      this.choosedCity = this.newCustomer?.cityobj;
      this.choosedDistrict = this.newCustomer?.districtobj;
      this.choosedLocation = this.newCustomer?.locationobj;
      this.choosedStateId = this.newCustomer?.stateobj?.id;
      this.choosedCityId = this.newCustomer?.cityobj?.id;
      this.choosedDistrictId = this.newCustomer?.districtobj?.id;
      this.locationName = this.newCustomer?.location;
      this.selectedPlanId = this.newCustomer?.versionobj?.id;
      this.selectedCountryn = this.newCustomer?.country;
      const service: UntypedFormArray = this.form?.get('device') as UntypedFormArray;
      this.selectedLocationByPin = this.newCustomer
      service.clear();
      this.newCustomer?.devicelist.forEach((e: any) => {
        console.log(e);
        // console.log(service);
        // service.removeAt(0)
        service.push(new UntypedFormControl(e));

      }
      )

      this.clientService.getDistrictListByState(this.newCustomer?.state, this.newCustomer?.stateobj?.id).subscribe((res: any) => {
        this.districtList = res;
        this.selecteddistrictn = this.newCustomer?.district;
        // console.log(district.target.value);
        this.clientService.getCityListByDistrictNdState(this.newCustomer?.district, this.newCustomer?.districtobj?.id, this.newCustomer?.stateobj?.id).subscribe((res: any) => {
          this.cityList = res;
          this.cityName = this.newCustomer?.city;
          this.clientService.getLocationListByDistrictNdCityNdState(this.choosedCity?.cityname, this.choosedDistrict?.id, this.choosedState?.id, this.choosedCity?.id).subscribe(res => {
            this.locationList = res;
          })
        });
      });
      this.modelList1 = this.newCustomer?.device_model_list;
      this.DeviceList = this.form.controls['device'].value;
      this.totalAmount1 = 0;
      this.totalAmount = 0;
      this.totalquantity = 0
      this.DeviceList.forEach((e: any) => {
        // let n :number=e.count
        if (e) {
          var actualNumber = parseInt(e?.count);
          this.totalquantity = this.totalquantity + actualNumber;
          // console.log(e.count);

          let v: number = e?.count * e?.price;
          this.totalAmount = this.totalAmount + v;
          this.totalAmount1 = this.totalAmount.toFixed(2);
        }

      })
      this.FinaltotalAmount = ((this.totalAmount1 / 100) * this.form.controls['discount'].value).toFixed(2);

    } else {
      this.getDeviceModelList();
    }
    this.selectedPlanId = this.form.value.versionid;
    this.states = State.getStatesOfCountry("IN");
    this.selectedCountry = {
      "name": "India",
      "isoCode": "IN",
      "flag": "🇮🇳",
      "phonecode": "91",
      "currency": "INR",
      "latitude": "20.00000000",
      "longitude": "77.00000000",
      "timezones": [
        {
          "zoneName": "Asia/Kolkata",
          "gmtOffset": 19800,
          "gmtOffsetName": "UTC+05:30",
          "abbreviation": "IST",
          "tzName": "Indian Standard Time"
        }
      ]
    };


    this.cities = this.selectedState = this.selectedCity = null;
    // console.log(this.selectedCountry);
    this.countryName = this.selectedCountry.name;
    this.stateName = "";
    this.cityName = "";
    // console.log(this.storageService.getUserRole());
    if (this.storageService.getUserRole() == "DISTRIBUTOR" || this.storageService.getDistributor()?.roles[0] == "ROLE_DISTRIBUTOR") {
      this.isDistributor = true;
      let user = this.storageService.getUser();
      if (user.roles[0] == "ROLE_DISTRIBUTOR") {
        this.clientService.getdistributorByUsername(user.username).subscribe((res: any) => {
          // console.log(res);
          this.distributorpremium = res?.ispremium
          this.distributor = res.id;

        })
      } else {
        user = this.storageService.getDistributor()
        this.clientService.getdistributorByUsername(user.username).subscribe((res: any) => {
          // console.log(res);
          this.distributorpremium = res?.ispremium
          this.distributor = res.id;

        })
      }

    } else {
      this.isDistributor = false;
    }
    if (this.storageService.getDistributor()?.roles[0] == "ROLE_DISTRIBUTOR") {
      this.isAdmin = false;
    } else {
      this.isAdmin = true;
    }
    // console.log(this.isAdmin);




  }
  onChooseSelectedType(event: any) {
    // console.log(this.selectedType);
    // console.log(event);
    this.selectedType = event.value
  }
  getCustomerVersion() {
    this.clientService.getCustomerVersion().subscribe((res: any) => {
      // console.log(res);
      this.planVersionList = res;
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

  }
  // onCountryChange(Event: any): void {
  //   console.log(this.country.nativeElement.value);
  //   this.states = State.getStatesOfCountry(JSON.parse(this.country.nativeElement.value).isoCode);
  //   this.selectedCountry = JSON.parse(this.country.nativeElement.value);
  //   this.cities = this.selectedState = this.selectedCity = null;
  //   console.log(this.selectedCountry);
  //   this.countryName = this.selectedCountry.name;
  //   this.stateName = "";
  //   this.cityName = "";
  // }
  onCountryChange(Event: any): void {
    // console.log(this.country.nativeElement.value);
  }
  DeviceList: any = []

  onCheckboxChange(e: any, model: any) {

    const service: UntypedFormArray = this.form?.get('device') as UntypedFormArray;
    // console.log(e.type);
    // console.log(model);
    // if (e.type == "keyup" || e.type == "keydown" && e.target.value.length == 1) {
    //   e.keyCode != 38;
    //   e.keyCode != 40;
    //   e.preventDefault();
    // }


    if (e.target?.value) {
      let i: number = 0;
      service.controls.forEach((item: any) => {
        console.log(item);

        if (item?.value?.modelname === model.modelname) {
          service.removeAt(i);
          model.count = e.target?.value;
          model.versionid = this.selectedPlanId;
          if (this.selectedPlanId == 1) {
            item.value.version = "BASIC";
          } else if (this.selectedPlanId == 2) {
            item.value.version = "LITE";
          } else {
            item.value.version = "PRO";
          }
          service.push(new UntypedFormControl(model));
        }
        i++;
      });

    } else {
      if (e.checked) {
        let v = e.source._elementRef.nativeElement?.parentElement?.parentElement?.parentElement?.parentElement?.children[1]?.children[0]?.children[0]?.children[0]?.children[0];
        model.count = v.value;
        model.versionid = this.selectedPlanId;
        if (this.selectedPlanId == 1) {
          model.version = "BASIC";
        } else if (this.selectedPlanId == 2) {
          model.version = "LITE";
        } else {
          model.version = "PRO";
        } let i: number = 0;
        service.controls.forEach((item: any) => {
          console.log(item);
          if (!item.value) {
            service.removeAt(i);
          }
          i++;
        });
        service.push(new UntypedFormControl(model));
      } else if (e.type == "keydown") {

      }
      else {
        let i: number = 0;
        service.controls.forEach((item: any) => {
          if (item?.value?.modelname == model.modelname) {
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
    console.log(this.DeviceList);

    this.totalAmount1 = 0;
    this.totalAmount = 0;
    this.totalquantity = 0
    this.DeviceList.forEach((e: any) => {
      // let n :number=e.count
      if (e) {
        var actualNumber = parseInt(e?.count);
        this.totalquantity = this.totalquantity + actualNumber;
        // console.log(e.count);

        let v: number = e?.count * e?.price;
        this.totalAmount = this.totalAmount + v;
        this.totalAmount1 = this.totalAmount.toFixed(2);
      }

    })
    this.FinaltotalAmount = ((this.totalAmount1 / 100) * this.form.controls['discount'].value).toFixed(2);
  }
  totalquantity: number = 0;
  FinaltotalAmount: any = 0;
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
  // onStateChange(event: any): void {
  //   this.cities = City.getCitiesOfState(JSON.parse(this.country.nativeElement.value).isoCode, JSON.parse(this.state.nativeElement.value).isoCode)
  //   this.selectedState = JSON.parse(this.state.nativeElement.value);
  //   this.selectedCity = null;
  //   // console.log(this.selectedState);
  //   this.stateName = this.selectedState.name;
  //   this.cityName = "";
  // }
  onStateChange(event: any): void {
    this.cities = []
    // this.cities = City.getCitiesOfState("IN", JSON.parse(this.state.nativeElement.value).isoCode)
    this.clientService.getCityListByStateIdOrState("null", JSON.parse(this.state.nativeElement.value).name).subscribe(res => {
      // console.log(res);
      this.cities = res;
    })
    this.selectedState = JSON.parse(this.state.nativeElement.value);
    this.selectedCity = null;
    // console.log(this.cities);
    // console.log(this.selectedState);
    this.stateName = this.selectedState.name;
    this.cityName = "";
    // this.selectedStateId = stateid;
  }
  onChooseDistributor(data: any) {
    // console.log(data);
    this.distributor = data.id;

  }
  clearCountryCtrl() {
    this.countryCtrl.setValue("");

  }
  modelList1: any = [];
  getDeviceModelList() {
    this.clientService.getAllDeviceModel().subscribe((res: any) => {
      // console.log(res);
      this.deviceModelist = res;
    });
    this.clientService.getDevieceBymodelwise().subscribe((res: any) => {
      // console.log(res);
      this.modelList1 = res;
    });
  }
  getDistributorById(id: any) {
    this.clientService.getDistributorById(id).subscribe((res: any) => {
      // console.log(res);
      this.distributorName = res.distributor;

    })
  }
  getAllClientList() {
    this.clientService.getDistibutor().subscribe((res: any) => {
      // console.log(res);
      this.clientList = res;
      this.filteredDistributors = this.countryCtrl.valueChanges.pipe(
        startWith(''),
        map((client: any) =>
          client ? this.filterClients(client) : Slice(this.clientList)
        )
      );
    })
  }
  filterClients(username: string) {
    let arr = this.clientList.filter(
      (client: any) => client.distributor.toLowerCase().indexOf(username.toLowerCase()) === 0
    );

    return arr.length ? arr : [{ distributor: 'No Item found', code: 'null' }];
  }
  onCityChange(event: any): void {
    // console.log(event.target.value);
    this.locationList = [];
    this.choosedCity = this.cityList.find((e: any) => e.id == event.target.value);
    this.cityName = this.choosedCity?.cityname;
    // console.log(this.cityName);
    this.clientService.getLocationListByDistrictNdCityNdState(this.choosedCity?.cityname, this.choosedDistrict?.id, this.choosedState?.id, this.choosedCity?.id).subscribe(res => {
      this.locationList = res;
    })
    // this.selectedCity = JSON.parse(this.city.nativeElement.value)
    // console.log(this.selectedCity);
    // this.cityName = event?.target.value;
    // this.clientService.getLocationListByCity(this.cityName).subscribe(res => {
    //   this.locationList = res;
    // })
  }
  onChooseLocation(event: any) {
    this.locationName = event.target.value
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
  onRadioButtonChange(event: any) {
    // console.log(event);
    this.selectedPremium = event?.value
  }
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
  distributor: any;
  form: UntypedFormGroup = new UntypedFormGroup({
    fname: new UntypedFormControl(''),
    lname: new UntypedFormControl(''),
    username: new UntypedFormControl(''),
    email: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
    company: new UntypedFormControl(''),
    phone: new UntypedFormControl(''),
    gender: new UntypedFormControl(""),
    zip: new UntypedFormControl(''),
    location: new UntypedFormControl(''),
    // city: new FormControl(this.cityName),
    // state: new FormControl(this.stateName),
    // country: new FormControl(this.countryName),
    dob: new UntypedFormControl(''),
    acceptTerms: new UntypedFormControl(false),
  });
  isAdmin = true;
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  countryList: any;
  stateList: any;
  districtList: any;
  cityList: any;
  selectedCountryn: any = "";
  selectedstaten: any
  selecteddistrictn: any;
  getAllCountryList() {
    this.clientService.getAllCountryList().subscribe((res: any) => {
      this.countryList = res;
      // console.log(res);

    })
  }
  getStateListByCountrynameOrId(country: any) {
    this.selectedCountryn = country.target.value;
    // console.log(country.target.value);

    this.clientService.getStateListByCountrynameOrId(country.target.value, "NULL").subscribe((res: any) => {
      this.stateList = res;
    })
    this.getLocationByPincode({ target: { value: "" } })
    this.form.get("zip")?.setValue("")
  }
  getDistrictListByStatenameOrId(state: any) {

    // console.log(state.target.value);
    this.choosedState = this.stateList.find((e: any) => e.id == state.target.value);
    // console.log(this.choosedState);
    this.districtList = [];
    this.cityList = [];
    this.locationList = [];
    this.selectedstaten = this.choosedState.statename;
    // console.log(state.target.value);
    this.clientService.getDistrictListByState(this.choosedState?.statename, this.choosedState?.id).subscribe((res: any) => {
      this.districtList = res;
    })
    // console.log(state.target.value);
    // const selectedState = this.stateList.find((e: any) => e.id == state.target.value);
    // console.log(selectedState);

    // // this.selectedstaten = selectedState.statename;
    // // console.log(state.target.value);
    // this.clientService.getDistrictListByStatenameOrId(selectedState.statename, selectedState.id).subscribe((res: any) => {
    //   this.districtList = res;
    // })
    // this.selectedstaten = state.target.value;
    // // console.log(state.target.value);

    // this.clientService.getDistrictListByStatenameOrId(state.target.value, "null").subscribe((res: any) => {
    //   this.districtList = res;
    // })
  }
  isCopied = false;
  copyText() {
    console.log(this.distributor);
    this.clientService.getRegistrationFormExpirycode().subscribe((res: any) => {
      this.isCopied = true;
      let val = BASE_API + "/#/newcustomerregistration/" + this.distributor + '/' + res?.code;
      let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      let c = document.execCommand('copy');
      if (c) {
        this.alertService.showSuccess('copied to clipboard')
      } else {
        this.alertService.showError('Try after some Time')
      }
      document.body.removeChild(selBox);
      const myTimeout = setTimeout(() => {
        this.isCopied = false;
        clearTimeout(myTimeout);
      }, 5000);
    }, err => {
      this.alertService.showError(err?.error?.message);
      this.alertService.showError('Please, Try after some Time');
    })
    // this.isCopied = true;
    // let val = BASE_API + "/#/newcustomerregistration/" + this.distributor + '/' + 1;
    // let selBox = document.createElement('textarea');
    // selBox.style.position = 'fixed';
    // selBox.style.left = '0';
    // selBox.style.top = '0';
    // selBox.style.opacity = '0';
    // selBox.value = val;
    // document.body.appendChild(selBox);
    // selBox.focus();
    // selBox.select();
    // document.execCommand('copy');
    // document.body.removeChild(selBox);
    // const myTimeout = setTimeout(() => {
    //   this.isCopied = false;
    //   clearTimeout(myTimeout);
    // }, 5000);
  }
  getCityListByDistrictnameOrId(district: any) {
    this.cityList = [];
    this.locationList = [];
    this.choosedDistrict = this.districtList.find((e: any) => e.id == district.target.value);
    this.selecteddistrictn = this.choosedDistrict?.name;
    // console.log(district.target.value);
    this.clientService.getCityListByDistrictNdState(this.choosedDistrict?.name, this.choosedDistrict?.id, this.choosedState?.id).subscribe((res: any) => {
      this.cityList = res;
    })
    // const selectedDistrict = this.districtList.find((e: any) => e.id == district.target.value);
    // this.selecteddistrictn = selectedDistrict.name;
    // // console.log(district.target.value);
    // this.clientService.getCityListByDistrictnameOrId(selectedDistrict.name, selectedDistrict.id).subscribe((res: any) => {
    //   this.cityList = res;
    // })

    // this.selecteddistrictn = district.target.value;
    // // console.log(district.target.value);
    // this.clientService.getCityListByDistrictnameOrId(district.target.value, "null").subscribe((res: any) => {
    //   this.cityList = res;
    // })
  }
  selectedLocationByPin: any;
  selectLocationByPin(loc: any) {
    this.selectedLocationByPin = loc
    this.selectedstaten = loc.state
    this.cityName = loc.city
    this.selecteddistrictn = loc.district
    this.selectedCountryn = loc.country.toUpperCase();

    this.locationName = loc?.location ? loc?.location : ""
    this.form.get("location")?.setValue(this.locationName)

    console.log(this.form.value);

  }
  onSubmit(): void {
    // this.submitted = true;
    // console.log(this.distributor);
    // console.log(this.stateName);
    // console.log(this.countryName);
    // console.log(this.cityName);
    this.form.removeControl('state');
    this.form.removeControl('city');
    this.form.removeControl('country');
    this.form.removeControl('distributorid');
    this.form.removeControl('location');
    this.form.removeControl('district');
    // if (this.stateName) {
    //   this.form.addControl('state', new FormControl(this.stateName, Validators.required))
    // } 
    if (this.selectedstaten) {
      this.form.addControl('state', new UntypedFormControl(this.selectedstaten, Validators.required))
    }
    if (this.routerState) {
      this.form.addControl('distributorid', new UntypedFormControl(this.routerState, Validators.required))
    } else {
      if (this.distributor) {
        this.form.addControl('distributorid', new UntypedFormControl(this.distributor, Validators.required))
      }
    }
    if (this.locationName) {
      this.form.addControl('location', new UntypedFormControl(this.locationName, Validators.required))
    }
    if (this.cityName) {

      this.form.addControl('city', new UntypedFormControl(this.cityName, Validators.required))
    }
    if (this.selecteddistrictn) {

      this.form.addControl('district', new UntypedFormControl(this.selecteddistrictn, Validators.required))
    }
    if (this.selectedCountryn) {
      this.form.addControl('country', new UntypedFormControl(this.selectedCountryn, Validators.required))
    }
    if (this.selectedType) {
      this.form.addControl('type', new UntypedFormControl(this.selectedType, Validators.required));
      if (this.selectedType == 'organization') {
        this.form.removeControl('lname');
        this.form.removeControl('dob');
        this.form.removeControl('company');
        this.form.addControl('lname', new UntypedFormControl('null'));
      } else {
        this.form.removeControl('gst_no');
        this.form.removeControl('tan_no');
      }
    }
    // console.log(this.form.valid);
    // console.log(this.form.value.device?.length != 0);

    // console.log(JSON.stringify(this.form.value, null, 2));
    this.submitted = true;
    // console.log(this.form.invalid);
    if (!this.form.value.createdby) {
      if (this.isAndroid) {
        this.form.value.createdby = this.isAndroid;
      } else {
        this.form.value.createdby = "user";
      }
    }
    console.log(this.form);

    if (this.form.invalid) {
      return;
    }

    // console.log(this.form.value.acceptTerms);

    if (this.form.value.acceptTerms && this.form.value.device?.length != 0) {
      // if (this.form.valid) {
      let loader = this.matDialog.open(LoaderComponent, {
        panelClass: 'loader-upload'
      })
      if (this.newCustomer?.username) {
        this.form.addControl('complaintid', new UntypedFormControl(this.newCustomer?.complaintid, Validators.required));
        this.form.addControl('id', new UntypedFormControl(this.newCustomer?.id, Validators.required))
        this.clientService.updateComplaintforClientNdDeviceCreation(this.form.value).subscribe((res: any) => {
          // this.onReset();
          loader.close();

          if (res?.message) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: res.message,
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            // this.Alert.errorAlert(res.message);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: res?.message,
              footer: '<a >Why do I have this issue?</a>'
            })
          }
          var v = setTimeout(() => {
            window.location.reload();
            clearTimeout(v);
          }, 1500)
        }, (err) => {
          // console.log(err.error.message);
          loader.close();
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err?.error?.message,
            footer: '<a >Why do I have this issue?</a>'
          })
        })
      } else {
        this.clientService.createClient(this.form.value).subscribe((res: any) => {
          this.onReset();
          loader.close();
          if (res?.message) {
            // this.Alert.successAlert("New Profile Created successfully!!");

            if (this.routerState) {
              Swal.fire({
                title: 'Thank You!!',
                text: "Our iqworld team welcomes you to our family!!, kindly contact the distributor for you account activation",
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(["login"])
                }
              })
            } else {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: res.message,
                showConfirmButton: false,
                timer: 1500
              });
              if (this.isAndroid) {
                window.location.reload()
              } else {
                if (this.isDistributor) {
                  this.router.navigate(['distributor/distributor-pending-approval']);
                } else {
                  this.router.navigate(['admin/client-list']);
                }
              }
            }
          } else {
            // this.Alert.errorAlert(res.message);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: res?.message,
              footer: '<a >Why do I have this issue?</a>'
            })
          }

        }, (err) => {
          // console.log(err.error.message);
          loader.close();
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err?.error?.message,
            footer: '<a >Why do I have this issue?</a>'
          })
        })
      }
    }
    else {
      if (this.form.value.device?.length == 0) {
        this.alertService.showInfo('please select atleat one device')
      }
      // }
    }
  }
  chooseOrEnterCity() {
    this.isEnter = !this.isEnter;
  }
  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
  clear(type: string): void {
    switch (type) {
      case 'country':
        this.selectedCountry = this.country.nativeElement.value = this.states = this.cities = this.selectedState = this.selectedCity = null;
        break;
      case 'state':
        this.selectedState = this.state.nativeElement.value = this.cities = this.selectedCity = null;
        break;
      case 'city':
        this.selectedCity = this.city.nativeElement.value = null;
        break;
    }
  }
  showPassword() {
    let doc: any = document.getElementById('password');
    // console.log(doc);
    doc.type = "text";
    this.isShow = true;
  }
  hidePassword() {
    let doc: any = document.getElementById('password');
    // console.log(doc);
    doc.type = "password";
    this.isShow = false;
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
  locationsByPincodeList = []
  getLocationByPincode(e: any) {
    if (this.selectedCountryn != "INDIA" && this.selectedCountryn != "India") {
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

function strong(control: UntypedFormControl): any {
  let hasNumber = /\d/.test(control.value);
  let hasUpper = /[A-Z]/.test(control.value);
  let hasLower = /[a-z]/.test(control.value);
  // console.log('Num, Upp, Low', hasNumber, hasUpper, hasLower);
  const valid = hasNumber && hasUpper && hasLower;
  if (!valid) {
    // return what´s not valid
    return { strong: true };
  }
  return null;
}
function Slice(list: any) {
  // console.log(list);onQuickFilterChanged
  let clientList: [] = list.slice()
  return clientList;
}
