/*
 * Copyright (c) 2022 The Trebol eCommerce Project
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Observable } from 'rxjs';
import { ITransactionalEntityDataApiService } from './transactional-entity.data-api.iservice';

export interface ICompositeEntityDataApiService<T, X>
  extends ITransactionalEntityDataApiService<T> {

  fetchInnerDataFrom(itemLike: Partial<T>): Observable<X[]>;
}
