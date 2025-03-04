import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Ams } from 'src/app/amsconfig';
import { MachinePattern, ReferenceColumnsDef } from 'src/app/core/dto';

interface MachinePatternVM extends MachinePattern {
  show: boolean;
}

@Component({
  selector: 'app-xl200-patterns',
  template: `
    <div class="content md-background md-hue-1 scroll-content">
      <div class="xl-list-container">
        <div class="material-usage-item sub-header">
          <div class="main-con">Pattern</div>
          <div class="main-con">Punches</div>
          <div class="main-con">Status</div>
          <div class="main-con"></div>
        </div>
        <div class="material-usage-content">
          <ng-container *ngFor="let p of patterns">
            <div class="xl-row">
              <div class="material-usage-item item-header">
                <div class="main-con">{{ p.pattern }}</div>
                <div class="main-con">{{ p.operations.length }}</div>
                <div class="main-con">{{ p.status }}</div>
                <div class="main-con">
                  <button
                    mat-icon-button
                    (click)="toggleDetail(p)"
                  >
                    <mat-icon [ngClass]="{ 'down-icon': p.show }">chevron_right</mat-icon>
                  </button>
                </div>
              </div>
            </div>
            <div
              class="xl-list-container"
              *ngIf="p.show"
            >
              <div class="material-usage-item sub-header">
                <div class="main-con">Type</div>
                <div class="main-con">Tool</div>
                <div class="main-con">X-Offset</div>
                <div class="main-con">X-Reference</div>
                <div class="main-con">Y-Offset</div>
                <div class="main-con">Y-Reference</div>
              </div>
              <div class="xl-row">
                <div class="material-usage-content">
                  <div
                    class="material-usage-item item-header"
                    *ngFor="let o of p.operations"
                  >
                    <div class="main-con">{{ o.idType }}</div>
                    <div class="main-con">{{ o.tool }}</div>
                    <div class="main-con">
                      {{ o.xOffset | unitsFormat : 'in' : 3 : false }}
                    </div>
                    <div class="main-con">
                      {{ referenceColumns[o.xReference].text }}
                    </div>
                    <div class="main-con">
                      {{ o.yOffset | unitsFormat : 'in' : 3 : false }}
                    </div>
                    <div class="main-con">
                      {{ yReferenceColumns[o.yReference].text }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ng-container>
        </div>
        <!-- <div
            ng-if="$ctrl.pattern && $ctrl.pattern.length === 0"
            class="xl-punch-nodata"
          >
            No data to display
          </div> -->
      </div>
    </div>
  `,
  styleUrls: ['./xl200-patterns.component.scss'],
})
export class Xl200PatternsComponent implements OnInit {
  @Input() machineId: number;
  patterns: MachinePatternVM[];

  referenceColumns: ReferenceColumnsDef[] = [
    { value: 'LeadingEdge', text: 'Leading Edge' },
    { value: 'TrailingEdge', text: 'Trailing Edge' },
    { value: 'LeadingCenter', text: 'Leading Center' },
    { value: 'TrailingCenter', text: 'Trailing Center' },
    { value: 'EvenSpacing', text: 'EvenSpacing' },
    { value: 'SpacingLimit', text: 'Spacing Limit' },
    { value: 'KerfAdjust', text: 'Kerf Adjust' },
    { value: 'Independent', text: 'Independent' },
    { value: 'ProportionalMin', text: 'Proportional Min' },
    { value: 'ProportionalMax', text: 'Proportional Max' },
    { value: 'ProportionalLimit', text: 'Proportional Limit' },
  ];

  yReferenceColumns: ReferenceColumnsDef[] = [
    { value: 'None', text: 'None' },
    { value: 'CenterPlus', text: 'Center+' },
    { value: 'CenterMinus', text: 'Center-' },
    { value: 'PlusEdge', text: '+Edge' },
    { value: 'MinusEdge', text: '-Edge' },
    { value: 'MacroPlus', text: 'Macro+' },
    { value: 'MacroMinus', text: 'Macro-' },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get(Ams.Config.BASE_URL + `/_api/punchpatterns/machine/${this.machineId}`)
      .subscribe((data: MachinePattern[]) => {
        this.patterns = data
          .map((p) => ({ ...p, show: false }))
          .sort((a, b) => a.pattern - b.pattern);
      });
  }

  toggleDetail(pattern: MachinePatternVM): void {
    pattern.show = !pattern.show;
  }
}
