/*
 * Copyright (c) 2022 The Trebol eCommerce Project
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, finalize, map, mapTo, share, switchMap, take, tap } from 'rxjs/operators';
import { API_SERVICE_INJECTION_TOKENS } from 'src/app/api/api-service-injection-tokens';
import { ILoginPublicApiService } from 'src/app/api/login-public-api.iservice';
import { environment } from 'src/environments/environment';
import { AuthorizedAccess } from 'src/models/AuthorizedAccess';
import { Person } from 'src/models/entities/Person';
import { Login } from 'src/models/Login';
import { Registration } from '../models/Registration';
import { IAccessApiService } from './api/access-api.iservice';
import { IGuestPublicApiService } from './api/guest-public-api.iservice';
import { IProfileAccountApiService } from './api/profile-account-api.iservice';
import { IRegisterPublicApiService } from './api/register-public-api.iservice';

@Injectable({ providedIn: 'root' })
export class AppService
  implements OnDestroy {

  private readonly sessionStorageTokenItemName = environment.secrets.sessionStorageTokenItem;

  private isLoggedInChangesSource = new ReplaySubject<boolean>(1);
  private isValidatingSessionSource = new BehaviorSubject(false);
  private checkoutAuthCancelSource = new Subject<void>();
  private userProfileSource = new BehaviorSubject<Person>(null);

  isLoggedInChanges$ = this.isLoggedInChangesSource.asObservable();
  isValidatingSession$ = this.isValidatingSessionSource.asObservable();
  checkoutAuthCancel$ = this.checkoutAuthCancelSource.asObservable();
  userName$ = this.getUserNameObservable();

  constructor(
    @Inject(API_SERVICE_INJECTION_TOKENS.login) private loginApiService: ILoginPublicApiService,
    @Inject(API_SERVICE_INJECTION_TOKENS.guest) private guestApiService: IGuestPublicApiService,
    @Inject(API_SERVICE_INJECTION_TOKENS.register) private registerApiService: IRegisterPublicApiService,
    @Inject(API_SERVICE_INJECTION_TOKENS.accountProfile) private profileApiService: IProfileAccountApiService,
    @Inject(API_SERVICE_INJECTION_TOKENS.access) private accessApiService: IAccessApiService
  ) {
    this.validateSession().subscribe();
  }

  ngOnDestroy(): void {
    this.isLoggedInChangesSource.complete();
    this.isValidatingSessionSource.complete();
    this.checkoutAuthCancelSource.complete();
    this.userProfileSource.complete();
  }

  cancelAuthentication(): void {
    this.checkoutAuthCancelSource.next();
  }

  guestLogin(personDetails: Person) {
    return this.guestApiService.guestLogin(personDetails).pipe(
      tap(token => this.saveAuthToken(token))
    );
  }

  /** Send an error-safe register request. */
  register(userDetails: Registration) {
    return this.registerApiService.register(userDetails).pipe(
      switchMap(() => this.login({
        name: userDetails.name,
        password: userDetails.password
      })),
      mapTo(true),
      catchError(() => of(false))
    );
  }

  login(credentials: Login) {
    return this.isLoggedInChanges$.pipe(
      take(1),
      switchMap(isLoggedIn => (!isLoggedIn ?
        this.loginApiService.login(credentials).pipe(
          tap(token => this.saveAuthToken(token))
        ) :
        of('')
      ))
    );
  }

  validateSession(): Observable<boolean> {
    this.isValidatingSessionSource.next(true);

    return this.accessApiService.getAuthorizedAccess().pipe(
      switchMap(() => this.getUserProfile()),
      mapTo(true),
      catchError(() => of(false)),
      tap(isValid => this.isLoggedInChangesSource.next(isValid)),
      finalize(() => this.isValidatingSessionSource.next(false))
    );
  }

  getAuthorizedAccess(): Observable<AuthorizedAccess> {
    return this.isLoggedInChanges$.pipe(
      take(1),
      switchMap(isLoggedIn => (isLoggedIn ?
        this.accessApiService.getAuthorizedAccess() :
        of(null)
      ))
    );
  }

  getUserProfile(): Observable<Person> {
    if (this.userProfileSource.value) {
      return this.userProfileSource.asObservable();
    }
    return this.profileApiService.getProfile().pipe(
      tap(profile => this.userProfileSource.next(profile))
    );
  }

  updateUserProfile(details: Person): Observable<boolean> {
    return this.profileApiService.updateProfile(details);
  }

  closeCurrentSession(): void {
    this.isLoggedInChangesSource.next(false);
    this.userProfileSource.next(null);
    sessionStorage.removeItem(this.sessionStorageTokenItemName);
  }

  private saveAuthToken(token: any) {
    sessionStorage.setItem(this.sessionStorageTokenItemName, token);
    this.isLoggedInChangesSource.next(true);
  }

  private getUserNameObservable() {
    return this.userProfileSource.asObservable().pipe(
      map(p => (p?.firstName || '')),
      share()
    );
  }

}
