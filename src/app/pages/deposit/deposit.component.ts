import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/utils/services/app.service';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { of } from 'rxjs';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {

  url:string = 'https://stuxnetapi.herokuapp.com';
  success:any;
  tc:any;
  additionalNo:number;
  deposit:any;
  accounts:any [] = [];
  depositForm: FormGroup;
  
  constructor(
    private formBuilder: FormBuilder,
    public appService: AppService,
    private authenticationService: AppService,
    private alertService: ToastrService,
    private router:Router
  ) { }

  ngOnInit() {
    
    this.depositForm = this.formBuilder.group({
      additionalNo:[''],
      deposit: ['', Validators.required]
     });

    const currentUser = this.authenticationService.currentUserValue;
    this.tc = localStorage.getItem("tc");
    //this.depositAdd(currentUser.token, this.tc, 1017, 100);
    this.getAccount(currentUser.token, this.tc);
  }

  get f() { return this.depositForm.controls; } 
  
  getAccountInfo(additionalNo:number, deposit:number){
    console.log(additionalNo, deposit); 
  }

  onSubmit() {
    if(this.f.deposit.value == 0 || this.f.additionalNo.value == 0 || this.f.deposit.value <= 0){
      this.alertService.error("Lütfen bilgileri boşluk bırakmadan doğru giriniz!");
    }else{
      const currentUser = this.authenticationService.currentUserValue;
      this.tc = localStorage.getItem("tc");
      this.depositAdd(currentUser.token, this.tc, this.f.additionalNo.value, this.f.deposit.value);
      this.f.additionalNo.setValue('');
      this.f.deposit.setValue('');
    }
  }

  getAccount(token, tc) {
    var config = {
      headers:{'token': "" + token}
    }
    var bodyParameters = {
      tc: parseInt(tc),
    }

    axios.post(this.url+'/api/account',
      bodyParameters,
      config
    ).then((response) => {
      this.accounts = response.data;
      console.log("account_> ", this.accounts);
    }).catch((error) => {
      console.log(error)
    });
  }


  depositAdd(token, tc, additNo, deposit) {
    var config = {
      headers:{'token': "" + token}
    }
    var bodyParameters = {
      tc: parseInt(tc),
      additNo: parseInt(additNo),
      deposit: parseFloat(deposit),
    }
    axios.post(this.url+'/api/account/deposit',
      bodyParameters,
      config
    ).then((response) => {
      
      this.success = response.data.recordset[0];
      if(!this.success || parseFloat(deposit) <= 0){
        this.alertService.error("Para yatırma işlemi başarısız!");
      }else{
        this.alertService.success("Para yatırma işlemi başarılı!");
        this.router.navigate(['/accountlist']);
      }
      console.log("deposit_> ", this.success);
    }).catch((error) => {
      console.log(error)
    });
  }
  

}
