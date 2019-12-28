import {
  Component,
  OnInit,
  AfterViewInit,
  Renderer2,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { AppService } from 'src/app/utils/services/app.service';
import axios from 'axios';

@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit, AfterViewInit {
  @ViewChild('mainSidebar', { static: false }) mainSidebar;
  @Output() mainSidebarHeight: EventEmitter<any> = new EventEmitter<any>();

  

  tc: any;
  profile: any[] = [];
  constructor(
    public appService: AppService,
    private authenticationService: AppService
    ) {}

    
  ngOnInit() {
    const currentUser = this.authenticationService.currentUserValue;
    this.tc = localStorage.getItem("tc");
    this.getProfile(currentUser.token, this.tc);
  }

  getProfile(token, tcs) {
    var config = {
      headers: {'token': "" + token}
    };
    
    var bodyParameters = {
      tc: parseInt(tcs),
    }
    
    axios.post( 
      'https://stuxnetapi.herokuapp.com/api/customer/updateUserList',
      bodyParameters,
      config
    ).then((response) => {
      this.profile = response.data;
    }).catch((error) => {
      console.log(error)
    });
    console.log(this.profile);
  }

  ngAfterViewInit() {
    this.mainSidebarHeight.emit(this.mainSidebar.nativeElement.offsetHeight);
  }
}
