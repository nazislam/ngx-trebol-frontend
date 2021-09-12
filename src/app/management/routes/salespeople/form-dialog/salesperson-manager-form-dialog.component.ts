// Copyright (c) 2020 Benjamin La Madrid
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Salesperson } from 'src/app/models/entities/Salesperson';
import { COMMON_WARNING_MESSAGE, UNKNOWN_ERROR_MESSAGE } from 'src/text/messages';
import { DataManagerFormComponentDirective } from '../../data-manager-form.component-directive';
import { SalespersonManagerFormService } from './salesperson-manager-form.service';
import { DataManagerFormDialogData } from '../../DataManagerFormDialogData';

@Component({
  selector: 'app-salesperson-manager-form-dialog',
  templateUrl: './salesperson-manager-form-dialog.component.html',
  styleUrls: [ './salesperson-manager-form-dialog.component.css' ]
})
export class SalespersonManagerFormDialogComponent
  extends DataManagerFormComponentDirective<Salesperson> {

  protected itemId: number;

  public saving$: Observable<boolean>;

  public formGroup: FormGroup;
  get person() { return this.formGroup.get('person') as FormControl; }

  public get dialogTitle(): string { return ((this.data?.item?.id) ? 'Actualizar datos de' : 'Nuevo') + ' Empleado'; }

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: DataManagerFormDialogData<Salesperson>,
    protected service: SalespersonManagerFormService,
    protected dialog: MatDialogRef<SalespersonManagerFormDialogComponent>,
    protected snackBarService: MatSnackBar,
    protected formBuilder: FormBuilder
  ) {
    super();
    this.formGroup = this.formBuilder.group({
      person: ['']
    });

    const item: Salesperson = (this.data?.item) ? this.data.item : new Salesperson();
    this.load(item);
  }

  protected load(e: Salesperson): void {
    this.person.setValue(e);
  }

  public asItem(): Salesperson {
    if (this.formGroup.invalid) {
      return undefined;
    } else {
      return Object.assign<Salesperson, Partial<Salesperson>>(
        new Salesperson(),
        {
          id: this.itemId,
          person: this.person.value
        }
      );
    }
  }

  public onSubmit(): void {
    const item = this.asItem();
    if (item) {
      this.service.submit(item).subscribe(
        success => {
          if (success) {
            if (item.id) {
              this.snackBarService.open(`Empleado ${item.person.name} actualizado/a exitosamente.`, 'OK');
            } else {
              this.snackBarService.open(`Empleado ${item.person.name} registrado/a exitosamente.`, 'OK');
            }
            this.dialog.close(item);
          } else {
            this.snackBarService.open(COMMON_WARNING_MESSAGE, 'OK');
          }
        },
        error => {
          this.snackBarService.open(UNKNOWN_ERROR_MESSAGE, 'OK');
        }
      );
    }
  }

  public onCancel(): void {
    this.dialog.close();
  }

}
