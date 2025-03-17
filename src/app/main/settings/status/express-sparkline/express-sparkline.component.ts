import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ISparkData } from 'src/app/core/dto';

@Component({
  selector: 'app-express-sparkline',
  templateUrl: './express-sparkline.component.html',
  styleUrls: ['./express-sparkline.component.scss'],
})
export class ExpressSparklineComponent implements OnChanges {
  @Input() datas: ISparkData[]; // Adjust the type as necessary
  sparkline = {
    options: {
      chart: {
        type: 'sparklinePlus',
        height: 100,
        width: 150,
        showLastValue: false,
        noData: null,
        useInteractiveGuideline: true,
        transitionDuration: 200,
        margin: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        },
        x: (d) => d.ordinal,
        y: (d) => d.value,
      },
    },
    config: {
      refreshDataOnly: true,
    },
    data: [],
  };
  api: any; // Define your API type if necessary

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.datas && changes.datas.currentValue) {
      this.sparkline.data = changes.datas.currentValue;
      if (this.api) {
        this.api.clearElement();
      }
    }
  }
}
