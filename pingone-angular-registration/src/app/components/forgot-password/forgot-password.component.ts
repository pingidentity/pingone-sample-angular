import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PingApiService } from 'src/app/pingone-api.service';
import { FormHelper } from 'src/app/form-helper';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends FormHelper {

  @ViewChild("passwordRef") passwordInput: ElementRef;
  @ViewChild("confirmPasswordRef") confirmPasswordInput: ElementRef;

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
    super();
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

  resendRecoveryCode() {
    this.pingService.pingApiClient
        .sendRecoveryCode(this.userData.id)
        .then(() => {
          this.codeResend = true;
        })
        .catch((unknownError) => {
          console.error(unknownError);
        });
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
                      });
                });
          }
        });
  }

  private initRecoveryForm(pwdPattern: string) {
    this.passwordRecoveryForm = this.fb.group({
      recoveryCode: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(pwdPattern)]],
      confirmPassword: ['', [
        Validators.required,
        Validators.pattern(pwdPattern),
      ]]
    }, {
      validator: this.mustMatch('password', 'confirmPassword'),
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
          this.errorText = unknownError;
        });
  }
}
