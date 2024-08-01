import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Car } from 'src/app/common/car';
import { CartItem } from 'src/app/common/cart-item';
import { CarService } from 'src/app/services/car.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css']
})
export class CarDetailsComponent implements OnInit {
  car!: Car; // '!' is the non-null assertion operator
  // Tells TypeScript compiler to suspend strict null
  // and undefined checks for a property
  constructor(private carService: CarService,
    private cartService: CartService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleCarDetails();

    })
  }
  handleCarDetails() {
    // get "id" param string. convert string to anumber using "+" symbol
    const theCarId: number = +this.route.snapshot.paramMap.get('id')!;
    this.carService.getCar(theCarId).subscribe(
      data => {
        this.car = data;
      }
    )
  }

  addToCart() {
    console.log(`Adding to cart: ${this.car.name}, ${this.car.unitPrice}`);
    const theCartItem = new CartItem(this.car);
    this.cartService.addToCart(theCartItem);
  }
}
