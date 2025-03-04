import { Component, OnInit, OnDestroy, Inject, Input } from '@angular/core';
import { PatternDef } from 'src/app/core/dto';
import { HttpClient } from '@angular/common/http';
import { Ams } from 'src/app/amsconfig';

@Component({
  selector: 'app-punch-pattern-preview',
  templateUrl: './punch-pattern-preview.component.html',
  styleUrls: ['./punch-pattern-preview.component.scss'],
})
export class PunchPatternPreviewComponent implements OnInit, OnDestroy {
  @Input() patternId: string = '';
  pattern;
  punches;
  availableMacros;
  mainWidth = 1000;
  bodyWidth = 0;
  bodyHeight = 0;
  tableHeight = 187;
  mainHeight = 300;
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
  timeoutId;
  punchColumns = [
    {
      field: 'idType',
      displayName: 'punchType',
    },
    {
      field: 'toolId',
      displayName: 'tool',
    },
    {
      field: 'xOffset',
      displayName: 'xOffset',
    },
    {
      field: 'xReference',
      displayName: 'xReference',
    },
    {
      field: 'yOffset',
      displayName: 'yOffset',
    },
    {
      field: 'yReference',
      displayName: 'yReference',
    },
  ];

  constructor(private http: HttpClient) {}

  onGetData() {
    const patternId = this.patternId;
    this.http
      .get<PatternDef>(`${Ams.Config.BASE_URL}/_api/punchpatterns/${patternId}`)
      .subscribe((response) => {
        this.pattern = response;
        const rows = this.pattern.punches.length;
        const height = 113 + rows * 40;
        console.log('pattern', this.pattern.punches);

        if (height < 300) {
          this.mainHeight = 300;
        } else if (height > 600) {
          this.mainHeight = 600;
          this.tableHeight = 487;
        } else {
          this.mainHeight = height;
          this.tableHeight = rows * 40;
        }
      });
  }

  onShowTooltip(e) {
    let pos = e.target.getBoundingClientRect();
    if (!this.patternId) {
      return;
    }
    this.timeoutId = setTimeout(() => {
      this.isMouseOnMain = true;
      this.onGetPosition(pos);
      if (!this.pattern) {
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
      this.loadingPos = {
        top: `0px`,
        left: `${this.mainWidth / 2 - this.loadingWidth / 2}px`,
      };
    } // Left-Down
    else if (right >= (this.bodyWidth * 2) / 3 && top < this.bodyHeight / 3) {
      realRight = 0 - this.mainWidth + width;
      realTop = 0;
      this.loadingPos = {
        top: `0px`,
        left: `${this.mainWidth - this.loadingWidth}px`,
      };
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
  }
}
