import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'console';
import { City, Country, State } from 'country-state-city';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';
import { AlertService } from 'src/app/_core/services/alert.service';

import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';
import { clienturl } from 'src/app/api-base';
import Swal from 'sweetalert2';
const BASE_API = clienturl.WEB_URL();
@Component({
  selector: 'app-new-distibutor',
  templateUrl: './new-distibutor.component.html',
  styleUrls: ['./new-distibutor.component.scss']
})
export class NewDistibutorComponent implements OnInit {
  submitted = false;
  isShow = false;
  cityname = "";
  selectedType: any;
  statename = "";
  countryName = "India";
  cityName = "";
  locationName = "";
  stateName = "";
  area = "";
  isEnter = true;
  pincode = "";
  locationList: any;
  choosedCity: any;
  choosedState: any;
  choosedLocation: any;
  choosedDistrict: any;
  @ViewChild('country') country!: ElementRef
  @ViewChild('city') city!: ElementRef
  @ViewChild('state') state!: ElementRef
  // name = 'Angular ' + VERSION.major;
  countries = Country.getAllCountries();
  states: any = null;
  cities: any = null;

  selectedCountry: any;
  selectedState: any;
  selectedCity: any;
  selectedStateId: any;
  selectedDstrictId: any;
  selectedCityId: any;
  selectedLocation: any;
  isAndroid: any;
  expiry: any;
  newdistributor: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private activatedRoute: ActivatedRoute, private formBuilder: UntypedFormBuilder, private alertService: AlertService, private storageService: StorageService, private matDialog: MatDialog, private clientService: ClientService, private router: Router) {
    this.isAndroid = this.activatedRoute.snapshot.paramMap.get('id');
    this.expiry = this.activatedRoute.snapshot.paramMap.get('expiry');
    if (data.username) {
      this.newdistributor = data;
      this.selectedType = data?.type;
      this.selectedStateId = this.newdistributor?.stateobj?.id;
      this.selectedDstrictId = this.newdistributor?.districtobj?.id;
      this.selectedCityId = this.newdistributor?.cityobj?.id;
      this.selectedLocation = this.newdistributor?.locationobj?.area;
    }
    console.log(this.newdistributor);
    if (this.expiry) {
      clientService.checkRegistrationFormStatusByCode(this.expiry).subscribe((res: any) => {
        // console.log(res);
        if (res?.isexpired) {
          router.navigate(['/expired'])
        }
      })
    } else {
      // router.navigate(['/expired'])
    }

  }
  isCopied = false;
  copyText() {
    this.clientService.getRegistrationFormExpirycode().subscribe((res: any) => {
      this.isCopied = true;
      let val = BASE_API + "/#/newdistributorregistration/self/" + res?.code;
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
  }
  form: UntypedFormGroup = new UntypedFormGroup({
    distributor: new UntypedFormControl(''),
    email: new UntypedFormControl(''),
    phone: new UntypedFormControl(''),
    zipcode: new UntypedFormControl(''),
    city: new UntypedFormControl(""),
    state: new UntypedFormControl(""),
    area: new UntypedFormControl(""),
    gender: new UntypedFormControl(''),
    type: new UntypedFormControl(''),
    acceptTerms: new UntypedFormControl(false),
    gst: new UntypedFormControl(''),
    tan: new UntypedFormControl('')
  });
  ngOnInit(): void {
    let user: any = this.storageService.getUser();
    // console.log(user);
    this.getAllCountryList();
    this.clientService.getStateListByCountrynameOrId("INDIA", "NULL").subscribe((res: any) => {
      this.stateList = res;
    })
    this.form = this.formBuilder.group(
      {
        distributor: [this.newdistributor ? this.newdistributor?.distributor : '', [Validators.required]],
        email: [this.newdistributor ? this.newdistributor?.email : '', [Validators.required, Validators.email]],
        phone: [this.newdistributor ? this.newdistributor?.phone : '', [Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
        ]],
        phone2: [this.newdistributor ? this.newdistributor?.phone2 : ''],
        username: [
          this.newdistributor ? this.newdistributor?.username : '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(20),
          ],
        ],
        password: [
          this.newdistributor ? this.newdistributor?.password : '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
            strong
          ],
        ],
        zipcode: [this.newdistributor ? this.newdistributor?.zipcode : "", [Validators.required,
        Validators.minLength(3),
        ]],
        ispremium: [this.newdistributor ? this.newdistributor?.ispremium : false],
        city: new UntypedFormControl("", [Validators.required]),
        createdby: new UntypedFormControl(user ? user.username : 'user', [Validators.required]),
        state: new UntypedFormControl("", [Validators.required]),
        country: new UntypedFormControl("", [Validators.required]),
        type: new UntypedFormControl(''),
        gender: new UntypedFormControl(this.newdistributor ? this.newdistributor?.gender : ''),
        location: [''],
        code: [this.expiry ? this.expiry : null],
        gst_no: new UntypedFormControl(this.newdistributor ? this.newdistributor?.gst_no : '', [Validators.required]),
        tan_no: new UntypedFormControl(this.newdistributor ? this.newdistributor?.tan_no : '', [Validators.required]),
        acceptTerms: [this.newdistributor ? true : false, Validators.requiredTrue],
      }

    )
    if (this.newdistributor) {
      this.selectedstaten = this.newdistributor?.stateobj?.statename;
      this.selecteddistrictn = this.newdistributor?.districtobj?.name;
      this.cityName = this.newdistributor?.city;
      this.locationName = this.newdistributor?.location;
      this.selectedCountryn = this.newdistributor?.countryobj?.countryname
      this.selectedLocationByPin=this.newdistributor
      this.clientService.getDistrictListByState(this.newdistributor?.stateobj?.statename, this.newdistributor?.stateobj?.id).subscribe((res: any) => {
        this.districtList = res;
        this.clientService.getCityListByDistrictNdState(this.newdistributor?.districtobj?.name, this.newdistributor?.districtobj?.id, this.newdistributor?.stateobj?.id).subscribe((res: any) => {
          this.cityList = res;
          this.clientService.getLocationListByDistrictNdCityNdState(this.newdistributor?.cityobj?.cityname, this.newdistributor?.districtobj?.id, this.newdistributor?.stateobj?.id, this.newdistributor?.cityobj?.id).subscribe(res => {
            this.locationList = res;
          })
        })

      })
    }

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
    // this.stateName = "";
    // this.cityName = "";
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
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
  getAddress() {
    // console.log(_zone_symbol__value);

    this.clientService.getCurrentAddress().then((e: any) => {
      // console.log(e);
      this.cityname = e.features[0].properties.state_district;
      this.statename = e.features[0].properties.state;
      if (e.features[0].properties.city) {
        this.area = e.features[0].properties.city + "," + e.features[0].properties.suburb;
      } else {
        this.area = e.features[0].properties.suburb;
      }
      this.pincode = e.features[0].properties.postcode;
    })
    // console.log(address);

  }
  // onCountryChange(Event: any): void {
  //   this.states = State.getStatesOfCountry(JSON.parse(this.country.nativeElement.value).isoCode);
  //   this.selectedCountry = JSON.parse(this.country.nativeElement.value);
  //   this.cities = this.selectedState = this.selectedCity = null;
  //   // console.log(this.selectedCountry);
  //   this.countryName = this.selectedCountry.name;
  //   this.stateName = "";
  //   this.cityName = "";
  // }
  onCountryChange(Event: any): void {
    // console.log(this.country.nativeElement.value);
  }

  // console.log(address);

  onCityChange(event: any): void {
    this.locationList = [];
    this.choosedCity = this.cityList.find((e: any) => e.id == event.target.value);
    this.cityName = this.choosedCity?.cityname;
    this.clientService.getLocationListByDistrictNdCityNdState(this.choosedCity?.cityname, this.choosedDistrict?.id, this.choosedState?.id, this.choosedCity?.id).subscribe(res => {
      this.locationList = res;
    })
    // this.selectedCity = JSON.parse(this.city.nativeElement.value)
    // console.log(this.selectedCity);
    // this.cityName = this.choosedCity?.cityname;

    // this.clientService.getLocationListByCity(this.choosedCity?.cityname).subscribe(res => {
    //   this.locationList = res;
    // })
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
    // this.cities = City.getCitiesOfState("IN", JSON.parse(this.state.nativeElement.value).isoCode)
    this.clientService.getCityListByStateIdOrState("null", JSON.parse(this.state.nativeElement.value).name).subscribe(res => {
      // console.log(res);
      this.cities = res;
    })
    this.selectedState = JSON.parse(this.state.nativeElement.value);
    this.selectedCity = null;
    // console.log(this.selectedState);
    this.stateName = this.selectedState.name;
    this.cityName = "";
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

    // this.selectedstaten = state.target.value;
    // // console.log(state.target.value);

    // this.clientService.getDistrictListByStatenameOrId(state.target.value, "null").subscribe((res: any) => {
    //   this.districtList = res;
    // })
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
    // this.selecteddistrictn = district.target.value;
    // // console.log(district.target.value);
    // this.clientService.getCityListByDistrictnameOrId(district.target.value, "null").subscribe((res: any) => {
    //   this.cityList = res;
    // })
  }
  onSubmit() {
    console.log(this.form.value);

    this.form.removeControl('state');
    this.form.removeControl('city');
    this.form.removeControl('country');
    this.form.removeControl('location');
    this.form.removeControl('district');
    this.form.removeControl('type');
    // if (this.stateName) {
    //   this.form.addControl('state', new FormControl(this.stateName, Validators.required))
    // }
    // if (this.locationName) {
    //   this.form.addControl('location', new FormControl(this.locationName, Validators.required))
    // }
    // if (this.cityName) {
    //   this.form.addControl('city', new FormControl(this.cityName, Validators.required))
    // }

    // if (this.countryName) {
    //   this.form.addControl('country', new FormControl(this.countryName, Validators.required))
    // }
    if (this.selectedstaten) {
      this.form.addControl('state', new UntypedFormControl(this.selectedstaten, Validators.required))
    }
    if (this.locationName) {
      this.form.addControl('location', new UntypedFormControl(this.locationName, Validators.required))
    }
    if (this.cityName) {
      this.form.addControl('city', new UntypedFormControl(this.cityName, Validators.required))
    }

    if (this.selectedCountryn) {
      this.form.addControl('country', new UntypedFormControl(this.selectedCountryn, Validators.required))
    }
    if (this.selecteddistrictn) {

      this.form.addControl('district', new UntypedFormControl(this.selecteddistrictn, Validators.required))
    }
    if (this.selectedType) {
      this.form.addControl('type', new UntypedFormControl(this.selectedType, Validators.required))
      if (this.selectedType == 'person') {
        // this.form.removeControl('lname');
        // this.form.removeControl('dob');
        // this.form.removeControl('company');
        this.form.removeControl('gst_no');
        this.form.removeControl('tan_no');
        // this.form.addControl('lname', new FormControl('null'));
      }
    }

    this.submitted = true;
    // console.log(this.form.value);

    if (this.form.invalid) {
      return;
    }
    if (this.form.value.acceptTerms) {
      // if (this.form.valid) {

      this.form.removeControl("acceptTerms");
      // console.log(this.form.value);
      let loader = this.matDialog.open(LoaderComponent, {
        panelClass: 'loader-upload'
      })
      if (this.newdistributor) {
        this.form.addControl('complaintid', new UntypedFormControl(this.newdistributor?.complaintid, Validators.required));
        this.form.addControl('id', new UntypedFormControl(this.newdistributor?.id, Validators.required))
        this.clientService.submitDistibutor(this.form.value).subscribe((res: any) => {
          loader.close();
          this.matDialog.closeAll();
          this.form.addControl("acceptTerms", new UntypedFormControl(false, Validators.required));
          this.onReset();
          // if (res.message == "Distibutor created successfully") {
          // this.Alert.successAlert("New Profile Created successfully!!");
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: res.message,
            showConfirmButton: false,
            timer: 1500
          })

          // } else {
          //   // this.Alert.errorAlert(res.message);
          //   Swal.fire({
          //     icon: 'error',
          //     title: 'Oops...',
          //     text: 'Something went wrong!',
          //     footer: '<a >Why do I have this issue?</a>'
          //   })
          // }
          const myTimeout = setTimeout(() => {
            // this.router.navigate(['admin/distributor-list']);
            if (this.isAndroid) {
              window.location.reload();
            } else {
              this.router.navigate(['admin/distributor-list']);
            }
            clearTimeout(myTimeout);
          }, 1000);

        }, (err) => {
          // console.log(err);
          this.form.addControl("acceptTerms", new UntypedFormControl(false, Validators.required));
          loader.close();
          // console.log(loader);

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.error.message,
            footer: '<a >Why do I have this issue?</a>'
          })
        })
      } else {
        this.clientService.createDistibutor(this.form.value).subscribe((res: any) => {
          loader.close();
          this.form.addControl("acceptTerms", new UntypedFormControl(false, Validators.required));
          this.onReset();
          // if (res.message == "Distibutor created successfully") {
          // this.Alert.successAlert("New Profile Created successfully!!");
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: res.message,
            showConfirmButton: false,
            timer: 1500
          })

          // } else {
          //   // this.Alert.errorAlert(res.message);
          //   Swal.fire({
          //     icon: 'error',
          //     title: 'Oops...',
          //     text: 'Something went wrong!',
          //     footer: '<a >Why do I have this issue?</a>'
          //   })
          // }
          const myTimeout = setTimeout(() => {
            // this.router.navigate(['admin/distributor-list']);
            if (this.isAndroid) {
              window.location.reload();
            } else {
              this.router.navigate(['admin/distributor-list']);
            }
            clearTimeout(myTimeout);
          }, 1000);

        }, (err) => {
          // console.log(err);
          this.form.addControl("acceptTerms", new UntypedFormControl(false, Validators.required));
          loader.close();
          // console.log(loader);

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.error.message,
            footer: '<a >Why do I have this issue?</a>'
          })
        })
      }
    }
    else {


    }
  }
  onChooseLocation(event: any) {
    // console.log(event.target.value);
    this.locationName = event.target.value;
  }

  chooseOrEnterCity() {
    this.isEnter = !this.isEnter;
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
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
  onChooseSelectedType(event: any) {
    // console.log(this.selectedType);
    // console.log(event);
    this.selectedType = event.value
  }
  selectedLocationByPin: any;
  selectLocationByPin(loc: any) {
    this.selectedLocationByPin = loc
    this.selectedstaten = loc.state
    this.cityName = loc.city
    this.selecteddistrictn = loc.district
    this.selectedCountryn = loc.country.toUpperCase();
    this.locationName=loc?.location?loc?.location:""
    this.form.get("location")?.setValue(this.locationName)

    console.log(this.form.value);
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