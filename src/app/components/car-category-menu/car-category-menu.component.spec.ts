import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarCategoryMenuComponent } from './car-category-menu.component';

describe('CarCategoryMenuComponent', () => {
  let component: CarCategoryMenuComponent;
  let fixture: ComponentFixture<CarCategoryMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarCategoryMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarCategoryMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
