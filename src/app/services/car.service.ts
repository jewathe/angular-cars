import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Car } from '../common/car';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CarCategory } from '../common/car-category';


@Injectable({
  providedIn: 'root'
})
export class CarService {

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';
  // Inject HttpClient
  constructor(private httpClient: HttpClient) { }

  getCar(theCarId: number): Observable<Car> {
    // need to build URL based on Car id
    const carUrl = `${this.baseUrl}/${theCarId}`;
    return this.httpClient.get<Car>(carUrl);
  }
  getCarListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProducts> {
    // need to build based on category id, page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }

  getCarList(theCategoryId: number): Observable<Car[]> {
    // need to build based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getCars(searchUrl);

  }

  searchCars(theKeyword: string): Observable<Car[]> {
    // need to build based on the keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getCars(searchUrl);

  }

  searchCarsPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetResponseProducts> {
    // need to build based on keyword, page and size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}` + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }

  getCars(searchUrl: string): Observable<Car[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(map(response => response._embedded.products));
  }

  getCarCategories(): Observable<CarCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      // return an observable Map the JSON data from Sprig Data to Car array
      map(response => response._embedded.productCategory)
    );

  }

}

interface GetResponseProducts {
  // Unwrap the JSON from Spring Data REST _embedded entry
  _embedded: {
    products: Car[];
  },
  page: {
    size: number, // size of the page
    totalElements: number, // grand of all elements in the db, but we are not return all, just the count for info purpose only.
    totalPages: number, // total pages available
    number: number // current page number
  }
}
interface GetResponseProductCategory {
  // Unwrap the JSON from Spring Data REST _embedded entry
  _embedded: {
    productCategory: CarCategory[];
  }
}
