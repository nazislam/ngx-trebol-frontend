/*
 * Copyright (c) 2021 The Trébol eCommerce Project
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Component, EventEmitter, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl, ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR,
  ValidationErrors, Validator, Validators
} from '@angular/forms';
import { merge, Observable, Subscription } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { API_SERVICE_INJECTION_TOKENS } from 'src/app/api/api-service-injection-tokens';
import { IEntityDataApiService } from 'src/app/api/entity.data-api.iservice';
import { Person } from 'src/models/entities/Person';
import { UserRole } from 'src/models/entities/UserRole';
import { FormGroupOwner } from 'src/models/FormGroupOwner';
import { collectValidationErrors } from 'src/functions/collectionValidationErrors';
import { isJavaScriptObject } from 'src/functions/isJavaScriptObject';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: [ './user-form.component.css' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: UserFormComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: UserFormComponent
    }
  ]
})
export class UserFormComponent
  implements OnInit, OnDestroy, ControlValueAccessor, Validator, FormGroupOwner {

  private touchedSubscriptions: Subscription[] = [];
  private valueChangesSubscriptions: Subscription[] = [];
  private touched = new EventEmitter<void>();

  people$: Observable<Person[]>;
  roles$: Observable<UserRole[]>;

  formGroup: FormGroup;
  get name() { return this.formGroup.get('name') as FormControl; }
  get password() { return this.formGroup.get('password') as FormControl; }
  get person() { return this.formGroup.get('person') as FormControl; }
  get role() { return this.formGroup.get('role') as FormControl; }

  constructor(
    @Inject(API_SERVICE_INJECTION_TOKENS.dataPeople) protected peopleDataApiService: IEntityDataApiService<Person>,
    @Inject(API_SERVICE_INJECTION_TOKENS.dataUserRoles) protected userRolesDataApiService: IEntityDataApiService<UserRole>,
    private formBuilder: FormBuilder
  ) {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      password: [''],
      person: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.people$ = this.peopleDataApiService.fetchPage().pipe(map(page => page.items));
    this.roles$ = this.userRolesDataApiService.fetchPage().pipe(map(page => page.items));
  }

  ngOnDestroy(): void {
    for (const sub of [
      ...this.valueChangesSubscriptions,
      ...this.touchedSubscriptions]) {
      sub.unsubscribe();
    }
  }

  writeValue(obj: any): void {
    this.name.reset('', { emitEvent: false });
    this.password.reset('', { emitEvent: false });
    this.person.reset('', { emitEvent: false });
    this.role.reset('', { emitEvent: false });
    if (isJavaScriptObject(obj)) {
      this.formGroup.patchValue(obj);
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    const sub = this.formGroup.valueChanges.pipe(debounceTime(250), tap(fn)).subscribe();
    this.valueChangesSubscriptions.push(sub);
  }

  registerOnTouched(fn: () => void): void {
    const sub = merge(this.touched).pipe(tap(fn)).subscribe();
    this.touchedSubscriptions.push(sub);
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.formGroup.disable({ emitEvent: false });
    } else {
      this.formGroup.enable({ emitEvent: false });
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const errors = {} as any;
    const value = control.value;
    if (value) {
      if (!value.name) {
        errors.requiredUserName = value.name;
      }
      if (!value.person) {
        errors.requiredUserPerson = value.person;
      }
      if (!value.role) {
        errors.requiredUserRole = value.role;
      }

      if (JSON.stringify(errors) !== '{}') {
        return errors;
      }
    }
  }

  onParentFormTouched(): void {
    this.formGroup.markAllAsTouched();
  }

}
