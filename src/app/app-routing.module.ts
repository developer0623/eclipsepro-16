import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
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
      {
        path: 'settings',
        loadChildren: () => import('./main/settings/settings.module').then(m => m.SettingsModule),
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
