import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/utils/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.scss']
})
export class TravelComponent implements OnInit {

  url:string = 'https://smartwallet-transportation.herokuapp.com';
  success:any;
  cities:any [];
  vehicles:any [] = [];
  travelForm: FormGroup;

  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    public appService: AppService,
    private authService: AppService,
    private alertService: ToastrService,
    private router:Router
  ) { }

  ngOnInit() {
    this.travelForm = this.formBuilder.group({
      cityID: ['', Validators.required]
    });
    const currentUser = this.authService.currentUserValue;
    this.getCity();
  }

  get f() { return this.travelForm.controls;}

  getCity() {
    axios.get(
      this.url+'/city'
    ).then((response) => {
      this.cities = response.data;
    }).catch((error)=> {
      console.log(error)
    });
  }

  querySubmit() {
    if(this.f.cityID.value=='' || this.f.cityID.value==0 ) {
      this.alertService.error("Şehir Seçiniz..");
      this.loading = false;
    } else {
      this.vehicle(this.f.cityID.value);
    }
  }
  vehicle(cityID) {
    this.loading = true;
    axios.post(
      this.url+'/vehicles',{cityID}
    ).then((response) => {
      this.vehicles = response.data;
      if(response.data == '') {
        this.alertService.error(`Araç Bilgisi Bulunamadı`);
      } else {
        this.alertService.success(`Araç Bilgisi Getirildi`);
      }
      this.loading = false;
    }).catch((error) => {
      console.log(error)
    });
  }

}
