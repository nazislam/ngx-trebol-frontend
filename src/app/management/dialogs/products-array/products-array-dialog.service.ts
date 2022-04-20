/*
 * Copyright (c) 2022 The Trebol eCommerce Project
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { API_INJECTION_TOKENS } from 'src/app/api/api-injection-tokens';
import { IEntityDataApiService } from 'src/app/api/entity.data-api.iservice';
import { DataPage } from 'src/models/DataPage';
import { Product } from 'src/models/entities/Product';

@Injectable()
export class ProductsArrayDialogService {

  private loadingSource = new BehaviorSubject(false);
  private pageSource = new ReplaySubject<DataPage<Product>>(1);
  private productArraySource = new BehaviorSubject([]);

  productsArray$ = this.productArraySource.asObservable();
  loading$ = this.loadingSource.asObservable();

  pageIndex = 0;
  pageSize: number;
  sortBy: string;
  order: string;
  filters: any;

  availableProducts$: Observable<Product[]>;
  totalCount$: Observable<number>;

  constructor(
    @Inject(API_INJECTION_TOKENS.dataProducts) private productDataService: IEntityDataApiService<Product>,
  ) {
    this.availableProducts$ = this.pageSource.asObservable().pipe(map(page => page.items));
    this.totalCount$ = this.pageSource.asObservable().pipe(map(page => page.totalCount));
  }

  reloadItems() {
    this.loadingSource.next(true);
    return this.productDataService.fetchPage(this.pageIndex, this.pageSize, this.sortBy, this.order, this.filters).pipe(
      tap(page => this.pageSource.next(page)),
      finalize(() => this.loadingSource.next(false))
    );
  }

  includeProduct(prod: Product): void {
    const productArraySet = new Set([...this.productArraySource.value]).add(prod);
    this.productArraySource.next([...productArraySet.values()]);
  }

  dropProductByIndex(index: number): void {
    this.productArraySource.value.splice(index, 1);
    this.productArraySource.next(this.productArraySource.value);
  }
}
