import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders, HttpResponse  } from '@angular/common/http';
import {Product} from './models/Product';
import {CountOfProducts} from './models/countOfProducts';
import {CountOfOpenedOrders} from './models/countOfOpenedOrders';
import {SoldProduct} from './models/soldProduct';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as moment from 'moment';
import {OpenedOrder} from './models/openedOrder';
import {StateOfOrder} from './models/stateOfOrder';
import {LoginResponse} from './models/loginResponse';
import {Location} from './models/location';

@Injectable({
  providedIn: 'root'
})
export class RestaurateurService {

  constructor(private http: HttpClient) { }

   // Returns all the products from the API
   getProducts(): Observable<Product[]> {
    return this.http.get('http://localhost:3000/api/products').pipe(map((res) => <any[]> res));
  }

        /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T> (operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
     // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
     // TODO: better job of transforming error for user consumption
        this.log(`${operation} failed: ${error.message}`);
        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }

    private log(message: string) {
      console.log(message);
    }

  // Returns the more sold products today
  getSoldProductsToday(): Observable<SoldProduct[]>{
    const now = moment();
    const dataOfQuery = {
      "beginDate":now.format("YYYY-MM-DD"),
       "endDate":now.format("YYYY-MM-DD")
    };
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post('http://localhost:3000/api/moreSoldProductsInDateRange', dataOfQuery, httpOptions).pipe(
      tap((newClient: SoldProduct[]) => this.log('More sold products today were obtained.')),
      catchError(this.handleError<SoldProduct[]>('getSoldProductsToday'))
    );
  }

  // Returns the more sold products in the week
  getMoreSoldProductsInWeek(): Observable<SoldProduct[]> {
    const beginDate = moment().subtract(7, 'days').format("YYYY-MM-DD");
    const dataOfQuery = {
      "beginDate": beginDate,
       "endDate": moment().format("YYYY-MM-DD")
    };
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post('http://localhost:3000/api/moreSoldProductsInDateRange', dataOfQuery, httpOptions).pipe(
      tap((newReportOfSoldProducts: SoldProduct[]) => this.log('More sold products in the week were obtained.')),
      catchError(this.handleError<SoldProduct[]>('getMoreSoldProductsInWeek'))
    );
  }

  // Returns the count of products from the API
  countOfProducts() {
    return this.http.get<CountOfProducts>('http://localhost:3000/api/countOfProducts');
  }

  // Returns the count of opened orders
  countOfOpenedOrders() {
    return this.http.get<CountOfOpenedOrders>('http://localhost:3000/api/countOpenedOrders');
  }

  getOpenedOrders() {
    return this.http.get<OpenedOrder[]>('http://localhost:3000/api/getSummaryOfOpenedOrders');
  }

  getLocations() {
    return this.http.get<Location[]>('http://localhost:3000/api/locations');
  }
  
  closeOrder(idOfOrder): Observable<StateOfOrder> {
    const dataOfQuery = {
      "request_id": idOfOrder
    };
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.put<StateOfOrder>('http://localhost:3000/api/closeRequest', dataOfQuery, httpOptions)
    .pipe( catchError(this.handleError<StateOfOrder>('closeOrder')));
  }

  cancelOrder(idOfOrder): Observable<StateOfOrder> {
    const dataOfQuery = {
      "request_id": idOfOrder
    };
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.put<StateOfOrder>('http://localhost:3000/api/cancelRequest', dataOfQuery, httpOptions)
    .pipe( catchError(this.handleError<StateOfOrder>('cancelOrder')));
  }

  addOrder(origin: string, products: string[]): Observable<StateOfOrder> {
    const dataOfQuery = {
      "origin": origin,
       "products": products
    };
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post('http://localhost:3000/api/newRequest', dataOfQuery, httpOptions).pipe(
      tap((newClient: StateOfOrder) => this.log('A new order was created')),
      catchError(this.handleError<StateOfOrder>('addOrder'))
    );
  }

  login(username: string, password: string): Observable<HttpResponse<LoginResponse>> {
    const dataOfQuery = {
      "user": username,
      "password": password
    };
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response' as 'body'
    };
    return this.http.post<HttpResponse<LoginResponse>>('http://localhost:3000/api/login', dataOfQuery, httpOptions).pipe(
      map(response => {return response})
    );
  }
}
