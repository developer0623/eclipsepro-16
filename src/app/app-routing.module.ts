import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/authentication/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/authentication/register/register.module').then(m => m.RegisterModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/authentication/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
  },
  {
    path: 'coming-soon',
    loadChildren: () => import('./pages/coming-soon/coming-soon.module').then(m => m.ComingSoonModule),
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      // { path: '', redirectTo: 'dashboards/machines', pathMatch: 'full' },
      // { path: '**', redirectTo: 'dashboards/machines' },
      {
        path: 'dashboards/machines',
        loadChildren: () => import('./main/dashboards/dashboards.module').then(m => m.DashboardsModule),
      },
      {
        path: 'orders',
        loadChildren: () => import('./main/orders/orders.module').then(m => m.OrdersModule),
      },
      {
        path: 'punch-patterns',
        loadChildren: () => import('./main/punch-pattern/punch-pattern.module').then(m => m.PunchPatternModule),
      },
      {
        path: 'inventory',
        loadChildren: () => import('./main/inventory/inventory.module').then(m => m.InventoryModule),
      },
      {
        path: 'warehouse',
        loadChildren: () => import('./main/warehouse/warehouse.module').then(m => m.WarehouseModule),
      },
      {
        path: 'report',
        loadChildren: () => import('./main/reports/reports.module').then(m => m.ReportsModule),
      },
      {
        path: 'production-explorer',
        loadChildren: () => import('./main/explorer/explorer.module').then(m => m.ExplorerModule),
      },
      {
        path: 'machines',
        loadChildren: () => import('./main/machines/machines.module').then(m => m.MachinesModule),
      },
      {
        path: 'tooling',
        loadChildren: () => import('./main/tooling/tooling.module').then(m => m.ToolingModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledNonBlocking',
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
