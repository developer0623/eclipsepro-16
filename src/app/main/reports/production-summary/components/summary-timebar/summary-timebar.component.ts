import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-summary-timebar',
  templateUrl: './summary-timebar.component.html',
  styleUrls: ['./summary-timebar.component.scss'],
})
export class SummaryTimebarComponent {
  @Input() data;
  mainColor = ['#303030', '#666666', '#a63337', '#878787', '#c4c4c4', '#dcddde'];
  getMainArea(order) {
    let mainStyle = { 'background-color': '', width: '' };
    switch (order) {
      case 0: {
        mainStyle['width'] = this.data.running * 100 + '%';
        break;
      }
      case 1: {
        mainStyle['width'] = this.data.changeover * 100 + '%';
        break;
      }
      case 2: {
        mainStyle['width'] = this.data.breakdown * 100 + '%';
        break;
      }
      case 3: {
        mainStyle['width'] = this.data.otherDowntime * 100 + '%';
        break;
      }
      case 4: {
        mainStyle['width'] = this.data.exempt * 100 + '%';
        break;
      }
      case 5: {
        mainStyle['width'] = this.data.unscheduled * 100 + '%';
        break;
      }
    }
    mainStyle['background-color'] = this.mainColor[order];

    return mainStyle;
  }

  getBottomWidth() {
    const width = 100 - this.data.unscheduled * 100 + '%';
    return { width: width };
  }
}
