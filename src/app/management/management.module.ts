/*
 * Copyright (c) 2022 The Trebol eCommerce Project
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { NgModule } from '@angular/core';
import { MatSnackBarConfig, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManagementDataActionsComponent } from './components/data-actions/management-data-actions.component';
import { ManagementFooterComponent } from './components/footer/management-footer.component';
import { ManagementHeaderComponent } from './components/header/management-header.component';
import { ImageFormComponent } from './components/image-form/image-form.component';
import { ProductCategoryFormComponent } from './components/product-category-form/product-category-form.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductListFormComponent } from './components/product-list-form/product-list-form.component';
import { SalespersonFormComponent } from './components/salesperson-form/salesperson-form.component';
import { SellFormComponent } from './components/sell-form/sell-form.component';
import { ShipperFormComponent } from './components/shipper-form/shipper-form.component';
import { ManagementSidenavComponent } from './components/sidenav/management-sidenav.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { EntityFormDialogComponent } from './dialogs/entity-form/entity-form-dialog.component';
import { ImagesArrayDialogComponent } from './dialogs/images-array/images-array-dialog.component';
import { ProductListContentsDialogComponent } from './dialogs/product-list-contents/product-list-contents-dialog.component';
import { ProductsArrayDialogComponent } from './dialogs/products-array/products-array-dialog.component';
import { ManagementSellReviewDialogComponent } from './dialogs/sell-review/management-sell-review-dialog.component';
import { ManagementRoutingGuard } from './management-routing.guard';
import { ManagementRoutingModule } from './management-routing.module';
import { ManagementComponent } from './management.component';
import { ManagementService } from './management.service';
import { ManagementCustomersComponent } from './routes/customers/management-customers.component';
import { ManagementCustomersService } from './routes/customers/management-customers.service';
import { ManagementDashboardComponent } from './routes/dashboard/management-dashboard.component';
import { ManagementImagesComponent } from './routes/images/management-images.component';
import { ManagementImagesService } from './routes/images/management-images.service';
import { ManagementProductCategoriesComponent } from './routes/product-categories/management-product-categories.component';
import { ManagementProductCategoriesService } from './routes/product-categories/management-product-categories.service';
import { ManagementProductListsComponent } from './routes/product-lists/management-product-lists.component';
import { ManagementProductListsService } from './routes/product-lists/management-product-lists.service';
import { ManagementProductsComponent } from './routes/products/management-products.component';
import { ManagementProductsService } from './routes/products/management-products.service';
import { ManagementSalesComponent } from './routes/sales/management-sales.component';
import { ManagementSalesService } from './routes/sales/management-sales.service';
import { ManagementSalespeopleComponent } from './routes/salespeople/management-salespeople.component';
import { ManagementSalespeopleService } from './routes/salespeople/management-salespeople.service';
import { ManagementShippersComponent } from './routes/shippers/management-shippers.component';
import { ManagementShippersService } from './routes/shippers/management-shippers.service';
import { ManagementUsersComponent } from './routes/users/management-users.component';
import { ManagementUsersService } from './routes/users/management-users.service';

const SNACKBAR_DEFAULTS: MatSnackBarConfig = {
  duration: 5000
};

@NgModule({
  declarations: [
    ImageFormComponent,
    ProductFormComponent,
    ProductCategoryFormComponent,
    ProductListFormComponent,
    SalespersonFormComponent,
    SellFormComponent,
    ShipperFormComponent,
    UserFormComponent,
    EntityFormDialogComponent,
    ImagesArrayDialogComponent,
    ProductsArrayDialogComponent,
    ManagementDataActionsComponent,
    ManagementFooterComponent,
    ManagementHeaderComponent,
    ManagementSidenavComponent,
    ProductListContentsDialogComponent,
    ManagementSellReviewDialogComponent,
    ManagementComponent,
    ManagementCustomersComponent,
    ManagementDashboardComponent,
    ManagementImagesComponent,
    ManagementProductCategoriesComponent,
    ManagementProductListsComponent,
    ManagementProductsComponent,
    ManagementSalesComponent,
    ManagementSalespeopleComponent,
    ManagementShippersComponent,
    ManagementUsersComponent
  ],
  imports: [
    SharedModule,
    ManagementRoutingModule
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: SNACKBAR_DEFAULTS },
    ManagementRoutingGuard,
    ManagementService,
    ManagementCustomersService,
    ManagementImagesService,
    ManagementProductCategoriesService,
    ManagementProductListsService,
    ManagementProductsService,
    ManagementSalesService,
    ManagementSalespeopleService,
    ManagementShippersService,
    ManagementUsersService
  ]
})
export class ManagementModule { }
