/*
 * Copyright (c) 2021 The Trébol eCommerce Project
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Observable, of } from 'rxjs';
import { DataPage } from 'src/app/models/DataPage';
import { ITransactionalEntityDataApiService } from '../transactional-entity.data-api.iservice';
import {
  matchesDateProperty, matchesIdProperty, matchesNumberProperty, matchesStringProperty
} from './entity-data.local-memory-api.functions';

/**
 * Base class for a fully-working CRUD service in the local (client) memory.
 */
export abstract class TransactionalEntityDataLocalMemoryApiService<T>
  implements ITransactionalEntityDataApiService<T> {

  protected abstract items: T[];
  protected abstract itemExists(itemLike: Partial<T>): boolean;
  protected abstract getIndexOfItem(itemLike: Partial<T>): number;

  /**
   * Iterates each key-value property pair in the provided object,
   * filters all items matching the same properties.
   */
  protected filterItems(filter: any): T[] {
    let matchingItems = this.items;
    for (const propName in filter) {
      if (filter.hasOwnProperty(propName) && propName !== 'id') {
        const propValue = filter[propName];
        if (typeof propValue === 'string') {
          matchingItems = matchingItems.filter(it => matchesStringProperty(it, propName, propValue));
        } else if (typeof propValue === 'number') {
          matchingItems = matchingItems.filter(it => matchesNumberProperty(it, propName, propValue));
        } else if (typeof propValue === 'object') {
          if (propValue instanceof Date) {
            matchingItems = matchingItems.filter(it => matchesDateProperty(it, propName, propValue));
          } else if ('id' in propValue) {
            matchingItems = matchingItems.filter(it => matchesIdProperty(it, propName, propValue));
          }
        }
      }
    }

    return matchingItems;
  }

  create(item: T) {
    return new Observable<void>(
      observer => {
        if (this.itemExists(item)) {
          observer.error({ status: 400 });
        }
        this.items.push(item);
        observer.next();
        observer.complete();
        return {
          unsubscribe() { }
        };
      }
    );
  }


  fetchExisting(itemLike: Partial<T>) {
    const index = this.getIndexOfItem(itemLike);
    return of<T>(this.items[index]);
  }

  /**
   * Get the entire collection and emit it.
   * //TODO paging would be nice
   */
  fetchPage() {
    return of<DataPage<T>>({
      items: this.items.slice(0, 9),
      totalCount: this.items.length,
      pageIndex: 0,
      pageSize: 10
    });
  }

  fetchPageFilteredBy(filters: any) {
    return new Observable<DataPage<T>>(
      observer => {
        const matchingItems = this.filterItems(filters);
        observer.next({
          items: matchingItems.slice(0, 9),
          totalCount: matchingItems.length,
          pageIndex: 0,
          pageSize: 10
        });
        observer.complete();

        return {
          unsubscribe() {}
        };
      }
    );
  }

  update(d: T, original?: T) {
    return new Observable<void>(
      observer => {
        const index = original ? this.getIndexOfItem(original) : this.getIndexOfItem(d);
        const existingItem = this.items[index];
        if (existingItem === null) {
          observer.error({ status: 404 });
        } else {
          Object.assign(this.items[index], d);
          observer.next();
          observer.complete();
        }

        return {
          unsubscribe() { }
        };
      }
    );
  }

  delete(item: Partial<T>) {
    return new Observable<void>(
      observer => {
        const index = this.getIndexOfItem(item);
        if (index === -1) {
          observer.error({ status: 404 });
        } else {
          this.items.splice(index, 1);
          observer.next();
          observer.complete();
        }

        return {
          unsubscribe() { }
        };
      }
    );
  }
}
