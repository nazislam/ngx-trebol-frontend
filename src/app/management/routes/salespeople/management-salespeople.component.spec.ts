/*
 * Copyright (c) 2021 The Trébol eCommerce Project
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ManagementSalespeopleComponent } from './management-salespeople.component';
import { ManagementSalespeopleService } from './management-salespeople.service';

@Component({ selector: 'app-centered-mat-spinner' })
class MockCenteredMatSpinnerComponent { }

@Component({ selector: 'app-management-data-actions' })
class MockManagementDataActionsComponent {
  @Output() add = new EventEmitter();
}

describe('ManagementSalespeopleComponent', () => {
  let component: ManagementSalespeopleComponent;
  let fixture: ComponentFixture<ManagementSalespeopleComponent>;
  let mockManagerService: Partial<ManagementSalespeopleService>;
  let mockSnackBarService: Partial<MatSnackBar>;
  let mockDialogService: Partial<MatDialog>;

  beforeEach(waitForAsync(() => {
    mockManagerService = {
      removeItems() { return of([true]); },
      reloadItems() {},
      loading$: of(false),
      focusedItems$: of([]),
      items$: of([]),
      canEdit$: of(true),
      canAdd$: of(true),
      canDelete$: of(true),
      updateAccess(acc) {}
    };
    mockSnackBarService = {
      open(m: string, a: string) { return void 0; }
    };
    mockDialogService = {
      open() { return void 0; }
    };

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NoopAnimationsModule,
        RouterTestingModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
      ],
      declarations: [
        ManagementSalespeopleComponent,
        MockCenteredMatSpinnerComponent,
        MockManagementDataActionsComponent
      ],
      providers: [
        { provide: ManagementSalespeopleService, useValue: mockManagerService },
        { provide: MatSnackBar, useValue: mockSnackBarService },
        { provide: MatDialog, useValue: mockDialogService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementSalespeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
