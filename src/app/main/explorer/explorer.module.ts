import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxTranslateModule } from '../../translate/translate.module';
import { ComponentsModule as ExploreComponentsModule } from './components/components.module';
import { GoodProductionComponent } from './good-production/good-production.component';
import { DowntimeComponent } from './downtime/downtime.component';
import { ScrapComponent } from './scrap/scrap.component';
import { PathfinderExplorerComponent } from './pathfinder-explorer/pathfinder-explorer.component';
import { PathfinderOperationsComponent } from './pathfinder-operations/pathfinder-operations.component';
import { ExplorerRoutingModule } from './explorer-routing.module';

@NgModule({
  declarations: [
    GoodProductionComponent,
    DowntimeComponent,
    ScrapComponent,
    PathfinderExplorerComponent,
    PathfinderOperationsComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    NgScrollbarModule,
    ExplorerRoutingModule,
    NgxTranslateModule,
    ExploreComponentsModule,
  ],
})
export class ExplorerModule {}
