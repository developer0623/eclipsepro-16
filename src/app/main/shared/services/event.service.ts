import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as d3 from 'd3';

export interface TimeLineEvent {
  domain: Date[];
  transform: d3.ZoomTransform;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventSubject = new Subject<TimeLineEvent>();

  emitEvent(data: TimeLineEvent) {
    this.eventSubject.next(data);
  }

  getEvent() {
    return this.eventSubject.asObservable();
  }
}
