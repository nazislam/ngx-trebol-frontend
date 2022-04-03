/*
 * Copyright (c) 2022 The Trebol eCommerce Project
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY, of } from 'rxjs';
import { SessionService } from 'src/app/session.service';
import { ManagementService } from 'src/app/management/management.service';
import { SharedDialogService } from 'src/app/shared/dialogs/shared-dialog.service';
import { ManagementHeaderComponent } from './management-header.component';
import { ProfileService } from 'src/app/profile.service';

describe('ManagementHeaderComponent', () => {
  let component: ManagementHeaderComponent;
  let fixture: ComponentFixture<ManagementHeaderComponent>;
  let mockManagementService: Partial<ManagementService>;
  let mockSessionService: Partial<SessionService>;
  let mockProfileService: Partial<ProfileService>;
  let mockSnackBarService: Partial<MatSnackBar>;
  let mockDialogService: Partial<MatDialog>;
  let mockSharedDialogService: Partial<SharedDialogService>;

  beforeEach(waitForAsync(() => {
    mockManagementService = {
      toggleSidenav() {},
      currentPageName$: of('')
    };
    mockSessionService = {
      closeCurrentSession() {}
    };
    mockProfileService = {
      userName$: of('')
    };
    mockSnackBarService = {
      open(m: string, a: string) { return void 0; }
    };
    mockDialogService = {
      open() { return void 0; }
    };
    mockSharedDialogService = {
      requestConfirmation() { return EMPTY; }
    };

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule
      ],
      declarations: [
        ManagementHeaderComponent
      ],
      providers: [
        { provide: ManagementService, useValue: mockManagementService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: ProfileService, useValue: mockProfileService },
        { provide: MatSnackBar, useValue: mockSnackBarService },
        { provide: MatDialog, useValue: mockDialogService },
        { provide: SharedDialogService, useValue: mockSharedDialogService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
