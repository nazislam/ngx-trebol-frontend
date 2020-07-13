import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from 'src/data/services/http/http.abstract-service';
import { Product } from 'src/data/models/entities/Product';
import { ProductFilters } from 'src/app/shared/product-filters-panel/product-filters-panel.component';
import { retry, map } from 'rxjs/operators';
import { EntityDataIService } from '../entity.data.iservice';

@Injectable()
export class ProductsHttpDataService
  extends HttpService
  implements EntityDataIService<Product> {

  protected baseURI = this.baseURI + '/gestion/productos';

  constructor(
    protected http: HttpClient
  ) {
    super();
  }
  readById(id: string | number): Observable<Product> {
    throw new Error('Method not implemented.');
  }
  update(emp: Product, id: string | number): Observable<Product> {
    throw new Error('Method not implemented.');
  }

  public readAll(): Observable<Product[]> {
    return this.http.get<Product[]>(
      this.baseURI
    ).pipe(
      retry(2)
    );
  }

  public readFiltered(filtros: ProductFilters): Observable<Product[]> {
    return this.http.get<Product[]>(
      this.baseURI,
      this.parametrosHttp(filtros)
    ).pipe(
      retry(2)
    );
  }

  public readByTypeId(idTipo: number): Observable<Product[]> {
    return this.readFiltered({
      typeId: idTipo
    });
  }

  public readByFamilyId(idFamilia: number): Observable<Product[]> {
    return this.readFiltered({
      familyId: idFamilia
    });
  }

  public create(prod: Product): Observable<Product> {
    return this.http.post<number>(
      this.baseURI + '/guardar',
      prod
    ).pipe(
      map(id => {
        prod.id = id;
        return prod;
      })
    );
  }

  public deleteById(idProducto: number): Observable<boolean> {
    return this.http.post<boolean>(
      this.baseURI + '/borrar',
      idProducto
    );
  }
}
