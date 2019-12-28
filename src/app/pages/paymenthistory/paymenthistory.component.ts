import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/utils/services/app.service';
import axios from 'axios';

@Component({
  selector: 'app-paymenthistory',
  templateUrl: './paymenthistory.component.html',
  styleUrls: ['./paymenthistory.component.scss']
})
export class PaymenthistoryComponent implements OnInit {
  
  url:string = 'https://stuxnetapi.herokuapp.com';
  paymentHistory:any [] = [];
  tc:any;

  constructor(
    public appService: AppService,
    private authenticationService: AppService
  ) { }

  ngOnInit() {
    const currentUser = this.authenticationService.currentUserValue;
    this.tc = localStorage.getItem("tc");
    console.log("tc", this.tc);
    this.getPayHistory(currentUser.token, this.tc);
  }

  getPayHistory(token, tc) {
    var config = {
      headers:{'token': "" + token}
    }
    var bodyParameters = {
      tc: parseInt(tc),
    }

    axios.post(this.url+'/api/payment/listofpaymenttransactions',
      bodyParameters,
      config
    ).then((response) => {
      this.paymentHistory = response.data;
      console.log("paymenthistory_> ", this.paymentHistory);
    }).catch((error) => {
      console.log(error)
    });
  }

}
