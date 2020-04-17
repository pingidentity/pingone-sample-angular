import { AbstractControl, FormGroup } from '@angular/forms';
import { ElementRef } from '@angular/core';

export class FormHelper {

  readonly errorMessages = {
    required: params => `${params.name} is required`,
    email: params => `${params.name} is not valid`,
    pattern: params => `Value is not valid`,
    mustMatch: params => `Passwords don't match`,
  };

  toggleSecret(control: ElementRef) {  
    if (control) {
      control.nativeElement.type = control.nativeElement.type === 'text' ? 'password' : 'text';
    }
  }

  isControllInvalid(control: AbstractControl): boolean {
    return control.errors && control.touched && control.dirty;
  }

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

  getUser(users) {
    return users['_embedded']['users'][0];
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
}
