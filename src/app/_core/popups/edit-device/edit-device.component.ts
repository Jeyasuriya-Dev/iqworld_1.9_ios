import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { LoaderComponent } from '../../loader/loader.component';
import { ClientService } from '../../services/client.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss']
})
export class EditDeviceComponent implements OnInit {
  stateList: any;
  locationList: any;
  countryList: any;
  selectedCityId: any = '';
  cityListByStateid: any;
  selectedStateId: any = 0;
  modelList: any;
  planVersionList: any = [];
  selectedCountry = ''
  customer: any = {};
  customerUsername: any = ""
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
    city: new UntypedFormControl(''),
    district: new UntypedFormControl(''),
    state: new UntypedFormControl(''),
    country: new UntypedFormControl(''),
    location: new UntypedFormControl(''),
    dob: new UntypedFormControl('')
  });
  districtList: any;
  choosedCity: any;
  choosedState: any;
  choosedLocation: any;
  choosedDistrict: any;
  OrientationList = [{ name: "Vertical", value: "9:16" }, { name: "Horizontal", value: "16:9" }]
  customerData: any;
  isDistributor: any;
  currentUser: any;
  constructor(private clientService: ClientService, private storageService: StorageService, private matDialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: UntypedFormBuilder) {
    console.log(data);
    this.customer = data;
    this.isDistributor = data.isDistributor
    this.customerUsername = data.username;

  }

  ngOnInit(): void {
    // this.getStateAllList();
    // this.getCustomerVersion();
    this.getAllDeviceModel();
    this.getAllCountryList();
    this.currentUser = this.storageService.getUser();
    this.clientService.getClientByUsername(this.customer.clientname).subscribe((res: any) => {
      // console.log(res);
      this.customerData = res;
      this.clientService.getCustomerVersion().subscribe((res: any) => {
        res.forEach((element: any) => {

          if (!this.planVersionList.includes(element)) {
            // console.log(element.id <= this.customer?.versionMaster?.id);
            // if (element.id == this.customer?.versionMaster?.id) {
            this.planVersionList.push(element)
            // }
          }
        })
        // console.log(this.planVersionList);


      })
    });

    this.clientService.getStateListBycountryIdOrcountry(this.customer?.country?.countryname, "null").subscribe((res: any) => {
      // console.log(res);
      this.stateList = res;
      this.choosedState = this.stateList.find((e: any) => e.statename === this.customer?.state?.statename);
      this.selectedStateId = this.customer?.state?.statename
      this.clientService.getDistrictListByState(this.choosedState.statename, this.choosedState?.id).subscribe(res => {
        // console.log(res);
        this.districtList = res;
        this.choosedDistrict = this.districtList.find((e: any) => e.name === this.customer?.district?.name);
        this.clientService.getCityListByDistrictNdState(this.choosedDistrict?.name, this.choosedDistrict?.id, this.choosedState?.id).subscribe(res => {
          // console.log(res);
          this.cityListByStateid = res;
          this.choosedCity = this.cityListByStateid.find((e: any) => e.cityname === this.customer?.city?.cityname);
          this.locationList = [];
          this.clientService.getLocationListByDistrictNdCityNdState(this.choosedCity.cityname, this.choosedDistrict?.id, this.choosedState?.id, this.choosedCity?.id).subscribe(res => {
            this.locationList = res;
          })

        })
      })
    })

    // this.clientService.getStateListBycountryIdOrcountry(this.customer?.country?.countryname, "null").subscribe((res: any) => {
    //   // console.log(res);
    //   this.stateList = res;

    // })
    // this.clientService.getDistrictListByStatenameOrId(this.customer?.state?.statename, "null").subscribe(res => {
    //   // console.log(res);
    //   this.districtList = res;
    // })

    // this.clientService.getCityListByDistrictnameOrId(this.customer?.district?.name, "null").subscribe(res => {
    //   // console.log(res);
    //   this.cityListByStateid = res;
    // })
    // this.clientService.getLocationListByCity(this.customer?.city?.cityname).subscribe(res => {
    //   this.locationList = res;
    // })
    this.form = this.formBuilder.group(
      {
        username: [
          this.customer.username,
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(8),
          ]
        ],
        district: new UntypedFormControl(this.customer?.district?.name),
        city: new UntypedFormControl(this.customer?.city?.cityname),
        state: new UntypedFormControl(this.customer?.state?.statename),
        country: new UntypedFormControl(this.customer?.country?.countryname),
        location: new UntypedFormControl(this.customer?.location?.area),
        modelname: new UntypedFormControl(this.customer?.modelname),
        landmark: new UntypedFormControl(this.customer?.landmark),
        versionid: [this.customer?.versionMaster?.id, [Validators.required]],
        height_width: new UntypedFormControl(this.customer?.height_width),
        createdby: new UntypedFormControl(this.currentUser?.username),
        zipcode: new UntypedFormControl(this.customer?.location?.pincode),
      }

    );
    this.selectedLocationByPin = {
      country: this.customer?.country?.countryname,
      distinct: this.customer?.distinct?.distinct,
      city: this.customer?.city?.cityname,
      location: this.customer?.location?.area,
      state: this.customer?.state?.statename
    }
    this.form.controls['username'].disable();
    this.form.controls['country'].disable();
    if (this.isDistributor) {
      this.form.controls['modelname'].disable();
    }
  }
  getAllCountryList() {
    this.clientService.getAllCountryList().subscribe(res => {
      // console.log(res);
      this.countryList = res;
    })
  }

  getCustomerVersion() {
    this.clientService.getCustomerVersion().subscribe((res: any) => {
      // console.log(res);
      this.planVersionList = res;
    })
  }
  getAllDeviceModel() {
    this.clientService.getAllDeviceModel().subscribe((res: any) => {
      // console.log(res);
      this.modelList = res;

    })
  }
  onChooseCountry(event: any) {
    // console.log(event.target.value);
    this.selectedLocationByPin = {
      country: event.target.value,
      distinct: "",
      city: "",
      location: "",
      state: ""
    }
    this.form.patchValue({
      district: null,
      city: null,
      location: null,
      state: null,
    })
    this.stateList = [];
    this.districtList = [];
    this.cityListByStateid = [];
    this.clientService.getStateListBycountryIdOrcountry(event.target.value, "null").subscribe((res: any) => {
      // console.log(res);
      this.stateList = res;
    })
  }
  onChooseState(stateid: any) {
    // console.log(stateid.target.value);
    // console.log(this.form.value);
    this.districtList = [];
    this.cityListByStateid = [];
    this.locationList = [];
    this.form.patchValue({
      district: null,
      city: null,
      location: null,

    })
    this.choosedState = this.stateList.find((e: any) => e.statename === stateid.target.value);
    this.selectedStateId = stateid.target.value;
    // this.clientService.getCityListByStateIdOrState("null", this.selectedStateId).subscribe(res => {
    //   console.log(res);
    //   this.cityListByStateid = res;
    // })
    this.clientService.getDistrictListByState(this.choosedState.statename, this.choosedState?.id).subscribe(res => {
      // console.log(res);
      this.districtList = res;
    })
    // this.clientService.getCityListByStateIdOrState("null", this.selectedStateId).subscribe(res => {
    //   console.log(res);
    //   this.cityListByStateid = res;
    // })
    // this.clientService.getDistrictListByStatenameOrId(stateid.target.value, "null").subscribe(res => {
    //   // console.log(res);
    //   this.districtList = res;
    // })
  }
  onChooseDistrict(event: any) {
    this.cityListByStateid = [];
    // console.log(event);
    this.locationList = [];
    this.form.patchValue({

      city: null,
      location: null,

    })
    this.choosedDistrict = this.districtList.find((e: any) => e.name === event.target.value);
    this.clientService.getCityListByDistrictNdState(this.choosedDistrict?.name, this.choosedDistrict?.id, this.choosedState?.id).subscribe(res => {
      // console.log(res);
      this.cityListByStateid = res;
    })
    // this.clientService.getCityListByDistrictnameOrId(event.target.value, "null").subscribe(res => {
    //   // console.log(res);
    //   this.cityListByStateid = res;
    // })
  }
  onChooseCity(cityid: any) {
    this.selectedCityId = cityid.target.value;
    // console.log(this.selectedHrState);
    // console.log(this.selectedCityId);
    this.form.patchValue({

      location: null,

    })
    this.choosedCity = this.cityListByStateid.find((e: any) => e.cityname === cityid.target.value);
    this.locationList = [];
    this.clientService.getLocationListByDistrictNdCityNdState(this.choosedCity.cityname, this.choosedDistrict?.id, this.choosedState?.id, this.choosedCity?.id).subscribe(res => {
      this.locationList = res;
    })
    // this.clientService.getLocationListByCity(this.selectedCityId).subscribe(res => {
    //   // console.log(res);
    //   this.locationList = res;
    // })

    // this.form.removeControl('location')
    // this.form.addControl("location", new UntypedFormControl(""));
  }
  onsubmit() {
    this.form.controls['username'].enable();
    // console.log(this.form.value);
    this.form.controls['country'].enable();
    this.form.controls['modelname'].enable();
    // if (this.form.valid) {
    if (this.customer.username) {
      this.form.addControl('username', new UntypedFormControl(this.customer.username, Validators.required))
    }
    let loader = this.matDialog.open(LoaderComponent, {
      panelClass: 'loader-upload'
    })
    // console.log(this.form.value);

    this.clientService.updateDevice(this.form.value).subscribe((res: any) => {
      loader.close();
      if (res.status === "Success") {

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: res.message,
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.message,
          footer: '<a >Why do I have this issue?</a>'
        })
      }
      window.location.reload();
    }, err => {
      loader.close();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.error.message,
        footer: '<a >Why do I have this issue?</a>'
      })
    })

  }

  onChooseLocation(event: any) {
    // console.log(event.target.value);
    if (this.form.contains("location")) {
      this.form.removeControl('location');
    }
    this.form.addControl('location', new UntypedFormControl(event.target.value));
    // console.log(this.form);
  }
  isEnter = false;
  chooseOrEnterCity() {
    this.isEnter = !this.isEnter;
  }
  isShow = false;
  showPassword() {
    let doc: any = document.getElementById('Cpass');
    // console.log(doc);
    doc.type = "text";
    this.isShow = true;
  }
  hidePassword() {
    let doc: any = document.getElementById('Cpass');
    // console.log(doc);
    doc.type = "password";
    this.isShow = false;
  }
  closeMe() {
    this.matDialog.closeAll();
    // window.location.reload();
  }

  selectedLocationByPin: any;
  selectLocationByPin(loc: any) {
    this.selectedLocationByPin = loc
    this.form.get("state")?.setValue(loc.state)
    this.form.get("city")?.setValue(loc.city)
    this.form.get("district")?.setValue(loc.district)
    this.form.get("country")?.setValue(loc.country.toUpperCase())
    this.form.get("location")?.setValue(loc.location)
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