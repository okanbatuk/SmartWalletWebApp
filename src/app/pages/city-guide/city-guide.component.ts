import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/utils/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-city-guide',
  templateUrl: './city-guide.component.html',
  styleUrls: ['./city-guide.component.scss']
})
export class CityGuideComponent implements OnInit {

  url:string = '';
  success:any;
  tc:any;
  cityGuide: FormGroup;

  loading:false;

  constructor(
    private formBuilder: FormBuilder,
    public appService: AppService,
    private authenticationService: AppService,
    private alertService: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cityGuide = this.formBuilder.group({})  //içi dolacak
  }
  const currentUser = this

}
