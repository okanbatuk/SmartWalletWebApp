import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from 'src/app/utils/services/app.service';
import { User } from '../../models/user'
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleMenuSidebar: EventEmitter<any> = new EventEmitter<any>();
  public searchForm: FormGroup;
  currentUser: User;
  constructor(
    private appService: AppService,
    private router: Router
    ) {
      this.appService.currentUser.subscribe(x => this.currentUser = x);
    }
  @Input() date:Date;

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl(null)
    });
  }

  logout() {
    this.appService.logout();
    this.router.navigate(['/login']);
  }
}
