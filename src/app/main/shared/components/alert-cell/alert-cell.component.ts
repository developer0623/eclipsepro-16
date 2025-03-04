import { Component, Inject, Input } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { IJobAlertMembers, ISystemPreferencesService } from 'src/app/core/dto';
import { SystemPreferencesService } from '../../services/system-preferences.service';

@Component({
  selector: 'app-alert-cell',
  templateUrl: './alert-cell.component.html',
  styleUrls: ['./alert-cell.component.scss'],
})
export class AlertCellComponent implements ICellRendererAngularComp {
  @Input() data: IJobAlertMembers;
  showMaterialShortageAlerts = true;

  constructor(systemPreferencesService: SystemPreferencesService) {
    this.showMaterialShortageAlerts =
      systemPreferencesService.systemPreferences.showMaterialShortageAlerts;
  }

  agInit(params: ICellRendererParams): void {
    this.data = params.data;
  }

  refresh(params: ICellRendererParams) {
    this.data = params.data;
    return true;
  }
}
