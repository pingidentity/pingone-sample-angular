import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';

import { PingApiService } from 'src/app/pingone-api.service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit {

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
  ) { }

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

  toggleSecret($event) {
    $event.target.parentNode.previousElementSibling.type = $event.target.checked ? 'text' : 'password';
    $event.target.parentNode.lastElementChild.innerHTML = $event.target.checked ? '<i class=\'fa fa-fw fa-eye-slash\'>'
        : '<i class=\'fa fa-fw fa-eye\'>';
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.loading = true;
      this.addUser();
    }
  }

  isControllInvalid(control: AbstractControl): boolean {
    return control.errors && control.touched && control.dirty;
  }

  readonly errorMessages = {
    required: params => `${params.name} is required`,
    email: params => `${params.name} is not valid`,
    pattern: params => `Value is not valid`,
    confirmPasswordIncorrect: params => `Passwords don't match`,
  };

  getErrors(control: AbstractControl, name: string = 'Field') {
    if (control.errors) {
      return Object.keys(control.errors).map(field => {
        return this.errorMessages[field]({
          ...control.errors[field],
          name,
        });
      });
    } else {
      return false;
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
        this.confirmPasswordValidator(),
      ]],
      population: ['', Validators.required],
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
      console.log(unknownError);
      this.errorText = unknownError;
      this.loading = false;
    });

  }

  private confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if (!this.userForm) {
        return null;
      }
      const notMatch = control.value !== this.password.value;
      return notMatch ? {'confirmPasswordIncorrect': {value: control.value}} : null;
    };
  }

}
