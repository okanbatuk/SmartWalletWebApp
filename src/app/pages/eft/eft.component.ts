import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/utils/services/app.service';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";

@Component({
  selector: 'app-eft',
  templateUrl: './eft.component.html',
  styleUrls: ['./eft.component.scss']
})
export class EftComponent implements OnInit {

  url:string = 'https://stuxnetapi.herokuapp.com';
  success:any;
  
  tc:any;
  sendAddit:number;
  recAcc:number;
  recAddit:number;
  money:number;
  eftForm: FormGroup;
  eft:any;
  accounts:any [] = [];
  

  constructor(
    private formBuilder: FormBuilder,
    public appService: AppService,
    private authenticationService: AppService,
    private alertService: ToastrService,
    private router:Router
  ) { }

  ngOnInit() {
     this.eftForm = this.formBuilder.group({
      sendAddit:[''],
      recAcc:['',Validators.required],
      recAddit:['',Validators.required],
      money: ['', Validators.required]
     });
     
    const currentUser = this.authenticationService.currentUserValue;
    this.tc = localStorage.getItem("tc");
    //this.depositAdd(currentUser.token, this.tc, 1017, 100);
    this.getAccount(currentUser.token, this.tc);
  }

  get f() { return this.eftForm.controls; } 

  /*getAccountInfo(additNo:number, eft:number){
    console.log(additNo, eft);
  }*/

  onSubmit() {
    console.log("money"+this.f.money.value);
    console.log("sendaddit",this.f.sendAddit.value)
    console.log("recAcc",this.f.recAcc.value);
    console.log("recaddit",this.f.recAddit.value);

    if(this.f.money.value <= 0 || this.f.sendAddit.value == 0){

      this.alertService.error("Lütfen bilgileri boşluk bırakmadan doğru giriniz!");
    } else{
      const currentUser = this.authenticationService.currentUserValue;
      this.tc = localStorage.getItem("tc");
      this.eftAdd(currentUser.token, this.tc, this.f.sendAddit.value, this.f.recAcc.value,this.f.recAddit.value,this.f.money.value);
      this.f.sendAddit.setValue('');
      this.f.recAcc.setValue('');
      this.f.recAddit.setValue('');
      this.f.money.setValue('');
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
      console.log("eft_> ", response.data);
    }).catch((error) => {
      console.log(error)
    });
  }

  eftAdd(token, tc, sendAddit, recAcc, recAddit,money) {
    console.log(sendAddit, recAcc, recAddit,money)
    var config = {
      headers:{'token': "" + token}
    }
    var bodyParameters = {
      tc: parseInt(tc),
      sendAddit:parseInt(sendAddit),
      recAcc: parseInt(recAcc),
      recAddit: parseInt(recAddit),
      money: parseFloat(money)
    }
    axios.post(this.url+'/api/account/eft',
      bodyParameters,
      config
    ).then((response) => {
      console.log("res", response.data)
      this.success = response.data;
      if(parseFloat(money) <= 0 || this.success.status == 500 ){
        this.alertService.error("EFT işlemi başarısız!");
      }else{
        this.alertService.success("EFT işlemi başarılı!");
        this.router.navigate(['/accountlist']);
      }
      console.log("eft_> ", this.success);
    }).catch((error) => {
      console.log(error)
    });
  }

}
