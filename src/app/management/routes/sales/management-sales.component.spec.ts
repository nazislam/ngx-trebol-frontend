/*
 * Copyright (c) 2022 The Trebol eCommerce Project
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ManagementSalesComponent } from './management-sales.component';
import { ManagementSalesService } from './management-sales.service';

@Component({ selector: 'app-centered-mat-spinner' })
class MockCenteredMatSpinnerComponent { }

@Component({ selector: 'app-management-data-actions-button-bar' })
class MockManagementDataActionsComponent {
  @Input() actions: string[];
  @Output() add = new EventEmitter();
}

describe('ManagementSalesComponent', () => {
  let component: ManagementSalesComponent;
  let fixture: ComponentFixture<ManagementSalesComponent>;
  let mockManagerService: Partial<ManagementSalesService>;
  let dialogServiceSpy: jasmine.SpyObj<MatDialog>;
  let snackBarServiceSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(waitForAsync(() => {
    mockManagerService = {
      removeItems() { return of([true]); },
      reloadItems() {},
      loading$: of(false),
      focusedItems$: of([]),
      items$: of([]),
      totalCount$: of(0),
      sortBy: undefined,
      order: undefined,
      pageIndex: undefined,
      pageSize: undefined
    };
    const mockDialogService = jasmine.createSpyObj('MatDialog', ['open']);
    const mockSnackBarService = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        MatButtonModule,
        MatIconModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
      ],
      declarations: [
        MockCenteredMatSpinnerComponent,
        MockManagementDataActionsComponent,
        ManagementSalesComponent
      ],
      providers: [
        { provide: ManagementSalesService, useValue: mockManagerService },
        { provide: MatDialog, useValue: mockDialogService },
        { provide: MatSnackBar, useValue: mockSnackBarService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    dialogServiceSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    snackBarServiceSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    fixture = TestBed.createComponent(ManagementSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
