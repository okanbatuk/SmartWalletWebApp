import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './main/header/header.component';
import { FooterComponent } from './main/footer/footer.component';
import { MenuSidebarComponent } from './main/menu-sidebar/menu-sidebar.component';
import { BlankComponent } from './pages/blank/blank.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './pages/profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { AccountlistComponent } from './pages/accountlist/accountlist.component';
import { MoneyTransferComponent } from './pages/money-transfer/money-transfer.component';
import { DepositComponent } from './pages/deposit/deposit.component';
import { VirmanComponent } from './pages/virman/virman.component';
import { EftComponent } from './pages/eft/eft.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { PayBillComponent } from './pages/pay-bill/pay-bill.component';
import { PaymenthistoryComponent } from './pages/paymenthistory/paymenthistory.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    MenuSidebarComponent,
    BlankComponent,
    ProfileComponent,
    AccountlistComponent,
    MoneyTransferComponent,
    DepositComponent,
    VirmanComponent,
    EftComponent,
    HomepageComponent,
    PayBillComponent,
    PaymenthistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
