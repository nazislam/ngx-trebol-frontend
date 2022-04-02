/*
 * Copyright (c) 2022 The Trebol eCommerce Project
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { SessionService } from 'src/app/session.service';
import { ManagementService } from 'src/app/management/management.service';
import { EditProfileFormDialogComponent } from 'src/app/shared/dialogs/edit-profile-form/edit-profile-form-dialog.component';
import { SharedDialogService } from 'src/app/shared/dialogs/shared-dialog.service';
import { environment } from 'src/environments/environment';
import { Image } from 'src/models/entities/Image';
import { COMMON_DISMISS_BUTTON_LABEL } from 'src/text/messages';
import { ProfileService } from 'src/app/profile.service';

@Component({
  selector: 'app-management-header',
  templateUrl: './management-header.component.html',
  styleUrls: ['./management-header.component.css']
})
export class ManagementHeaderComponent {

  readonly appTitle: string = environment.labels.name;
  readonly appLogo: Image = environment.staticImages.logo;

  moduleName$: Observable<string>;
  userName$: Observable<string>;

  // TODO refactor down this component like it was done with the store-header
  constructor(
    protected service: ManagementService,
    protected sessionService: SessionService,
    protected profileService: ProfileService,
    protected dialogService: MatDialog,
    protected sharedDialogService: SharedDialogService,
    protected router: Router,
    protected snackBarService: MatSnackBar
  ) {
    this.moduleName$ = this.service.currentPageName$.pipe();
    this.userName$ = this.profileService.userName$.pipe();
  }

  switchSidenavOpenState(): void {
    this.service.toggleSidenav();
  }

  onClickEditProfile(): void {
    this.dialogService.open(
      EditProfileFormDialogComponent,
      {
        width: '40rem',
      }
    );
  }

  onClickLogout(): void {
    this.sharedDialogService.requestConfirmation({
      title: $localize`:Title of dialog prompt for logging out:Log out?`,
      message: $localize`:Label to hint user that any undergoing process may be lost when logging out:Any unsaved data may be lost`
    }).pipe(
      filter(didConfirm => didConfirm),
      tap(() => {
        this.sessionService.closeCurrentSession();
        this.router.navigateByUrl('/');
        const message = $localize`:Message after logging out:You have logged out`;
        this.snackBarService.open(message, COMMON_DISMISS_BUTTON_LABEL);
      })
    ).subscribe();
  }

}
