import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  // subject is a subclass of Observable. We can use Subject to populish events in our code
  // the event will be sent to all of the the subscribers
  //totalPrice: Subject<number> = new Subject<number>();
  //totalQuantity: Subject<number> = new Subject<number>();
  // we replace subject by BehaviorSubject to ... see doc in the screenshot
  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  //storage: Storage = sessionStorage; // Reference to web browser's session storage
  storage: Storage = localStorage; // data is persisted and survives browser restarts
  constructor() {
    // read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems')!);
    // JSON.parse(...) reads JSON string and converts to an object
    if (data != null) {
      this.cartItems = data;

      // compute totals based on the data that is read from storage
      this.computeCartTotals();
    }
  }

  addToCart(theCartItem: CartItem) {

    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem!: CartItem;
    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id
      // executes test for each element in the array until test passes
      // returns first element that passes else returns undefined
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id)!;

      // check if found it
      alreadyExistsInCart = (existingCartItem != undefined)
    }
    if (alreadyExistsInCart) {
      // increment the quantity
      existingCartItem.quantity++;
    } else {
      // just add the item to the array
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
    // publish the new values ... all subscribers will receive the new data
    // This will publish events to all subscribers
    // one event for totalPrice
    // one event for totaQuantity
    // .next publish/send event
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data for debugging purpose
    this.logCartData(totalPriceValue, totalQuantityValue);

    // persist cart data
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  persistCartItems() {
    // JSON.stringify() converts object to JSON string
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');

    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, unitPrice: ${tempCartItem.unitPrice}, subTotalPrice: ${subTotalPrice}`);
    }
    // log with 2 digits after decimal
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`)
    console.log('------')
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    // get index of item from the array at the given index
    const itemIndex = this.cartItems.findIndex(temCartItem => temCartItem.id === theCartItem.id);

    // if found, remove the item from the array at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
    }
    this.computeCartTotals();
  }
}
