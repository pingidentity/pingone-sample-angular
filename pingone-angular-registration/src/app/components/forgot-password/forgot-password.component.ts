import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { PingApiService } from 'src/app/pingone-api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  userForm: FormGroup;
  passwordRecoveryForm: FormGroup;
  loading = false;
  userNotFound = false;
  userDataSaved = false;
  codeResend = false;
  errorText: string;

  private userInfo: any;

  constructor(
    private fb: FormBuilder,
    private pingService: PingApiService,
  ) {
    this.initForm();
  }

  get username() {
    return this.userForm.get('username');
  }
  get userData() {
    return this.userInfo;
  }
  get recoveryCode() {
    return this.passwordRecoveryForm.get('recoveryCode');
  }
  get password() {
    return this.passwordRecoveryForm.get('password');
  }
  get confirmPassword() {
    return this.passwordRecoveryForm.get('confirmPassword');
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.findUser();
    }
  }

  onSave() {
    if (this.passwordRecoveryForm.valid) {
      this.recoverPassword();
    }
  }

  onResend() {
    this.resendRecoveryCode();
  }

  toggleSecret($event) {
    $event.target.parentNode.previousElementSibling.type = $event.target.checked ? 'text' : 'password';
    $event.target.parentNode.lastElementChild.innerHTML = $event.target.checked ? '<i class=\'fa fa-fw fa-eye-slash\'>'
        : '<i class=\'fa fa-fw fa-eye\'>';
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
      username: ['', Validators.required],
    });
  }

  private findUser() {
    this.loading = true;
    this.userNotFound = false;
    this.pingService.pingApiClient
        .findUser(this.userForm.get('username').value)
        .then(users => {
          const user = this.getUser(users);
          if (!user) {
            this.userNotFound = true;
            this.loading = false;
            this.userInfo = null;
          } else {
            this.pingService.pingApiClient.sendRecoveryCode(user.id)
                .then(result => {
                  this.pingService.pingApiClient.getPasswordPattern()
                      .then(pwdPattern => {
                        this.initRecoveryForm(pwdPattern);
                        this.userInfo = user;
                        this.loading = false;
                      })
                })
          }
        })
  }

  private getUser(users) {
    return users['_embedded']['users'][0];
  }

  private initRecoveryForm(pwdPattern: string) {
    this.passwordRecoveryForm = this.fb.group({
      recoveryCode: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(pwdPattern)]],
      confirmPassword: ['', [
        Validators.required,
        Validators.pattern(pwdPattern),
        this.confirmPasswordValidator(),
      ]]
    });
  }

  private recoverPassword() {
    this.pingService.pingApiClient
        .recoverPassword(
          this.userData.id,
          this.recoveryCode.value,
          this.password.value,
        )
        .then(result => {
          this.userDataSaved = true;
        })
        .catch((unknownError) => {
          console.log(unknownError);
          this.errorText = unknownError;
        });
  }

  private resendRecoveryCode() {
    this.pingService.pingApiClient
        .sendRecoveryCode(this.userData.id)
        .then(() => {
          this.codeResend = true;
        })
        .catch((unknownError) => {
          console.log(unknownError);
        });
  }

  private confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if (!this.passwordRecoveryForm) {
        return null;
      }
      const notMatch = control.value !== this.password.value;
      return notMatch ? {'confirmPasswordIncorrect': {value: control.value}} : null;
    };
  }

}
