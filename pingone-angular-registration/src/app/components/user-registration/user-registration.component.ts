import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';

import { PingApiService } from 'src/app/pingone-api.service';
import { FormHelper } from 'src/app/form-helper';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent extends FormHelper implements OnInit {

  @ViewChild("passwordRef") passwordInput: ElementRef;
  @ViewChild("confirmPasswordRef") confirmPasswordInput: ElementRef;

  userForm: FormGroup;
  userCreated = false;
  initialized = false;
  loading = false;
  errorText: string;

  private populationListArray = [];
  private pwdPattern: string;

  constructor(
    private fb: FormBuilder,
    private pingService: PingApiService,
  ) {
    super();
  }

  get name() {
    return this.userForm.get('name');
  }
  get email() {
    return this.userForm.get('email');
  }
  get password() {
    return this.userForm.get('password');
  }
  get confirmPassword() {
    return this.userForm.get('confirmPassword');
  }
  get population() {
    return this.userForm.get('population');
  }
  get populationList() {
    return this.populationListArray;
  }

  ngOnInit(): void {
    this.pingService.pingApiClient.getPopulations().then(populations => {
      this.populationListArray = populations['_embedded']['populations'];
      this.pingService.pingApiClient.getPasswordPattern().then(pwdPattern => {
        this.pwdPattern = pwdPattern;
        this.initForm();
        this.initialized = true;
      })
    })
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.loading = true;
      this.addUser();
    }
  }

  private initForm() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.pwdPattern)]],
      confirmPassword: ['', [
        Validators.required,
        Validators.pattern(this.pwdPattern),
      ]],
      population: ['', Validators.required],
    }, {
      validator: this.mustMatch('password', 'confirmPassword'),
    });
  }

  private addUser() {
    this.pingService.pingApiClient.addUser(
      this.email.value,
      this.name.value,
      this.population.value,
    )
    .then(user => {
      return this.pingService.pingApiClient.setPassword(user["id"], this.password.value);
    })
    .then((result) => {
      this.userCreated = !this.userCreated;
      this.loading = false;
    })
    .catch((unknownError) => {
      this.errorText = unknownError;
      this.loading = false;
    });
  }
}
