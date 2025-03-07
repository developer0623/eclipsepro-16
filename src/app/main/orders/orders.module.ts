import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AgGridAngular } from 'ag-grid-angular';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxTranslateModule } from '../../translate/translate.module';
import { PipesModule } from '../shared/pipes/pipes.module';
import { InlineEditorModule } from '../shared/inline-editor/inline-editor.module';
import { DirectivesModule } from '../shared/directives/directives.module';
import { ComponentsModule } from '../shared/components/components.module';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { BulkEditDialogComponent } from './orders-list/components/bulk-edit-dialog/bulk-edit-dialog.component';
import { BulkDeleteDialogComponent } from './orders-list/components/bulk-delete-dialog/bulk-delete-dialog.component';
import { BundleItemComponent } from './order-detail/components/bundle-item/bundle-item.component';
import { ItemPatternComponent } from './order-detail/components/item-pattern/item-pattern.component';
import { SplitModalComponent } from './order-detail/components/split-modal/split-modal.component';
import { CombineToNewBundlesDialogComponent } from './order-detail/components/combine-to-new-bundles-dialog/combine-to-new-bundles-dialog.component';
import { ItemBulkEditDialogComponent } from './order-detail/components/item-bulk-edit-dialog/item-bulk-edit-dialog.component';
import { OrderDefChangeDialogComponent } from './order-detail/components/order-def-change-dialog/order-def-change-dialog.component';
import { OrdersRoutingModule } from './orders-routing.module';

// const listState = {
//   name: 'app.orders',
//   url: '/orders',
//   views: {
//     'content@app': { component: OrdersListComponent },
//   },
// };

// const detailState = {
//   name: 'app.orders.detail',
//   url: '/:id',
//   views: {
//     'content@app': { component: OrderDetailComponent },
//   },
// };

@NgModule({
  declarations: [
    OrdersListComponent,
    OrderDetailComponent,
    BulkEditDialogComponent,
    BulkDeleteDialogComponent,
    BundleItemComponent,
    ItemPatternComponent,
    SplitModalComponent,
    CombineToNewBundlesDialogComponent,
    ItemBulkEditDialogComponent,
    OrderDefChangeDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatToolbarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatExpansionModule,
    MatAutocompleteModule,
    AgGridAngular,
    NgScrollbarModule,
    NgxTranslateModule,
    InlineEditorModule,
    PipesModule,
    DirectivesModule,
    ComponentsModule,
    OrdersRoutingModule
  ],
  providers: [],
})
export class OrdersModule {}
