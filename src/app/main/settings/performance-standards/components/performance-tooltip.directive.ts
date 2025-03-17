import {
  Directive,
  Input,
  TemplateRef,
  ElementRef,
  HostListener,
  ViewContainerRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Directive({
  selector: '[performanceTooltip]',
})
export class PerformanceTooltipDirective implements OnChanges {
  @Input() hideTooltip: boolean = false;

  //If this is specified then specified template will be rendered in the tooltip
  @Input() contentTemplate: TemplateRef<any>;

  private _overlayRef: OverlayRef;

  constructor(
    private _overlay: Overlay,
    private _overlayPositionBuilder: OverlayPositionBuilder,
    private _elementRef: ElementRef,
    private _viewContainerRef: ViewContainerRef
  ) {}

  /**
   * Init life cycle event handler
   */
  ngOnInit() {
    if (this.hideTooltip) {
      return;
    }

    const positionStrategy = this._overlayPositionBuilder
      .flexibleConnectedTo(this._elementRef)
      .withPositions([
        {
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'top',
          offsetX: 0, // Adjust the offset as needed
          offsetY: 0, // Adjust the offset as needed
        },
      ]);

    this._overlayRef = this._overlay.create({ positionStrategy });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.hideTooltip && changes.hideTooltip.currentValue) {
      this.closeToolTip();
    }
  }

  /**
   * This method will be called whenever mouse enters in the Host element
   * i.e. where this directive is applied
   * This method will show the tooltip by instantiating the McToolTipComponent and attaching to the overlay
   */
  @HostListener('mouseenter')
  show() {
    //attach the component if it has not already attached to the overlay
    if (this._overlayRef && !this._overlayRef.hasAttached()) {
      const tooltipRef = this._overlayRef.attach(
        new TemplatePortal(this.contentTemplate, this._viewContainerRef)
      );
      // const tooltipRef = this._overlayRef.attach(this.contentTemplate);
    }
  }

  /**
   * This method will be called when mouse goes out of the host element
   * i.e. where this directive is applied
   * This method will close the tooltip by detaching the overlay from the view
   */
  @HostListener('mouseleave')
  hide() {
    this.closeToolTip();
  }

  /**
   * Destroy lifecycle event handler
   * This method will make sure to close the tooltip
   * It will be needed in case when app is navigating to different page
   * and user is still seeing the tooltip; In that case we do not want to hang around the
   * tooltip after the page [on which tooltip visible] is destroyed
   */
  ngOnDestroy() {
    this.closeToolTip();
  }

  /**
   * This method will close the tooltip by detaching the component from the overlay
   */
  private closeToolTip() {
    if (this._overlayRef) {
      this._overlayRef.detach();
    }
  }
}
