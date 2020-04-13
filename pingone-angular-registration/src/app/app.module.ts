import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { PingApiService } from './pingone-api.service';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    UserRegistrationComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [PingApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
