/*
 * Copyright (c) 2021 The Trébol eCommerce Project
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { API_SERVICE_INJECTION_TOKENS } from 'src/app/api/api-service-injection-tokens';
import { IEntityDataApiService } from 'src/app/api/entity.data-api.iservice';
import { AngularMaterialModule } from 'src/app/shared/angular-material/angular-material.module';
import { SellFormComponent } from './sell-form.component';
import { SellFormService } from './sell-manager-form.service';

describe('SellFormComponent', () => {
  let component: SellFormComponent;
  let fixture: ComponentFixture<SellFormComponent>;
  let mockService: Partial<SellFormService>;
  let mockDataApiService: Partial<IEntityDataApiService<any>>;

  beforeEach(waitForAsync(() => {
    mockService = {
      refreshSellDetailsFrom(i) {},
      sellDetails$: of([]),
      sellNetValue$: of(0),
      sellTotalValue$: of(0),
      addProducts(p) {},
      increaseDetailProductQuantityAtIndex(i) {},
      decreaseDetailProductQuantityAtIndex(i) {},
      removeDetailAtIndex(i) {}
    };
    mockDataApiService = {
      fetchPage() {
        return of({
          items: [],
          totalCount: 0,
          pageIndex: 0,
          pageSize: 10
        });
      }
    };

    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        AngularMaterialModule
      ],
      declarations: [ SellFormComponent ],
      providers: [
        { provide: API_SERVICE_INJECTION_TOKENS.dataCustomers, useValue: mockDataApiService },
        { provide: API_SERVICE_INJECTION_TOKENS.dataSalespeople, useValue: mockDataApiService },
        { provide: API_SERVICE_INJECTION_TOKENS.dataBillingTypes, useValue: mockDataApiService },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    TestBed.overrideProvider(SellFormService, { useValue: mockService });
    fixture = TestBed.createComponent(SellFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
