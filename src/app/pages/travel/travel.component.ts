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
  tc:any;
  additNo:number
  isStudent:any;

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
    this.tc = localStorage.getItem("tc");
    this.getCity();
    this.getPerson(this.tc);
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
  getPerson(tc) {
    axios.post(
      'https://smartwallet-transportation.herokuapp.com/personInfo',
      {tc}
    ).then((response) => {
      if (response.data[0].isStudent=true) {
        this.isStudent = 1
      } else {
        this.isStudent = 0
      }
    })
  }

  querySubmit() {
    if(this.f.cityID.value=='' || this.f.cityID.value==0 ) {
      this.alertService.error("Şehir Seçiniz..");
      this.loading = false;
    } else {
      this.vehicle(this.f.cityID.value);
    }
  }

  /* travel() {
    const currentUser = this.authService.currentUserValue;
    if (this.isStudent = 1) {
      console.log(this.f.vehicleID.value);
    } else {
      
    }
    this.travelProcess(currentUser.token,this.f.vehicleID.value,this.f.);
  } */

  vehicle(cityID) {
    this.loading = true;
    axios.post(
      this.url+'/vehicles',{cityID}
    ).then((response) => {
      this.vehicles = response.data;
      if(response.data == '') {
        this.alertService.error(`Araç Bilgisi Bulunamadı`);
      } else {
        this.alertService.success(`Araç Bilgileri Getirildi`);
      }
      this.loading = false;
    }).catch((error) => {
      console.log(error)
    });
  }

  /* travelProcess(token,vehicleID,price) {
    var bodyParamaters = {
      tc:this.tc,
      vehicleID,
    }
    //this.loading = true;
    axios.post(
      this.url+'/travel',
      bodyParamaters
    ).then((response)=> {
      if (response.data.recordset[0].Status == 1) {
        var config = {
          headers: {'token':""+token}
        }
        var bodyParamaters = {
          tc:this.tc,
          1001:this.additNo,
          price:parseFloat(price)
        }
        axios.post(
          'https://stuxnetapi.herokuapp.com/api/account/withdraw',
          bodyParamaters,
          config
        ).then((response) => {
          this.success = response.data;
          if (response.data.status == 500) {
            this.alertService.error("Seyahat İşlemi Başarısız");
          } else {
            this.alertService.success("Seyahat İşlemi Başarılı");
            this.router.navigate(['/past-trip']);
          }
        })
      } else {
        this.alertService.error("Bir hata oluştu..");
      }
    }).catch((error) => {
      console.log(error)
    });
  } */

}
