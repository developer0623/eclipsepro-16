import { Component, Input } from '@angular/core';
import { UnitsService } from 'src/app/main/shared/services/units.service';

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss'],
})
export class TableHeaderComponent {
  @Input() status = false;
  @Input() isSub = false;
  headers = [];

  constructor(private unitsService: UnitsService) {
    this.headers = [
      {
        title: unitsService.getUserUnitDef('fpm').title,
        lowTitle: unitsService.getUserUnitDef('fpm').key.toUpperCase(),
      },
      { title: 'Tooling Change', lowTitle: 'Minutes' },
      { title: 'Coil Change', lowTitle: 'Minutes' },
      { title: 'Bundle Change', lowTitle: 'Minutes' },
    ];
  }
}
