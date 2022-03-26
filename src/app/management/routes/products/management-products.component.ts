/*
 * Copyright (c) 2022 The Trebol eCommerce Project
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Product } from 'src/models/entities/Product';
import { COMMON_DISMISS_BUTTON_LABEL, COMMON_ERROR_MESSAGE } from 'src/text/messages';
import { EntityFormDialogConfig } from '../../dialogs/entity-form/EntityFormDialogConfig';
import { TransactionalDataManagerComponentDirective } from '../../directives/transactional-data-manager/transactional-data-manager.component.directive';
import { ManagementProductsService } from './management-products.service';

@Component({
  selector: 'app-management-products',
  templateUrl: './management-products.component.html',
  styleUrls: [
    '../data-manager.styles.css',
    './management-products.component.css'
  ]
})
export class ManagementProductsComponent
  extends TransactionalDataManagerComponentDirective<Product>
  implements OnInit {

  tableColumns = [ 'name', 'barcode', 'price', 'actions' ];
  // tableColumns = [ 'name', 'barcode', 'price', 'currentStock', 'criticalStock', 'actions' ];

  constructor(
    protected service: ManagementProductsService,
    protected dialogService: MatDialog,
    protected route: ActivatedRoute,
    private snackBarService: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    super.init(this.service);
  }

  protected createDialogProperties(item: Product): EntityFormDialogConfig<Product> {
    return {
      data: {
        item,
        entityType: 'product',
        apiService: this.service.dataService
      },
      width: '40rem',
      maxHeight: '80vh'
    };
  }

  onClickDelete(prod: Product) {
    this.service.removeItems([prod]).pipe(
      map(results => results[0]),
      catchError(error => {
        this.snackBarService.open(COMMON_ERROR_MESSAGE, COMMON_DISMISS_BUTTON_LABEL);
        return of(error);
      }),
      tap(() => {
        const message = $localize`:Message of success after deleting a product with name {{ name }}:Product '${prod.name}:name:' deleted`;
        this.snackBarService.open(message, COMMON_DISMISS_BUTTON_LABEL);
        this.service.reloadItems();
      })
    ).subscribe();
  }

}
