import { Inject, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CarListComponent } from './components/car-list/car-list.component';
import { CarService } from './services/car.service';
import { Routes, RouterModule, Router } from '@angular/router';
import { CarCategoryMenuComponent } from './components/car-category-menu/car-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { CarDetailsComponent } from './components/car-details/car-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { OktaAuthModule, OktaCallbackComponent, OKTA_CONFIG, OktaAuthGuard } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import kiwiAppConfig from './config/kiwi-app-config';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';

const oktaConfig = kiwiAppConfig.oidc;
const oktaAuth = new OktaAuth(oktaConfig);
function sendToLoginPage(oktaAuth: OktaAuth, injector: Injector) {
  // Use injector to access any service available within your application
  const router = injector.get(Router);
  // Redirect the user to your custom login page
  router.navigate(['/login']);
}
const routes: Routes = [

  { path: 'login/callback', component: OktaCallbackComponent },
  { path: 'login', component: LoginComponent },
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [OktaAuthGuard], data: { onAuthRequired: sendToLoginPage } },
  { path: 'members', component: MembersPageComponent, canActivate: [OktaAuthGuard], data: { onAuthRequired: sendToLoginPage } },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'cart-details', component: CartDetailsComponent },
  { path: 'products/:id', component: CarDetailsComponent },
  { path: 'search/:keyword', component: CarListComponent },
  { path: 'category/:id', component: CarListComponent },
  { path: 'category', component: CarListComponent },
  { path: 'products', component: CarListComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    CarListComponent,
    CarCategoryMenuComponent,
    SearchComponent,
    CarDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    MembersPageComponent,
    OrderHistoryComponent,

  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    OktaAuthModule
  ],
  providers: [CarService, { provide: OKTA_CONFIG, useValue: { oktaAuth } }],
  bootstrap: [AppComponent]
})
export class AppModule { }
