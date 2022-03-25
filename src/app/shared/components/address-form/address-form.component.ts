/*
 * Copyright (c) 2021 The Trébol eCommerce Project
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl, ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS,
  NG_VALUE_ACCESSOR, ValidationErrors, Validator
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { isJavaScriptObject } from 'src/functions/isJavaScriptObject';
import { EntityFormGroupFactoryService } from '../../entity-form-group-factory.service';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: [ './address-form.component.css' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AddressFormComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: AddressFormComponent
    }
  ]
})
export class AddressFormComponent
  implements OnInit, OnDestroy, ControlValueAccessor, Validator {

  private valueChangesSub: Subscription;

  @Input() formGroup: FormGroup;
  get city() { return this.formGroup.get('city') as FormControl; }
  get municipality() { return this.formGroup.get('municipality') as FormControl; }
  get firstLine() { return this.formGroup.get('firstLine') as FormControl; }
  get secondLine() { return this.formGroup.get('secondLine') as FormControl; }
  get notes() { return this.formGroup.get('notes') as FormControl; }

  constructor(
    private formGroupService: EntityFormGroupFactoryService
  ) { }

  ngOnInit(): void {
    if (!this.formGroup) {
      this.formGroup = this.formGroupService.createFormGroupFor('address');
    }
    this.valueChangesSub = this.formGroup.valueChanges.pipe(
      debounceTime(100),
      tap(v => this.onChange(v))
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.valueChangesSub?.unsubscribe();
  }

  onChange(value: any): void { }
  onTouched(): void { }

  writeValue(obj: any): void {
    this.city.reset(null, { emitEvent: false });
    this.municipality.reset(null, { emitEvent: false });
    this.firstLine.reset(null, { emitEvent: false });
    this.secondLine.reset(null, { emitEvent: false });
    this.notes.reset(null, { emitEvent: false });
    if (isJavaScriptObject(obj)) {
      this.formGroup.patchValue(obj, { emitEvent: false });
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.formGroup.disable({ emitEvent: false });
    } else {
      this.formGroup.enable({ emitEvent: false });
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.formGroup.valid) {
      return null;
    }

    const errors = {} as ValidationErrors;

    if (this.city.errors) {
      errors.addressCity = this.city.errors;
    }
    if (this.municipality.errors) {
      errors.addressMunicipality = this.municipality.errors;
    }
    if (this.firstLine.errors) {
      errors.addressFirstLine = this.firstLine.errors;
    }
    if (this.secondLine.errors) {
      errors.addressSecondLine = this.secondLine.errors;
    }
    if (this.notes.errors) {
      errors.addressNotes = this.notes.errors;
    }

    return errors;
  }

}
