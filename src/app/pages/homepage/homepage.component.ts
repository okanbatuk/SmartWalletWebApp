import { Component, OnInit } from '@angular/core';
import { Rate } from './rate';
import {HttpClient} from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import axios from 'axios';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  url:string = 'https://stuxnetmla.herokuapp.com/credit';
  credit:any;
  age:any;
  home:any;
  creditCount:any;
  phoneState:any;
  loading = false;

  decisionRes:any;

  predictForm: FormGroup;

  constructor(
    private httpClient:HttpClient,
    private formBuilder: FormBuilder,
    private alertService: ToastrService,
    ) { }

  path:string="https://web-paragaranti-pubsub.foreks.com/web-services/securities/exchanges/BIST/groups/E"
  
  rates:Rate[];

  ngOnInit() {

    this.predictForm = this.formBuilder.group({
      credit: ['', Validators.required],
      age: ['', Validators.required],
      home: ['', Validators.required],
      creditCount: ['', Validators.required],
      phoneState: ['', Validators.required],
     });

    this.httpClient.get<Rate[]>(this.path).subscribe(response =>{
      this.rates=response;
    })
  }
  
  get f() { return this.predictForm.controls; } 

  onSubmit() {
    console.log("predict form", 
      this.f.credit.value, 
      this.f.age.value, 
      this.f.home.value,
      this.f.creditCount.value,
      this.f.phoneState.value
      );

      if (this.f.credit.value == '' || 
          this.f.age.value == '' || 
          this.f.home.value == '' ||
          this.f.creditCount.value == '' ||
          this.f.phoneState.value == '' 
      ){
        this.alertService.error("Kredi Tahmini için tüm bilgileri eksiksiz ve doğru girin!");
      }
      else {
        this.getCredit(
          this.f.credit.value, 
          this.f.age.value, 
          this.f.home.value,
          this.f.creditCount.value,
          this.f.phoneState.value
        );
      }

      this.f.credit.setValue('');
      this.f.age.setValue(''); 
      this.f.home.setValue('');
      this.f.creditCount.setValue('');
      this.f.phoneState.setValue('');

  }

  getCredit(credit, age, home, creditCount, phoneState){
    this.loading = true;
    var bodyParameters = {
      credit: parseInt(credit),
      age: parseInt(age),
      home: parseInt(home),
      creditCount: parseInt(creditCount),
      phoneState: parseInt(phoneState)
    }
    axios.post(this.url,
      bodyParameters,
    ).then((response) => {
      this.decisionRes = response.data;
      console.log("Decisiicob_> ", this.decisionRes);
      this.loading = false;
    }).catch((error) => {
      console.log(error)
    });
    
  }

}
