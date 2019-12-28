import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/utils/services/app.service';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";

@Component({
  selector: 'app-virman',
  templateUrl: './virman.component.html',
  styleUrls: ['./virman.component.scss']
})
export class VirmanComponent implements OnInit {

  url:string = 'https://stuxnetapi.herokuapp.com';
  success:any;
  tc:any;
  sendAddit:number;
  recAddit:number;
  money:any;
  accounts:any [] = [];
  virmanForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public appService: AppService,
    private authenticationService: AppService,
    private alertService: ToastrService,
    private router:Router
  ) { }

  ngOnInit() {
    this.virmanForm = this.formBuilder.group({
      sendAddit:[''],
      recAddit:[''],
      money:['',Validators.required]        //-------
     });

    const currentUser = this.authenticationService.currentUserValue;
    this.tc = localStorage.getItem("tc");
    //this.depositAdd(currentUser.token, this.tc, 1017, 100);
    this.getAccount(currentUser.token, this.tc);
  }

  get f() { return this.virmanForm.controls; } 

  getAccountInfo(additNo:number, deposit:number){
    console.log(additNo, deposit);
  }

  onSubmit(){
    if (this.f.money.value <= 0 || this.f.sendAddit.value==0 || this.f.recAddit.value==0) {
      console.log('asdasdasda'+this.f.money.value);
      this.alertService.error("Lütfen bilgileri boşluk bırakmadan doğru giriniz !!")
    } else if (this.f.sendAddit.value == this.f.recAddit.value) {
      console.log('aasdasd'+this.f.sendAddit.value);
      console.log('qweqwe'+this.f.recAddit.value);
      this.alertService.error("Gönderici ile alıcı hesap aynı olamaz !!")
    } else {
      const currentUser = this.authenticationService.currentUserValue;
      this.tc = localStorage.getItem("tc");
      this.virmanAdd(currentUser.token, this.tc, this.f.sendAddit.value, this.f.recAddit.value, this.f.money.value);
      this.f.sendAddit.setValue('');
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
      console.log("account_> ", this.accounts);
    }).catch((error) => {
      console.log(error)
    });
  }


  virmanAdd(token, tc, sendAddit, recAddit, money) {
    var config = {
      headers:{'token': "" + token}
    }
    var bodyParameters = {
      tc: parseInt(tc),
      sendAddit: parseInt(sendAddit),
      recAddit:parseInt(recAddit),
      money: parseFloat(money),
    }
    axios.post(this.url+'/api/account/virman',
      bodyParameters,
      config
    ).then((response) => {
      
      this.success = response.data;
      if(this.success.status == 500 || parseFloat(money) <= 0){
        this.alertService.error("Virman işlemi başarısız!");
      }else{
        this.alertService.success("Virman işlemi başarılı!");
        this.router.navigate(['/accountlist']);
      }
      console.log("virman_> ", this.success);
    }).catch((error) => {
      console.log(error)
    });
  }


}
