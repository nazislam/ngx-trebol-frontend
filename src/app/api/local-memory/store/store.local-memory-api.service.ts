// Copyright (c) 2020 Benjamin La Madrid
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CompanyDetails } from 'src/app/models/CompanyDetails';
import { IStoreApiService } from '../../store-api.iservice';
import { Product } from 'src/app/models/entities/Product';
import { ProductFilters } from 'src/app/shared/components/product-filters-panel/product-filters-panel.component';
import { SellDetail } from 'src/app/models/entities/SellDetail';
import { ExternalPaymentRedirectionData } from 'src/app/models/ExternalPaymentRedirectionData';
import { Receipt } from 'src/app/models/entities/Receipt';
import { API_SERVICE_INJECTION_TOKENS } from '../../api-service-injection-tokens';
import { EntityDataLocalMemoryApiService } from '../entity-data.local-memory-api.abstract.service';
import { MOCK_COMPANY_DETAILS } from './examples/mock-company-details.examples';
import { MOCK_EXTERNAL_PAYMENT_REDIRECT_DATA } from './examples/mock-external-payment-redirect-data.examples';
import { DataPage } from 'src/app/models/DataPage';
import { map } from 'rxjs/operators';

@Injectable()
export class StoreLocalMemoryApiService
  implements IStoreApiService {

  protected items: Product[] = [];

  constructor(
    @Inject(API_SERVICE_INJECTION_TOKENS.dataProducts) private dataService: EntityDataLocalMemoryApiService<Product>
  ) {
    this.dataService.readAll().subscribe(response => {
      this.items = response.items;
    });
  }


  protected filterItems(filter: ProductFilters): Product[] {
    let matchingItems = this.items;
    if (filter.name) {
      matchingItems = matchingItems.filter(
        it => it.name.toUpperCase().includes(filter.name.toUpperCase())
      );
    }
    if (filter.categoryCode) {
      matchingItems = matchingItems.filter(
        it => it.category.id === filter.categoryCode
      );
    }

    return matchingItems;
  }

  public fetchProductById(id: number): Observable<Product> {
    return new Observable(
      observer => {
        const index = this.items.findIndex(d => d.id === id);
        if (index === -1) {
          observer.error({ status: 404 });
        }

        observer.next(this.items[index]);
        observer.complete();

        return {
          unsubscribe() {}
        };
      }
    );
  }

  public fetchStoreFrontProductCollection(): Observable<DataPage<Product>> {
    return of(this.items).pipe(
      map(items => ({
        totalCount: items.length,
        items,
        pageSize: items.length,
        pageIndex: 0
      }))
    );
  }

  public fetchFilteredProductCollection(filter: ProductFilters): Observable<DataPage<Product>> {
    return new Observable(
      observer => {
        const matchingItems = this.filterItems(filter);
        observer.next({
          totalCount: matchingItems.length,
          items: matchingItems,
          pageSize: matchingItems.length,
          pageIndex: 0
        });
        observer.complete();

        return {
          unsubscribe() {}
        };
      }
    );
  }

  public fetchCompanyDetails(): Observable<CompanyDetails> {
    return of(MOCK_COMPANY_DETAILS);
  }

  public submitCart(): Observable<ExternalPaymentRedirectionData> {
    return of(MOCK_EXTERNAL_PAYMENT_REDIRECT_DATA);
  }

  public fetchTransactionReceiptById(id: number): Observable<Receipt> {
    throw new Error('Method not implemented.');
  }
}
