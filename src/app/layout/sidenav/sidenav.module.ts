import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
import { ScrollbarModule } from '../../../@fury/shared/scrollbar/scrollbar.module';
import { SidenavItemComponent } from './sidenav-item/sidenav-item.component';
import { SidenavComponent } from './sidenav.component';
import { SidenavService } from './sidenav.service';
import { NgxTranslateModule } from 'src/app/translate/translate.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ScrollbarModule,
    NgxTranslateModule
  ],
  declarations: [SidenavComponent, SidenavItemComponent],
  exports: [SidenavComponent],
  providers: [SidenavService]
})
export class SidenavModule {
}
