import { Component, OnInit } from '@angular/core';
import { CarCategory } from 'src/app/common/car-category';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-car-category-menu',
  templateUrl: './car-category-menu.component.html',
  styleUrls: ['./car-category-menu.component.css']
})
export class CarCategoryMenuComponent implements OnInit {
  carCategories: CarCategory[] = [];
  constructor(private carService: CarService) { }

  ngOnInit(): void {
    this.listCarCategories();
  }
  listCarCategories() {
    this.carService.getCarCategories().subscribe(
      data => {
        console.log("Car Categories= " + JSON.stringify(data));
        this.carCategories = data;
      }
    );
  }

}
