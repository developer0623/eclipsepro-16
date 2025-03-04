import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  IJobBits,
  IRecentAndUpcoming,
  ISystemPreferencesService,
} from '../../../../../app/core/dto';
import { SystemPreferencesService } from '../../services/system-preferences.service';

@Component({
  selector: 'app-schedule-previouscurrentnext',
  templateUrl: './schedule-previouscurrentnext.component.html',
  styleUrls: ['./schedule-previouscurrentnext.component.scss'],
})
export class SchedulePreviouscurrentnextComponent implements OnChanges {
  @Input() schedule: IRecentAndUpcoming = {
    future: [],
    past: [],
    current: null,
  };

  initData?: IJobBits = null;

  realSchedule: IRecentAndUpcoming = {
    future: [this.initData, this.initData],
    past: [this.initData, this.initData],
    current: this.initData,
  };
  showMaterialShortageAlerts: boolean;

  constructor(private systemPreferencesService: SystemPreferencesService) {
    this.showMaterialShortageAlerts =
      systemPreferencesService.systemPreferences.showMaterialShortageAlerts;
    this.onInitData();
  }

  onInitData() {
    if (this.schedule) {
      // Put in default data for each row for, when necessary.
      this.realSchedule = {
        ...this.schedule,
        future: [
          this.schedule.future[0] ?? this.initData,
          this.schedule.future[1] ?? this.initData,
        ],
        past: [this.schedule.past[0] ?? this.initData, this.schedule.past[1] ?? this.initData],
        current: this.schedule.current ?? this.initData,
      };
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.schedule && changes.schedule.currentValue) {
      this.onInitData();
    }
  }
}

@Component({
  selector: '[app-pcn-row]',
  template: `
    <ng-container *ngIf="job">
      <td>
        <app-job-detail-preview [ordId]="job.ordId">
          <a
            class="td-link ml-5"
            uiSref="app.orders.detail"
            [uiParams]="{ id: job.ordId }"
          >
            {{ job.orderCode }}
          </a>
        </app-job-detail-preview>
      </td>
      <td>
        <app-coil-type-preview [materialId]="job.materialCode">
          <a
            class="td-link ml-5"
            uiSref="app.inventory_coil-types.detail"
            [uiParams]="{ id: job.materialCode }"
          >
            {{ job.materialCode }}
          </a>
        </app-coil-type-preview>
      </td>
      <td>{{ job.toolingCode }}</td>
      <td class="text-right">
        {{ job.totalFt | unitsFormat : 'ft' : 0 : false }}
      </td>
      <td class="text-right">
        {{ job.remainingFt | unitsFormat : 'ft' : 0 : false }}
      </td>
      <td>{{ job.requiredDate | amsDate }}</td>
      <td [class.text-italic]="italicize">{{ job.completionDate | amsDateTime }}</td>
      <td>{{ job.customerName }}</td>
      <td>
        <app-alert-cell
          [data]="job"
          [showMaterialShortageAlerts]="showMaterialShortageAlerts"
        ></app-alert-cell>
      </td>
    </ng-container>

    <ng-container *ngIf="!job">
      <td></td>
      <td></td>
      <td></td>

      <td></td>
      <td></td>
      <td></td>

      <td></td>
      <td></td>
      <td></td>
    </ng-container>
  `,
  styleUrls: ['./schedule-previouscurrentnext.component.scss'],
})
// Would be a nice refactor to make this component private to SchedulePreviouscurrentnextComponent.
export class PCNRow {
  @Input() job?: IRecentAndUpcoming;
  @Input() italicize: false;
}
