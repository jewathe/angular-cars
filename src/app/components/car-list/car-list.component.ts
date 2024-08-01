import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Car } from 'src/app/common/car';
import { CartItem } from 'src/app/common/cart-item';
import { CarService } from 'src/app/services/car.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-car-list',

  templateUrl: './car-list-grid.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {

  cars: Car[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // new proprties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements = 0;
  previousKeyword: string = '';

  constructor(private carService: CarService,
    private cartService: CartService,
    private route: ActivatedRoute) { }
  // inject the activatedRoute, the current active route that loaded the component
  // useful for accessing route parameters
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listCars();
    })

  }

  listCars() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchCars();
    } else {
      this.handleListCar();
    }

  }

  handleSearchCars() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // if we have a different keyword than previous than set thPageNumber to 1
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    // Now search for the car using keyword
    this.carService.searchCarsPaginate(this.thePageNumber - 1,
      this.thePageSize, theKeyword).subscribe(this.processResult());
  }

  handleListCar() {

    // Method is invoking once you "subscribe"
    // check if "id" parameter is available
    //  use the actived route, state of route at this given moment in time, map of all the route parameters, read the id parameter
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      // get the "id" para string, convert string to a number usinge "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      // no category id available ... default to category id 1
      this.currentCategoryId = 1;
    }

    // check if we have a different category than previous
    // Note: Angular will reuse a component if it is currently being viewed

    // if we have a different than previous  the set thePageNumber to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    // get the products for the given category id
    this.carService.getCarListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId)
      .subscribe(this.processResult());
    // pagination component : pages  are 1 based
    // Spring Data REST : pages are 0 based

  }
  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listCars();
  }

  processResult() {
    return (data: any) => { // assigned propertis with data from Spring Data REST
      this.cars = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  addToCart(theCar: Car) {
    console.log(`Adding to cart: ${theCar.name}, ${theCar.unitPrice}`);
    // @ TODO
    const theCartItem = new CartItem(theCar);
    this.cartService.addToCart(theCartItem);
  }
}

