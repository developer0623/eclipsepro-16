import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import {
  DndDraggableDirective,
  DndDropEvent,
  DndDropzoneDirective,
  DndPlaceholderRefDirective,
} from 'ngx-drag-drop';
import { NgxTranslateModule } from 'src/app/translate/translate.module';
import { SystemPreferencesComponent } from './system-preferences/system-preferences.component';
import { BundlingComponent } from './bundling/bundling.component';
import { ConfirmDialogComponent } from './bundling/confirm-dialog/confirm-dialog.component';
import { AddBundlerDialogComponent } from './bundling/add-bundler-dialog/add-bundler-dialog.component';
import { PipesModule } from '../shared/pipes/pipes.module';
import { InlineEditorModule } from '../shared/inline-editor/inline-editor.module';
import { DirectivesModule } from '../shared/directives/directives.module';
import { ComponentsModule } from '../shared/components/components.module';
import { LicensingComponent } from './licensing/licensing.component';
import { AddLicenseDialogComponent } from './licensing/add-license-dialog/add-license-dialog.component';
import { MetricConfigComponent } from './metric-config/metric-config.component';
import { LossCodeComponent } from './loss-code/loss-code.component';
import { DelayCodeComponent } from './loss-code/delay-code/delay-code.component';
import { WallboardComponent } from './wallboard/wallboard.component';
import { EditWallboardDialogComponent } from './wallboard/edit-wallboard-dialog/edit-wallboard-dialog.component';
import { EditPanelDialogComponent } from './wallboard/edit-panel-dialog/edit-panel-dialog.component';
import { ScrapCodeComponent } from './loss-code/scrap-code/scrap-code.component';
import { AddCodeDialogComponent } from './loss-code/add-code-dialog/add-code-dialog.component';
import { CodeConfirmDialogComponent } from './loss-code/confirm-dialog/confirm-dialog.component';
import { WorkgroupsComponent } from './loss-code/workgroups/workgroups.component';
import { EditWorkgroupComponent } from './loss-code/workgroups/edit-workgroup/edit-workgroup.component';
import { IntegrationComponent } from './integration/integration.component';
import { HideCompletePipe } from './integration/hide-complete.pipe';
import { ConfigTypePipe } from './integration/config-type.pipe';
import { AddConfigComponent } from './integration/add-config/add-config.component';
import { TimeInputComponent } from './integration/time-input/time-input.component';
import { ImportFileTestFormComponent } from './integration/import-file-test-form/import-file-test-form.component';
import { ApiKeyManagementFormComponent } from './integration/api-key-management-form/api-key-management-form.component';
import { NewApiKeyModalComponent } from './integration/new-api-key-modal/new-api-key-modal.component';
import { PerformanceStandardsComponent } from './performance-standards/performance-standards.component';
import { ComponentsModule as PerformanceComponentsModule } from './performance-standards/components/components.module';
import { PrintingComponent } from './printing/printing.component';
import { EditPropertyModalComponent } from './printing/edit-property-modal/edit-property-modal.component';
import { PrintingPreviewComponent } from './printing-preview/printing-preview.component';
import { UsersComponent } from './users/users.component';
import { EclipseUsersGridComponent } from './users/eclipse-users-grid/eclipse-users-grid.component';
import { ResetPasswordModalComponent } from './users/reset-password-modal/reset-password-modal.component';
import { UserProfleComponent } from './users/user-profle/user-profle.component';
import { UserSettingsComponent } from './users/user-settings/user-settings.component';
import { StatusViewComponent } from './status/status-view/status-view.component';
import { ExpressSparklineComponent } from './status/express-sparkline/express-sparkline.component';
import { ExpressViewComponent } from './status/express-view/express-view.component';
import { PendingActionsToAgentComponent } from './status/pending-actions-to-agent/pending-actions-to-agent.component';
import { ServiceHealthComponent } from './status/service-health/service-health.component';
import { SyncStateGridComponent } from './status/sync-state-grid/sync-state-grid.component';
import { SystemAlertsComponent } from './status/system-alerts/system-alerts.component';
import { UpdateComponent } from './update/update.component';
import { ExperimentsComponent } from './experiments/experiments.component';
import { AgentComponent } from './agent/agent.component';
import { SettingsRoutingModule } from './settings-routing.module';

// const systemPreferencesState = {
//   name: 'app.system-preferences',
//   url: '/settings/system-preferences',
//   views: {
//     'content@app': { component: SystemPreferencesComponent },
//   },
//   // component: DashboardsComponent,
//   // Mark this state as requiring authentication.  See ../global/requiresAuth.hook.js.
//   // data: { requiresAuth: true }
// };

// const bundlingState = {
//   name: 'app.bundling',
//   url: '/settings/bundling',
//   views: {
//     'content@app': { component: BundlingComponent },
//   },
//   // component: DashboardsComponent,
//   // Mark this state as requiring authentication.  See ../global/requiresAuth.hook.js.
//   // data: { requiresAuth: true }
// };

// const licenseState = {
//   name: 'app.licensing',
//   url: '/settings/licensing',
//   views: {
//     'content@app': { component: LicensingComponent },
//   },
//   // component: DashboardsComponent,
//   // Mark this state as requiring authentication.  See ../global/requiresAuth.hook.js.
//   // data: { requiresAuth: true }
// };

// const metricConfigState = {
//   name: 'app.metric-config',
//   url: '/settings/metric-config',
//   views: {
//     'content@app': { component: MetricConfigComponent },
//   },
//   // component: DashboardsComponent,
//   // Mark this state as requiring authentication.  See ../global/requiresAuth.hook.js.
//   // data: { requiresAuth: true }
// };

// const lossCodeState = {
//   name: 'app.losscode',
//   url: '/settings/losscode?{tab:int}',
//   views: {
//     'content@app': { component: LossCodeComponent },
//   },
//   params: {
//     tab: { dynamic: true },
//   },
//   // component: DashboardsComponent,
//   // Mark this state as requiring authentication.  See ../global/requiresAuth.hook.js.
//   // data: { requiresAuth: true }
// };

// const wallboardState = {
//   name: 'app.wallboard',
//   url: '/settings/wallboard?{tab:int}',
//   views: {
//     'content@app': { component: WallboardComponent },
//   },
//   params: {
//     tab: { dynamic: true },
//   },
//   // component: DashboardsComponent,
//   // Mark this state as requiring authentication.  See ../global/requiresAuth.hook.js.
//   // data: { requiresAuth: true }
// };

// const integrationState = {
//   name: 'app.integration',
//   url: '/settings/integration?{tab:int}',
//   views: {
//     'content@app': { component: IntegrationComponent },
//   },
//   params: {
//     tab: { dynamic: true },
//   },
// };

// const performanceStandardsState = {
//   name: 'app.performance-standards',
//   url: '/settings/performancestandards',
//   views: {
//     'content@app': { component: PerformanceStandardsComponent },
//   },
// };

// const printingState = {
//   name: 'app.printing',
//   url: '/settings/printing?{tab:int}',
//   views: {
//     'content@app': { component: PrintingComponent },
//   },
//   params: {
//     tab: { dynamic: true },
//   },
// };

// const printingPreviewState = {
//   name: 'app.printing-preview',
//   url: '/settings/printing-preview?{template:string}',
//   views: {
//     'content@app': { component: PrintingPreviewComponent },
//   },
//   params: {
//     template: { dynamic: true },
//   },
// };

// const usersState = {
//   name: 'app.users',
//   url: '/settings/users',
//   views: {
//     'content@app': { component: UsersComponent },
//   },
// };

// const userState = {
//   name: 'app.user',
//   url: '/settings/users/:userName',
//   views: {
//     'content@app': { component: UserSettingsComponent },
//   },
//   params: {
//     userName: { dynamic: true },
//   },
// };

// const statusState = {
//   name: 'app.status',
//   url: '/settings/status?{tab:int}',
//   views: {
//     'content@app': { component: StatusViewComponent },
//   },
//   params: {
//     tab: { dynamic: true },
//   },
// };

// const updateState = {
//   name: 'app.update',
//   url: '/settings/update',
//   views: {
//     'content@app': { component: UpdateComponent },
//   },
//   params: {
//     tab: { dynamic: true },
//   },
// };

// const experimentsState = {
//   name: 'app.experiments',
//   url: '/settings/experiments',
//   views: {
//     'content@app': { component: ExperimentsComponent },
//   },
// };

// const agentState = {
//   name: 'app.agent-settings',
//   url: '/settings/agent',
//   views: {
//     'content@app': { component: AgentComponent },
//   },
// };

@NgModule({
  declarations: [
    SystemPreferencesComponent,
    BundlingComponent,
    ConfirmDialogComponent,
    AddBundlerDialogComponent,
    LicensingComponent,
    AddLicenseDialogComponent,
    MetricConfigComponent,
    LossCodeComponent,
    DelayCodeComponent,
    WallboardComponent,
    EditWallboardDialogComponent,
    EditPanelDialogComponent,
    ScrapCodeComponent,
    AddCodeDialogComponent,
    CodeConfirmDialogComponent,
    WorkgroupsComponent,
    EditWorkgroupComponent,
    IntegrationComponent,
    HideCompletePipe,
    ConfigTypePipe,
    AddConfigComponent,
    TimeInputComponent,
    ImportFileTestFormComponent,
    ApiKeyManagementFormComponent,
    NewApiKeyModalComponent,
    PerformanceStandardsComponent,
    PrintingComponent,
    EditPropertyModalComponent,
    PrintingPreviewComponent,
    UsersComponent,
    EclipseUsersGridComponent,
    ResetPasswordModalComponent,
    UserProfleComponent,
    UserSettingsComponent,
    StatusViewComponent,
    ExpressViewComponent,
    ExpressSparklineComponent,
    PendingActionsToAgentComponent,
    ServiceHealthComponent,
    SyncStateGridComponent,
    SystemAlertsComponent,
    UpdateComponent,
    ExperimentsComponent,
    AgentComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    MatToolbarModule,
    MatListModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSortModule,
    MatDatepickerModule,
    MatCardModule,
    NgxTranslateModule,
    ComponentsModule,
    PipesModule,
    DirectivesModule,
    InlineEditorModule,
    MatTableModule,
    DndDropzoneDirective,
    DndPlaceholderRefDirective,
    DndDraggableDirective,
    MatMenuModule,
    PerformanceComponentsModule,
    SettingsRoutingModule
  ],
  exports: [
    ConfirmDialogComponent,
    AddBundlerDialogComponent,
    AddLicenseDialogComponent,
    CodeConfirmDialogComponent,
  ],
})
export class SettingsModule {}
