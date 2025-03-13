import { Component, Input, OnInit } from '@angular/core';
import { ConnectionPositionPair } from '@angular/cdk/overlay';

@Component({
  selector: 'app-header-tooltip',
  templateUrl: './header-tooltip.component.html',
  styleUrls: ['./header-tooltip.component.scss'],
})
export class HeaderTooltipComponent implements OnInit {
  @Input() item: { index: number; title: string; description: string };
  @Input() isPercent = false;
  @Input() isLast = false;
  isOpen = false;
  positions = [
    new ConnectionPositionPair(
      { originX: 'center', originY: 'bottom' },
      { overlayX: 'start', overlayY: 'top' }
    ),
  ];
  onShowTooltip() {
    this.isOpen = true;
  }

  onHideTooltip() {
    this.isOpen = false;
  }

  ngOnInit(): void {
    if (this.isLast) {
      this.positions = [
        new ConnectionPositionPair(
          { originX: 'center', originY: 'bottom' },
          { overlayX: 'end', overlayY: 'top' }
        ),
      ];
    }
  }
}
