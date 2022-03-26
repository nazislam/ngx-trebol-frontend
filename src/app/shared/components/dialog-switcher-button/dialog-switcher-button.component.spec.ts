/*
 * Copyright (c) 2022 The Trebol eCommerce Project
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { InformationDialogComponent } from 'src/app/shared/dialogs/information/information-dialog.component';
import { DialogSwitcherButtonComponent } from './dialog-switcher-button.component';

describe('DialogSwitcherButtonComponent', () => {
  let component: DialogSwitcherButtonComponent;
  let fixture: ComponentFixture<DialogSwitcherButtonComponent>;
  let dialogService: MatDialog;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatButtonModule,
        MatDialogModule
      ],
      declarations: [
        DialogSwitcherButtonComponent,
        InformationDialogComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSwitcherButtonComponent);
    component = fixture.componentInstance;
    dialogService = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close a dialog and open another when calling onClick()', () => {
    const dialogRef = dialogService.open(InformationDialogComponent);
    component.sourceDialogRef = dialogRef;

    const targetDialog = InformationDialogComponent;
    const targetDialogConfig = { data: { message: 'test' } };
    component.targetDialogComponent = targetDialog;
    component.targetDialogConfig = targetDialogConfig;

    const sourceDialogCloseSpy = spyOn(dialogRef, 'close').and.callThrough();
    const targetDialogOpenSpy = spyOn(dialogService, 'open').and.callThrough();
    component.onClick();
    fixture.detectChanges();
    dialogService.closeAll();
    expect(sourceDialogCloseSpy).toHaveBeenCalled();
    expect(targetDialogOpenSpy).toHaveBeenCalled();
    expect(targetDialogOpenSpy.calls.first().args[0]).toBe(targetDialog);
    expect(targetDialogOpenSpy.calls.first().args[1]).toEqual(targetDialogConfig);
  });
});
