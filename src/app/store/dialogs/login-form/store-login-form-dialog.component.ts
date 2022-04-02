/*
 * Copyright (c) 2022 The Trebol eCommerce Project
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, switchMapTo, takeUntil, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/authentication.service';
import { ProfileService } from 'src/app/profile.service';
import { DialogSwitcherButtonComponent } from 'src/app/shared/components/dialog-switcher-button/dialog-switcher-button.component';
import { Login } from 'src/models/Login';
import { COMMON_DISMISS_BUTTON_LABEL, COMMON_ERROR_MESSAGE } from 'src/text/messages';
import { StoreRegistrationFormDialogComponent } from '../registration-form/store-registration-form-dialog.component';

@Component({
  selector: 'app-store-login-form-dialog',
  templateUrl: './store-login-form-dialog.component.html',
  styleUrls: ['./store-login-form-dialog.component.css']
})
export class StoreLoginFormDialogComponent
  implements OnInit {

  private loggingInSource = new Subject();
  private hidePasswordSource = new BehaviorSubject(true);

  loggingIn$ = this.loggingInSource.asObservable();

  togglePasswordIcon$: Observable<string>;
  passwordInputType$: Observable<string>;

  formGroup: FormGroup;
  get username(): FormControl { return this.formGroup.get('username') as FormControl; }
  get password(): FormControl { return this.formGroup.get('password') as FormControl; }

  @ViewChild('registerButton', { static: true }) registerButton: DialogSwitcherButtonComponent;

  constructor(
    private dialog: MatDialogRef<StoreLoginFormDialogComponent>,
    private formBuilder: FormBuilder,
    private snackBarService: MatSnackBar,
    private authenticationService: AuthenticationService,
    private profileService: ProfileService
  ) {
    this.formGroup = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.togglePasswordIcon$ = this.hidePasswordSource.asObservable().pipe(map(hide => (hide ? 'visibility' : 'visibility_off')));
    this.passwordInputType$ = this.hidePasswordSource.asObservable().pipe(map(hide => (hide ? 'password' : 'text')));
  }

  ngOnInit(): void {
    this.registerButton.sourceDialogRef = this.dialog;
    this.registerButton.targetDialogComponent = StoreRegistrationFormDialogComponent;
    this.registerButton.targetDialogConfig = { width: '40rem' };
  }

  showPassword(): void { this.hidePasswordSource.next(false); }
  hidePassword(): void { this.hidePasswordSource.next(true); }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.loggingInSource.next(true);

      const details: Login = {
        name: this.username.value,
        password: this.password.value
      };

      this.authenticationService.login(details).pipe(
        takeUntil(this.authenticationService.authCancelation$),
        tap(() => {
          this.dialog.close();
          const successMessage = $localize`:Message of success after login:You have logged in`
          this.snackBarService.open(successMessage, COMMON_DISMISS_BUTTON_LABEL);
        }),
        catchError(err => {
          if (err.status === 403) {
            const errorMessage = $localize`:Message of error due to bad/erroneous credentials:Your credentials were rejected`;
            this.snackBarService.open(errorMessage, COMMON_DISMISS_BUTTON_LABEL);
          } else {
            this.snackBarService.open(COMMON_ERROR_MESSAGE, COMMON_DISMISS_BUTTON_LABEL);
          }
          this.loggingInSource.next(false);
          return throwError(err);
        }),
        switchMapTo(this.profileService.getUserProfile())
      ).subscribe();
    }
  }

  onCancel(): void {
    this.authenticationService.cancelAuthentication();
    this.dialog.close();
  }

}
