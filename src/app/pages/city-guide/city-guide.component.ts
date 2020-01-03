import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/utils/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-city-guide',
  templateUrl: './city-guide.component.html',
  styleUrls: ['./city-guide.component.scss']
})
export class CityGuideComponent implements OnInit {

  url:string = 'https://smartwallet-cityguide.herokuapp.com';
  success:any;
  tc:any;
  corpType:number;
  cities :any [] = [];
  institutions: any [] = [];
  library:any []= [];
  cityGuideForm: FormGroup;

  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    public appService: AppService,
    private authenticationService: AppService,
    private alertService: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cityGuideForm = this.formBuilder.group({
      cityID: ['',Validators.required],
      corpType:['',Validators.required]
    });
    this.getCity(); 

  }

  get f() { return this.cityGuideForm.controls;}

  getCity() {
    axios.get(
      this.url+'/city'
    ).then((response) => {
      this.cities = response.data;
    }).catch((error) => {
      console.log(error);
    })
  }

  querySubmit() {
    if(this.f.cityID.value=='' || this.f.cityID.value==0 ) {
      this.alertService.error("Şehir Seçiniz..");
      this.loading = false;
    } else if (this.f.corpType.value=='' || this.f.corpType.value==0) {
      this.alertService.error("Kurum Seçiniz..");
      this.loading = false;
    } else {
      this.institutions = [];
      this.library = [];
      this.corpInfo(this.f.cityID.value,this.f.corpType.value);
    }
  }

  corpInfo(cityID,corpType) {
    this.loading = true;
    var bodyParameters = {
      cityID:parseInt(cityID),
      corpType:parseInt(corpType)
    }
    axios.post (
      this.url+'/corpInfo',
      bodyParameters
    ).then((response) => {
      if (this.f.corpType.value==3) {
        this.library = response.data
      } else {
        this.institutions = response.data;
      }
      this.loading = false;
    }).catch((error)=> {
      console.log(error);
    })
  }

}
