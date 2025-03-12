import { Component, OnInit, OnDestroy, Inject, Input } from '@angular/core';
import { GridOptions, GetRowIdParams, ColDef } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
import { combineLatestWith, map } from 'rxjs/operators';
import { UnitsService } from '../../services/units.service';
import { ClientDataStore } from '../../services/clientData.store';
import * as moment from 'moment';

@Component({
  selector: 'app-coil-type-preview',
  templateUrl: './coil-type-preview.component.html',
  styleUrls: ['./coil-type-preview.component.scss'],
})
export class CoilTypePreviewComponent implements OnInit, OnDestroy {
  @Input() materialId: string = '';
  coilType;
  mainHeight = 460;
  mainWidth = 1000;
  loadingWidth = 500;
  bodyWidth = 0;
  bodyHeight = 0;
  tableHeight = 300;
  agCoilGridOptions: GridOptions;
  columns: ColDef[] = [
    {
      field: 'coilId',
      headerName: 'coilId',
      filter: 'agTextColumnFilter',
    },
    {
      field: 'lengthRemainingFt',
      headerName: 'remaining',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'ft', 1, false, ''),
    },
    {
      field: 'lengthStartFt',
      headerName: 'starting',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'ft', 1, false, ''),
    },
    {
      field: 'dateIn',
      //cellFilter: 'age:row.entity.dateOut',
      headerName: 'dateIn',
      filter: 'agDateColumnFilter',
      valueFormatter: (params) => {
        let dateIn = moment(params.value);
        if (!dateIn.isValid()) return '';
        if (dateIn.isBefore('1980-01-02')) {
          return '';
        }
        return dateIn.format('L');
      },
    },
    {
      field: 'location.name',
      headerName: 'location',
      filter: 'agTextColumnFilter',
    },
  ];
  knownCoilIds: string[] = [];
  hoverTimeout: any;
  coils = [];
  mainSub_;
  isOpen = false;
  isMouseOnMain = false;
  isMouseOnContent = false;
  offsetX = 0;
  offsetY = 0;
  loadingPos = {
    top: '0px',
    left: '0px',
  };

  timeoutId;

  constructor(
    private clientDataStore: ClientDataStore,
    private unitsService: UnitsService,
    private translate: TranslateService
  ) {
    this.agCoilGridOptions = {
      headerHeight: 25,
      defaultColDef: {
        sortable: true,
        //resizable: true,
        headerValueGetter: (params) => this.translate.instant(params.colDef.headerName),
        tooltipValueGetter: (params) => {
          if (typeof params.value === 'string') {
            return params.value;
          }
          return;
        },
      },
      getRowId: (params: GetRowIdParams) => params.data.id,
      enableCellChangeFlash: true,
    };
  }

  onGetData() {
    if (!!this.mainSub_) {
      this.mainSub_.unsubscribe();
    }

    this.mainSub_ = this.clientDataStore
      .SelectCoilTypes()
      .pipe(
        map((cts) => cts.filter((ct) => ct.materialCode === this.materialId)), // Use map instead of flatMap
        combineLatestWith(
          this.clientDataStore.SelectCoilDtosIn({
            property: 'MaterialCode',
            values: [this.materialId],
          })
        )
      )
      .subscribe(([coilType, coils]) => {
        this.coilType = coilType;
        this.coils = coils.filter((c) => c.lengthRemainingFt > 0 && c.isComplete === false);
      });
  }

  onShowTooltip(e) {
    let pos = e.target.getBoundingClientRect();
    if (!this.materialId) {
      return;
    }
    this.timeoutId = setTimeout(() => {
      this.isMouseOnMain = true;
      this.onGetPosition(pos);
      if (!this.coilType) {
        setTimeout(() => {
          this.onGetData();
        }, 300);
      }
    }, 200);
  }

  onHideTooltip() {
    clearTimeout(this.timeoutId);
    if (this.isMouseOnMain) {
      this.isMouseOnMain = false;
      setTimeout(() => {
        if (!this.isMouseOnContent) {
          this.isOpen = false;
        }
      });
    }
  }

  onShowTooltip1() {
    this.isMouseOnContent = true;
  }

  onHideTooltip1() {
    this.isMouseOnContent = false;
    setTimeout(() => {
      if (!this.isMouseOnContent && !this.isMouseOnMain) {
        this.isOpen = false;
      }
    });
  }

  onGetPosition(pos) {
    let realTop = 0;
    let realRight = 0;
    const { top, left, bottom, right } = pos;
    const width = right - left;

    // Right-Down
    if (right < this.bodyWidth / 3 && top < this.bodyHeight / 3) {
      realRight = 0;
      realTop = 0;
      this.loadingPos = { top: `0px`, left: '0px' };
    } // Center-Down
    else if (
      right < (this.bodyWidth * 2) / 3 &&
      right >= this.bodyWidth / 3 &&
      top < this.bodyHeight / 3
    ) {
      realRight = width / 2 - this.mainWidth / 2;
      realTop = 0;
      this.loadingPos = { top: `0px`, left: `${this.mainWidth / 2 - this.loadingWidth / 2}px` };
    } // Left-Down
    else if (right >= (this.bodyWidth * 2) / 3 && top < this.bodyHeight / 3) {
      realRight = 0 - this.mainWidth + width;
      realTop = 0;
      this.loadingPos = { top: `0px`, left: `${this.mainWidth - this.loadingWidth}px` };
    } // Right-Middle
    else if (
      right < this.bodyWidth / 2 &&
      top >= this.bodyHeight / 3 &&
      top < (this.bodyHeight * 2) / 3
    ) {
      realRight = right - left - 10;
      realTop = 0 - this.mainHeight / 2 - 10;
      this.loadingPos = { top: `${this.mainHeight / 2 - 20}px`, left: '0px' };
    } // Left-Middle
    else if (
      right >= this.bodyWidth / 2 &&
      top >= this.bodyHeight / 3 &&
      top < (this.bodyHeight * 2) / 3
    ) {
      realRight = 0 - this.mainWidth;
      realTop = 0 - this.mainHeight / 2 - 10;
      this.loadingPos = {
        top: `${this.mainHeight / 2 - 20}px`,
        left: `${this.mainWidth - this.loadingWidth}px`,
      };
    } // Right-Up
    else if (right < this.bodyWidth / 3 && top >= (this.bodyHeight * 2) / 3) {
      realRight = 0;
      realTop = 0 - this.mainHeight - 25;
      this.loadingPos = { top: `${this.mainHeight - 40}px`, left: '0px' };
    } // Center-Up
    else if (
      right < (this.bodyWidth * 2) / 3 &&
      right >= this.bodyWidth / 3 &&
      top >= (this.bodyHeight * 2) / 3
    ) {
      realRight = width / 2 - this.mainWidth / 2;
      realTop = 0 - this.mainHeight - 10;
      this.loadingPos = {
        top: `${this.mainHeight - 50}px`,
        left: `${this.mainWidth / 2 - this.loadingWidth / 2}px`,
      };
    } // Left-Up
    else {
      realRight = 0 - this.mainWidth + width;
      realTop = 0 - this.mainHeight - 10;
      this.loadingPos = {
        top: `${this.mainHeight - 40}px`,
        left: `${this.mainWidth - this.loadingWidth}px`,
      };
    }
    this.offsetX = realRight;
    this.offsetY = realTop;
    this.isOpen = true;
  }

  ngOnInit(): void {
    this.bodyWidth = window.innerWidth;
    this.bodyHeight = window.innerHeight;
  }

  ngOnDestroy() {
    this.isOpen = false;
    if (!!this.mainSub_) {
      this.mainSub_.unsubscribe();
    }
  }
}
