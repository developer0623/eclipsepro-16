import { Component, EventEmitter, Output } from '@angular/core';
import { AlertDataService } from 'src/app/main/shared/services/alert-data.service';
import { IAlert } from 'src/app/core/dto';

@Component({
  selector: 'fury-toolbar-quickpanel-toggle',
  templateUrl: './toolbar-quickpanel-toggle.component.html',
  styleUrls: ['./toolbar-quickpanel-toggle.component.scss']
})
export class ToolbarQuickpanelToggleComponent {

  @Output() openQuickPanel = new EventEmitter();
  alerts: IAlert[] = [];

  constructor(
    public alertService: AlertDataService
  ) {

  }
}
