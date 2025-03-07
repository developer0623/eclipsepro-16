import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Needed for Touch functionality of Material Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { PendingInterceptorModule } from '../@fury/shared/loading-indicator/pending-interceptor.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AgGridAngular } from 'ag-grid-angular';
import { StoreModule, provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { CookieService } from 'ngx-cookie-service';
import { rootReducer } from './main/shared/services/clientData.store';
import { ClientDataEffects } from './main/shared/services/clientData.effects';
import { SchedulerEffects } from './main/shared/services/store/scheduler/effects';
import { OrderEffects } from './main/shared/services/store/order/effects';
import { ExplorerEffects } from './main/shared/services/store/productionexplorer/effects';
import { DeviceExplorerEffects } from './main/shared/services/store/deviceexplorer/effects';
import { AuthInterceptor } from './main/shared/services/auth-interceptor.service';

@NgModule({
  imports: [
    // Angular Core Module // Don't remove!
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AgGridAngular,

    // Fury Core Modules
    AppRoutingModule,

    // Layout Module (Sidenav, Toolbar, Quickpanel, Content)
    LayoutModule,

    // Displays Loading Bar when a Route Request or HTTP Request is pending
    PendingInterceptorModule,
    // StoreModule.forRoot({ data: rootReducer }),

    // Register a Service Worker (optional)
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'fill'
      } as MatFormFieldDefaultOptions
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      } as MatSnackBarConfig
    },
    provideStore(),
    provideState({ name: 'data', reducer: rootReducer }),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      // connectInZone: true // If set to true, the connection is established within the Angular zone
    }),
    provideEffects(
      ClientDataEffects,
      SchedulerEffects,
      OrderEffects,
      ExplorerEffects,
      DeviceExplorerEffects
    ),
  ]
})
export class AppModule {
}
