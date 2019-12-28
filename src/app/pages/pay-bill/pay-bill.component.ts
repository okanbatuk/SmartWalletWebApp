import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/utils/services/app.service';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { query } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pay-bill',
  templateUrl: './pay-bill.component.html',
  styleUrls: ['./pay-bill.component.scss']
})
export class PayBillComponent implements OnInit {

  url:string = 'https://stuxnetapi.herokuapp.com';
  success:any;
  tc:any;
  additNo:number;
  bill:any;
  accounts:any [] = [];
  queryBill:any [] = [];
  payForm: FormGroup;

  loading = false;
  loadingpay = false;
  
  BillID:any;
  Debt:any;
  Area:any;

  constructor(
    private formBuilder: FormBuilder,
    public appService: AppService,
    private authenticationService: AppService,
    private alertService: ToastrService,
    private router:Router
  ) { }

  ngOnInit() {
    this.payForm = this.formBuilder.group({
      additionalNo: ['', Validators.required],
      billID: ['', Validators.required],
      subsID: ['', Validators.required],
      dept : ['', Validators.required]
     });
    
    const currentUser = this.authenticationService.currentUserValue;
    this.tc = localStorage.getItem("tc");
    //this.depositAdd(currentUser.token, this.tc, 1017, 100);
    this.getAccount(currentUser.token, this.tc);
  }

  get f() { return this.payForm.controls; }


  getAccountInfo(additNo:number, withdraw:number){
    console.log(additNo, withdraw);
  }

  paySubmit(){
    this.loadingpay = true

    const currentUser = this.authenticationService.currentUserValue;
    console.log("pay submit querybill, ", this.queryBill);
    console.log("pay Submit formcontrol"  , this.f.additionalNo.value, this.f.dept.value, this.f.billID.value);

    if (this.f.additionalNo.value == '' || this.f.billID.value == ''){
      this.alertService.error("Ödeme veya fatura bilgisi seçilmedi!");
      this.loadingpay = false;
    }else {
      for (let i=0; i<this.queryBill.length; i++){
        if (this.queryBill[i].BillID == this.f.billID.value){
          this.BillID = this.queryBill[i].BillID;
          this.Debt = this.queryBill[i].Debt;
          this.Area = this.queryBill[i].Area;
          console.log("queryBill _>", this.BillID, this.Debt, this.Area, currentUser.token);
        }
      }
  
      for (let i=0; i<this.accounts.length; i++){
        if (this.accounts[i].additionalNo == this.f.additionalNo.value) {
          if (this.accounts[i].Balance < this.Debt){
            this.alertService.warning("Hesabanızda yeterli bakiye bulumamaktadır!");
            console.log(localStorage.getItem('accNo'));
            this.loadingpay = false;
          }else{
            this.payBill(
              currentUser.token, 
              localStorage.getItem('accNo'),
              this.f.additionalNo.value,
              this.BillID,
              this.Debt,
              this.Area
              );
          } 
          
        }
      }
    }
    
  }

  querySubmit() {
    console.log(this.f.subsID.value);
    if (this.f.subsID.value == ''){
      this.alertService.error("Abone Numarası boş bırakılamaz!");
      this.loading = false;
    }else{
      this.billQuery(this.f.subsID.value);
      this.f.subsID.setValue('');
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
      console.log("acount_> ", this.accounts);
    }).catch((error) => {
      console.log(error)
    });
  }

  billQuery(subsID){
    this.loading = true;
    axios.post('https://stuxnet-payment.herokuapp.com/payment', {subsID:subsID})
      .then((response)=> {
        this.queryBill = response.data;
        if(response.data.status == 404){
          this.alertService.error(subsID, "Abone numaralı fatura bulunamadı!");
          console.log("ww");
          this.loading = false;
        }
        else{
          this.alertService.success(subsID, "Abone numaralı fatura bulundu!");
          this.loading = false;
        }
        console.log("bill query :", response.data.status);
      }).catch((error)=> {
         console.log(error); 
      });
  }

  payBill(token, accNo, additNo, billID, pay, area) {
    this.loadingpay = true;
    var config = {
      headers:{'token': "" + token}
    }
    var bodyParameters = {
      accNo: parseInt(accNo),
      additNo: parseInt(additNo),
      billID: parseInt(billID),
      pay: parseFloat(pay),
      area:parseInt(area)
    }
    axios.post(this.url+'/api/payment',
      bodyParameters,
      config
    ).then((response) => {
      if(response.data.recordset[0].Status == 1){
        console.log("pay _>", billID, accNo, additNo);
        axios.post('https://stuxnet-payment.herokuapp.com/pay', {
          billID:parseInt(billID),
          accNo:parseInt(accNo),
          additNo:parseInt(additNo)
        }).then((response) => {
          console.log("uloooooooooooooooooo ",response)
          if(response.data) {
            this.alertService.success("Fatura yatırma işlemi başarılı!");
            this.router.navigate(['/paymenthistory']);
          } else {
            this.alertService.error("Fatura Ödeme işlemi başarısız!");
           }
           this.loadingpay = false;
        }).catch((error) => {
          console.log("promise error _>",error);
        })
      }else{
        
      }
      console.log("api/payment res_> ", response.data.recordset[0]) ;
    }).catch((error) => {
      console.log(error)
    });
  }
  

}
