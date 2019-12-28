import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/utils/services/app.service';
import axios from 'axios';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  url:string = 'https://stuxnetapi.herokuapp.com';
  profile:any [] = [];
  tc:any;

  constructor(
    public appService: AppService,
    private authenticationService: AppService) {}


  ngOnInit() {
    const currentUser = this.authenticationService.currentUserValue;
    this.tc = localStorage.getItem("tc");
    console.log("tc", this.tc);
    this.getUserInfo(currentUser.token, this.tc);
  }

  getUserInfo(token, tc) {
    var config = {
      headers:{'token': "" + token}
    }
    var bodyParameters = {
      tc: parseInt(tc),
    }

    axios.post(this.url+'/api/customer/updateUserList',
      bodyParameters,
      config
    ).then((response) => {
      this.profile = response.data;
      console.log("profile_> ", this.profile);
    }).catch((error) => {
      console.log(error)
    });
  }
}
