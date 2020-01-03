import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/utils/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-past-trip',
  templateUrl: './past-trip.component.html',
  styleUrls: ['./past-trip.component.scss']
})
export class PastTripComponent implements OnInit {

  url:string = 'https://smartwallet-transportation.herokuapp.com';
  travels:any [] = [];
  tc:any;

  constructor(
    public appService: AppService,
    private authenticationService: AppService,
    private alertService: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    const currentUser = this.authenticationService.currentUserValue;
    this.tc = localStorage.getItem("tc");

  }

  getPastTrip(tc) {
    axios.post(
      this.url+'/pastJourneys'
    ).then((response) => {
      this.travels = response.data;
    }).catch((error) => {
      console.log(error)
    });
  }

}
