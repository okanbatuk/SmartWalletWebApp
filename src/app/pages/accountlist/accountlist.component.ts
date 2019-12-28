import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/utils/services/app.service';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accountlist',
  templateUrl: './accountlist.component.html',
  styleUrls: ['./accountlist.component.scss']
})
export class AccountlistComponent implements OnInit {

  url:string = 'https://stuxnetapi.herokuapp.com';
  accounts:any [] = [];
  tc:any;
  
  
  constructor(
    public appService: AppService,
    private authenticationService: AppService,
    private alertService: ToastrService,
    private router:Router
  ) { }

  ngOnInit() {
    const currentUser = this.authenticationService.currentUserValue;
    this.tc = localStorage.getItem("tc");
    this.getAccount(currentUser.token, this.tc);
  }

  newAccOnclik(){
    const currentUser = this.authenticationService.currentUserValue;
    this.newAccount(currentUser.token, this.tc);
  }

  delAccOnclik(additNo) {
    const currentUser = this.authenticationService.currentUserValue;
    this.removeAccount(currentUser.token, this.tc, additNo);
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
    }).catch((error) => {
      console.log(error)
    });
  }

  newAccount(token, tc) {
    var config = {
      headers:{'token': "" + token}
    }
    var bodyParameters = {
      tc: parseInt(tc),
    }
    axios.post(this.url+'/api/account/newAccount',
      bodyParameters,
      config
    ).then((response) => {
      status = response.data.recordset[0];
      if(status){
        this.alertService.success("Hesap Açma işlemi başarılı!");
        
      } else{
        this.alertService.error("Hesap Açma işlemi başarısız!");
      }
    }).catch((error) => {
      console.log(error)
    });
  }

  removeAccount(token, tc, additNo){
    var config = {
      headers:{'token': "" + token}
    }
    var bodyParameters = {
      tc: parseInt(tc),
      additNo:parseInt(additNo)
    }
    axios.post(this.url+'/api/account/deleteAccount',
      bodyParameters,
      config
    ).then((response) => {
      if(response.data.status == 500){
        this.alertService.error("Hesapta para var! Hesap kapatma işlemi başarısız!");
      } else{
        this.alertService.success("Hesap Kapatma işlemi başarılı!");
        this.router.navigate(['/accountlist']);
      }
    }).catch((error) => {
      console.log(error)
    });
  }

}
