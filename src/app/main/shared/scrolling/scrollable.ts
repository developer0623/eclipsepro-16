/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Directionality } from '@angular/cdk/bidi';
import {
  getRtlScrollAxisType,
  RtlScrollAxisType,
  supportsScrollBehavior,
} from '@angular/cdk/platform';
import { Directive, ElementRef, NgZone, OnDestroy, OnInit, Optional } from '@angular/core';
import { fromEvent, Observable, Subject, Observer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScrollDispatcher } from './scroll-dispatcher';

export type _Without<T> = { [P in keyof T]?: never };
export type _XOR<T, U> = (_Without<T> & U) | (_Without<U> & T);
export type _Top = { top?: number };
export type _Bottom = { bottom?: number };
export type _Left = { left?: number };
export type _Right = { right?: number };
export type _Start = { start?: number };
export type _End = { end?: number };
export type _XAxis = _XOR<_XOR<_Left, _Right>, _XOR<_Start, _End>>;
export type _YAxis = _XOR<_Top, _Bottom>;

/**
 * An extended version of ScrollToOptions that allows expressing scroll offsets relative to the
 * top, bottom, left, right, start, or end of the viewport rather than just the top and left.
 * Please note: the top and bottom properties are mutually exclusive, as are the left, right,
 * start, and end properties.
 */
export type ExtendedScrollToOptions = _XAxis & _YAxis & ScrollOptions;

/**
 * Sends an event when the directive's element is scrolled. Registers itself with the
 * ScrollDispatcher service to include itself as part of its collection of scrolling events that it
 * can be listened to through the service.
 */
@Directive({
  selector: '[cdk-scrollable], [cdkScrollable]',
  standalone: true,
})
export class CdkScrollable implements OnInit, OnDestroy {
  protected readonly _destroyed = new Subject<void>();

  protected _elementScrolled: Observable<Event> = new Observable((observer: Observer<Event>) =>
    this.ngZone.runOutsideAngular(() =>
      fromEvent(this.elementRef.nativeElement, 'scroll')
        .pipe(takeUntil(this._destroyed))
        .subscribe(observer)
    )
  );

  constructor(
    protected elementRef: ElementRef<HTMLElement>,
    protected scrollDispatcher: ScrollDispatcher,
    protected ngZone: NgZone,
    @Optional() protected dir?: Directionality
  ) {}

  ngOnInit() {
    this.scrollDispatcher.register(this);
  }

  ngOnDestroy() {
    this.scrollDispatcher.deregister(this);
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** Returns observable that emits when a scroll event is fired on the host element. */
  elementScrolled(): Observable<Event> {
    return this._elementScrolled;
  }

  /** Gets the ElementRef for the viewport. */
  getElementRef(): ElementRef<HTMLElement> {
    return this.elementRef;
  }

  /**
   * Scrolls to the specified offsets. This is a normalized version of the browser's native scrollTo
   * method, since browsers are not consistent about what scrollLeft means in RTL. For this method
   * left and right always refer to the left and right side of the scrolling container irrespective
   * of the layout direction. start and end refer to left and right in an LTR context and vice-versa
   * in an RTL context.
   * @param options specified the offsets to scroll to.
   */
  scrollTo(options: ExtendedScrollToOptions): void {
    const el = this.elementRef.nativeElement;
    // Rewrite the bottom offset as a top offset.
    if (options.bottom != null) {
      (options as _Without<_Bottom> & _Top).top =
        el.scrollHeight - el.clientHeight - options.bottom;
    }

    this._applyScrollToOptions(options);
  }

  private _applyScrollToOptions(options: ScrollToOptions): void {
    const el = this.elementRef.nativeElement;

    if (supportsScrollBehavior()) {
      el.scrollTo(options);
    } else {
      if (options.top != null) {
        el.scrollTop = options.top;
      }
      // if (options.left != null) {
      //   el.scrollLeft = options.left;
      // }
    }
  }

  /**
   * Measures the scroll offset relative to the specified edge of the viewport. This method can be
   * used instead of directly checking scrollLeft or scrollTop, since browsers are not consistent
   * about what scrollLeft means in RTL. The values returned by this method are normalized such that
   * left and right always refer to the left and right side of the scrolling container irrespective
   * of the layout direction. start and end refer to left and right in an LTR context and vice-versa
   * in an RTL context.
   * @param from The edge to measure from.
   */
  measureScrollOffset(from: 'top' | 'left' | 'right' | 'bottom' | 'start' | 'end'): number {
    const el = this.elementRef.nativeElement;
    if (from == 'top') {
      return el.scrollTop;
    }
    if (from == 'bottom') {
      return el.scrollHeight - el.clientHeight - el.scrollTop;
    }
  }
}
