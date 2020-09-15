import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Provider } from 'src/data/models/entities/Provider';
import { HttpService } from 'src/shared/http.abstract-service';
import { EntityDataIService } from '../entity.data.iservice';

@Injectable()
export class ProvidersHttpDataService
  extends HttpService
  implements EntityDataIService<Provider> {

  constructor(
    protected http: HttpClient
  ) {
    super();
  }

  public create(provider: Provider): Observable<number> {
    return this.http.post<number>(
      `${this.baseURI}/provider`,
      provider
    );
  }

  public readById(id: number): Observable<Provider> {
    return this.http.get<Provider>(
      `${this.baseURI}/provider/${id}`
    );
  }

  public readAll(): Observable<Provider[]> {
    return this.http.get<Provider[]>(
      `${this.baseURI}/providers`
    );
  }

  public readFiltered(filters: any): Observable<Provider[]> {
    return this.http.get<Provider[]>(
      `${this.baseURI}/providers`,
      this.httpParamsOf(filters)
    );
  }

  public update(provider: Provider, id: string | number): Observable<number> {
    return this.http.put<number>(
      `${this.baseURI}/provider/${id}`,
      provider
    );
  }

  public deleteById(id: number): Observable<boolean> {
    return this.http.delete<boolean>(
      `${this.baseURI}/provider/${id}`
    );
  }
}
