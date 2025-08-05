import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/_core/services/alert.service';
import { ClientService } from 'src/app/_core/services/client.service';
import { StorageService } from 'src/app/_core/services/storage.service';
import { StoreInfoComponent } from '../../_features/store-info/store-info.component';
import { LoaderComponent } from 'src/app/_core/loader/loader.component';

@Component({
  selector: 'app-store-registration',
  templateUrl: './store-registration.component.html',
  styleUrls: ['./store-registration.component.scss']
})
export class StoreRegistrationComponent implements OnInit {
  [x: string]: any;
  storeRegistrationForm!: FormGroup;
  isSubmitted = false;
  countryList: any = [];
  stateList: any = [];
  districtList: any = [];
  cityList: any = [];
  locationList: any = []
  isEnter = false;
  client: any;
  store: any;
  isPassword = true;
  constructor(public dialogRef: MatDialogRef<StoreInfoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private matDialog: MatDialog, private fb: FormBuilder, private clientService: ClientService, private storageService: StorageService, private alertService: AlertService) {
    this.store = data;
  }
  ngOnInit(): void {
    this.storageService.getUsername()
    this.storeRegistrationForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      phone2: [''],
      clientid: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      district: ['', Validators.required],
      city: ['', Validators.required],
      location: ['', Validators.required],
      zip: ['', Validators.required],
      createdby: [this.storageService.getUsername(), Validators.required]
    });
    if (this.store?.id) {
      this.storeRegistrationForm.patchValue({
        name: this.store.name,
        username: this.store.username,
        email: this.store.email,
        password: this.store.password,
        phone: this.store.phone,
        phone2: this.store.phone2,
        clientid: this.store.clientid,
        country: this.store?.country?.id,
        state: this.store.state?.id,
        district: this.store?.district.id,
        city: this.store?.city.id,
        location: this.store.location?.id,
        zip: this.store.zipcode,
        createdby: [this.storageService.getUsername(), Validators.required]
      })
      this.getStateListBycountryIdOrcountry(this.store.country);
      this.getDistrictListByStatenameOrId(this.store.state);
      this.getCityListByDistrictNdState(this.store.district);
      this.getLocationListByDistrictNdCityNdState(this.store.city);
      this.storeRegistrationForm.disable();
      this.storeRegistrationForm.get('name')?.enable();
    }
    let currentUser: any = this.storageService.getCurrentUser();
    this.clientService.getClientByUsername(currentUser.username).subscribe((res: any) => {
      this.client = res;
      this.storeRegistrationForm.patchValue({ clientid: this.client.id })
    })
    this.getCountryAll();

  }
  get f(): { [key: string]: AbstractControl } {
    return this.storeRegistrationForm.controls;
  }
  onSubmit(): void {
    this.isSubmitted = true;
    if (this.storeRegistrationForm.invalid) {
      return;
    }
    let loader = this.matDialog.open(LoaderComponent, {
      panelClass: 'loader-upload'
    })
    if (this.store?.id) {
      this.clientService.editStore(this.storeRegistrationForm.get('name')?.value, this.store?.id, this.storageService.getUsername()).subscribe((res: any) => {
        console.log(res);
        this.alertService.showSuccess(res.message);
        this.dialogRef.close(true);
        loader.close();
      }, err => {
        this.alertService.showError(err.error.message);
        loader.close();
      })
    } else {
      this.clientService.registorStore(this.storeRegistrationForm.value).subscribe((res: any) => {
        console.log(res);
        this.alertService.showSuccess(res.message);
        this.dialogRef.close(true)
        loader.close();
      }, err => {
        this.alertService.showError(err.error.message);
        loader.close();
      })
    }
  }
  getCountryAll() {
    this.clientService.getAllCountryList().subscribe(res => {
      this.countryList = res;
    })
  }
  getStateListBycountryIdOrcountry(obj: any) {
    this.clientService.getStateListBycountryIdOrcountry(obj.countryname, obj.id).subscribe(res => {
      this.stateList = res;
      console.log(res);
    })
  }
  getDistrictListByStatenameOrId(obj: any) {
    this.clientService.getDistrictListByStatenameOrId(obj.statename, obj.id).subscribe(res => {
      this.districtList = res;
    })
  }
  getCityListByDistrictNdState(obj: any) {
    this.clientService.getCityListByDistrictNdState(obj.name, obj.id, obj.state.id).subscribe(res => {
      this.cityList = res;
    })
  }
  getLocationListByDistrictNdCityNdState(obj: any) {
    this.clientService.getLocationListByDistrictNdCityNdState(obj.cityname, obj.district.id, obj.district.state.id, obj.id).subscribe(res => {
      this.locationList = res;
    })
  }
  onCountrySelect(e: any) {
    this.storeRegistrationForm.patchValue({ state: '' })
    this.storeRegistrationForm.patchValue({ district: '' })
    this.storeRegistrationForm.patchValue({ city: '' })
    this.storeRegistrationForm.patchValue({ location: '' })
    const selectedCountry = this.countryList.find((country: any) => country.id == e.target.value);
    this.getStateListBycountryIdOrcountry(selectedCountry);
  }

  onStateSelect(e: any) {
    this.storeRegistrationForm.patchValue({ district: '' })
    this.storeRegistrationForm.patchValue({ city: '' })
    this.storeRegistrationForm.patchValue({ location: '' })
    const selectedState = this.stateList.find((state: any) => state.id == e.target.value);
    this.getDistrictListByStatenameOrId(selectedState)
  }

  onDistrictSelect(e: any) {
    this.storeRegistrationForm.patchValue({ city: '' })
    this.storeRegistrationForm.patchValue({ location: '' })
    const selectedDistrict = this.districtList.find((district: any) => district.id == e.target.value);
    this.getCityListByDistrictNdState(selectedDistrict)
  }
  onCitySelect(e: any) {
    this.storeRegistrationForm.patchValue({ location: '' })
    const selectedCity = this.cityList.find((city: any) => city.id == e.target.value);
    console.log(selectedCity);

    this.getLocationListByDistrictNdCityNdState(selectedCity)
  }
  onLocationSelect(e: any) {

  }
  toggleLocation(value: any) {
    if (this.isEnter) {
      this.storeRegistrationForm.patchValue({ location: '' })
    }
    console.log('Toggle location:', value);
    this.isEnter = !this.isEnter;
  }

}
