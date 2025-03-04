import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IJobItem } from 'src/app/core/dto';
import { ClientDataStore } from '../../services/clientData.store';
import { selectSingleOrderById } from '../../services/store/order/selectors';
import { HttpClient } from '@angular/common/http';
import { Ams } from 'src/app/amsconfig';

@Component({
  selector: 'app-job-detail-preview',
  templateUrl: './job-detail-preview.component.html',
  styleUrls: ['./job-detail-preview.component.scss'],
})
export class JobDetailPreviewComponent implements OnInit, OnDestroy {
  @Input() ordId: string = '';
  order;
  mainHeight = 340;
  maxHeight = 600;
  mainWidth = 1000;
  bodyWidth = 0;
  bodyHeight = 0;
  tableHeight = 227;
  loadingWidth = 500;
  isOpen = false;
  isMouseOnMain = false;
  isMouseOnContent = false;
  offsetX = 0;
  offsetY = 0;
  loadingPos = {
    top: '0px',
    left: '0px',
  };

  jobDetailsFilterSub_: Subscription;
  jobDetailsSub_: Subscription;

  itemHeaders: {
    field: keyof (IJobItem & { isVisible });
    order: 'asc' | 'desc' | 'none';
    title: string;
    isVisible: boolean;
    isEditable: boolean;
    units: string;
    unitDecimals: number;
  }[] = [
    {
      field: 'bundle',
      order: 'none',
      title: 'Bundle',
      isVisible: true,
      isEditable: false,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'lengthIn',
      order: 'none',
      title: 'Length',
      isVisible: true,
      isEditable: false,
      units: 'in',
      unitDecimals: 3,
    },
    {
      field: 'quantity',
      order: 'none',
      title: 'Pieces',
      isVisible: true,
      isEditable: false,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'quantityDone',
      order: 'none',
      title: 'Pcs Done',
      isVisible: true,
      isEditable: false,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'patternName',
      order: 'none',
      title: 'Pattern',
      isVisible: true,
      isEditable: false,
      units: '',
      unitDecimals: 0,
      //sref: 'app.punch-patterns_list.detail({id: pattern.patternName})'
    },
    {
      field: 'weightLbs',
      order: 'none',
      title: 'Weight',
      isVisible: true,
      isEditable: false,
      units: 'lbs',
      unitDecimals: 0,
    },
    {
      field: 'sequence',
      order: 'asc',
      title: 'Sequence',
      isEditable: false,
      isVisible: true,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'externalItemId',
      order: 'none',
      title: 'Item ID',
      isVisible: true,
      isEditable: false,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'user1',
      order: 'none',
      title: 'itemUser1',
      isVisible: false,
      isEditable: true,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'user2',
      order: 'none',
      title: 'itemUser2',
      isVisible: false,
      isEditable: true,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'user3',
      order: 'none',
      title: 'itemUser3',
      isVisible: false,
      isEditable: true,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'user4',
      order: 'none',
      title: 'itemUser4',
      isVisible: false,
      isEditable: true,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'user5',
      order: 'none',
      title: 'itemUser5',
      isVisible: false,
      isEditable: true,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'messageText',
      order: 'none',
      title: 'Message',
      isVisible: true,
      isEditable: true,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'pieceMark',
      order: 'none',
      title: 'Piece Mark',
      isVisible: true,
      isEditable: true,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'bundleGroup',
      order: 'none',
      title: 'bundleGroup',
      isVisible: true,
      isEditable: true,
      units: '',
      unitDecimals: 0,
    },
  ];

  bundleItemHeaders = [
    { field: 'bundle', title: 'Bundle' },
    { field: 'bundleId', title: 'Id' },
    { field: 'changeId', title: 'Change Id' },
    { field: 'user1', title: 'User1' },
    { field: 'user2', title: 'User2' },
    { field: 'user3', title: 'User3' },
    { field: 'user4', title: 'User4' },
    { field: 'user5', title: 'User5' },
  ];

  timeoutId;

  constructor(
    private clientDataStore: ClientDataStore,
    private http: HttpClient,
    private store: Store
  ) {}

  onGetData() {
    this.http
      .get(`${Ams.Config.BASE_URL}/_api/user/settings/orderItemsColumns`)
      .subscribe((userColumns: any[]) => {
        this.itemHeaders.forEach((x) => {
          x.isVisible = userColumns.find((u) => u.field === x.field)?.isChecked ?? x.isVisible;
        });
      });
    const ordId = Number(this.ordId);
    const filter: { property: 'ordId'; values: (string | number)[] } = {
      property: 'ordId',
      values: [ordId],
    };
    this.jobDetailsFilterSub_ = this.clientDataStore.SelectJobDetailIn(filter).subscribe();

    this.jobDetailsSub_ = this.store
      .select(selectSingleOrderById(ordId))
      .subscribe((singleOrder) => {
        if (singleOrder) {
          this.order = singleOrder;
          const rows = this.order.items.length;
          const height = 113 + rows * 40;
          console.log('pattern', this.order.items);

          if (height < 340) {
            this.mainHeight = 340;
          } else if (height > 600) {
            this.mainHeight = 600;
            this.tableHeight = 487;
          } else {
            this.mainHeight = height;
            this.tableHeight = rows * 40;
          }
        }
      });
  }

  onShowTooltip(e) {
    let pos = e.target.getBoundingClientRect();
    if (!this.ordId) {
      return;
    }
    this.timeoutId = setTimeout(() => {
      this.isMouseOnMain = true;
      this.onGetPosition(pos);
      if (!this.order) {
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

  trackByKey = (index: number): number => {
    return index;
  };

  ngOnInit(): void {
    this.bodyWidth = window.innerWidth;
    this.bodyHeight = window.innerHeight;
  }

  ngOnDestroy() {
    this.isOpen = false;
    if (!!this.jobDetailsSub_) {
      this.jobDetailsFilterSub_.unsubscribe();
      this.jobDetailsSub_.unsubscribe();
    }
  }
}
