import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bullet-chart-preview',
  templateUrl: './bullet-chart-preview.component.html',
  styleUrls: ['./bullet-chart-preview.component.scss'],
})
export class BulletChartPreviewComponent {
  @Input() current;
  @Input() okLower;
  @Input() okUpper;
  @Input() target;
  @Input() minValue;
  @Input() maxValue;
  @Input() lowerIsBetter;
  @Input() height = 30;
  @Input() type;

  width;
  scale(d, isPx = false) {
    const result = (d * 100) / (this.maxValue - this.minValue);
    // Note: the result should never be negative
    if (result < 0) {
      return 0;
    }
    if (isPx) {
      return result;
    }
    return `${result}%`;
  }
}
