/*
 * Copyright (c) 2021 The Trébol eCommerce Project
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { Person } from 'src/app/models/entities/Person';
import { COMMON_WARNING_MESSAGE, UNKNOWN_ERROR_MESSAGE } from 'src/text/messages';
import { EditProfileFormService } from './edit-profile-form.service';

@Component({
  selector: 'app-edit-profile-form-dialog',
  templateUrl: './edit-profile-form-dialog.component.html',
  styleUrls: ['./edit-profile-form-dialog.component.css']
})
export class EditProfileFormDialogComponent
  implements OnInit {

  private confirmCancel: boolean;

  saving$: Observable<boolean>;
  cancelButtonColor$: Observable<string>;
  invalid$: Observable<boolean>;

  formGroup: FormGroup;

  get person() { return this.formGroup.get('person') as FormControl; }

  constructor(
    private service: EditProfileFormService,
    private dialog: MatDialogRef<EditProfileFormDialogComponent>,
    private snackBarService: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
    this.saving$ = this.service.saving$.pipe();
    this.cancelButtonColor$ = this.service.confirmCancel$.pipe(
      tap(c => { this.confirmCancel = c; }),
      map(c => (c ? 'warn' : 'default'))
    );
    this.formGroup = this.formBuilder.group({
      person: ['']
    });
  }

  ngOnInit(): void {
    this.service.loadProfile().subscribe(
      p => {
        this.person.setValue(p);
      }
    );

    this.invalid$ = this.formGroup.statusChanges.pipe(
      map(status => status !== 'VALID'),
      startWith(true)
    );
  }

  onSubmit(): void {
    const data = this.person.value as Person;
    if (data) {
      this.service.saveProfile(data).subscribe(
        success => {
          if (success) {
            const succesfulSaveMessage = $localize`:succesful profile edit|Label for success after editing profile information:Sus datos fueron registrados exitosamente`;
            this.snackBarService.open(succesfulSaveMessage, 'OK');
            this.dialog.close();
          } else {
            this.snackBarService.open(COMMON_WARNING_MESSAGE, 'OK');
          }
        },
        error => {
          this.snackBarService.open(UNKNOWN_ERROR_MESSAGE , 'OK');
        }
      );
    }
  }

  onCancel(): void {
    if (!this.confirmCancel) {
      this.service.confirmCancel();
    } else {
      this.dialog.close();
    }
  }

}
