import { Car } from "./car";

export class CartItem {

  id: string;
  name: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;

  constructor(car: Car) {
    this.id = '' + car.id;
    this.name = car.name;
    this.imageUrl = car.imageUrl;
    this.unitPrice = car.unitPrice;
    this.quantity = 1;
  }
}
