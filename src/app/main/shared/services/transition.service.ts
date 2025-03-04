import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, ParamMap } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TransitionManageService {
  public transitionObs$ = new Subject<ParamMap>();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        )
      .subscribe(() => {
        const params = this.activatedRoute.snapshot.paramMap
        this.transitionObs$.next(params);
      });
  }
}