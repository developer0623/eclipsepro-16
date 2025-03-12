import { Component } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { tap, map, combineLatestWith } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { ITask } from 'src/app/core/dto';
import { ClientDataStore } from '../../shared/services/clientData.store';
import { selectTaskSelector } from '../../shared/services/store/warehouse/selector';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent {
  comFilterDateSubject = new BehaviorSubject<Date>(new Date());
  comFilterDate: { date: Date; isOpen: boolean } = { date: new Date(), isOpen: false };
  loading: boolean = false;
  taskDataSub_: Subscription;
  locationDataSub_: Subscription;
  warehouseViewModel$: Subscription;
  tasks$: Observable<any[]>;
  readyTasksSub_;
  completedTasksSub_;
  activeTasksSub_;
  readyTasks: ITask[] = [];
  readyTasksRemaining: number;
  completedTasks: ITask[] = [];
  completedTasksRemaining: number;
  activeTasks: ITask[] = [];
  activeTasksRemaining: number;

  fullscreen: boolean = false;
  panelIsOpen = false;

  constructor(private clientDataStore: ClientDataStore, private store: Store) {
    this.comFilterDateSubject.subscribe((date: Date) => {
      this.comFilterDate.date = date;
    });
    this.taskDataSub_ = this.clientDataStore.SelectTasks().subscribe();
    this.locationDataSub_ = this.clientDataStore.SelectLocations().subscribe();
    this.warehouseViewModel$ = this.clientDataStore
      .SelectWarehouseViewModel()
      .subscribe((vm) => {});
    this.tasks$ = this.store.select(selectTaskSelector).pipe(
      tap(() => {
        this.loading = true;
      })
    );
    this.readyTasksSub_ = this.tasks$
      .pipe(map((tasks) => tasks.filter((t) => t.taskState === 'Ready')))
      .subscribe((tasks) => {
        this.readyTasks = _.orderBy(tasks, ['requiredDate']).slice(0, 10);
        this.readyTasksRemaining = Math.max(tasks.length - 10, 0);
      });

    this.completedTasksSub_ = this.tasks$
      .pipe(
        map((tasks) => tasks.filter((t) => t.taskState === 'Complete')),
        combineLatestWith(this.comFilterDateSubject),
        map(([tasks, comFilterDate]) =>
          tasks.filter((t) => moment(comFilterDate).isSame(t.completedDate, 'day'))
        )
      )
      .subscribe((tasks) => {
        this.completedTasks = _.orderBy(tasks, ['completedDate'], ['desc']).slice(0, 10);
        this.completedTasksRemaining = Math.max(tasks.length - 10, 0);
      });
    this.activeTasksSub_ = this.tasks$
      .pipe(
        map((tasks) => tasks.filter((t) => t.taskState !== 'Complete' && t.taskState !== 'Ready'))
      )
      .subscribe((tasks) => {
        this.activeTasks = _.orderBy(tasks, ['requiredDate']).slice(0, 10);
        this.activeTasksRemaining = Math.max(tasks.length - 10, 0);
      });
  }

  onChangeDate(step: number) {
    let newDate = this.comFilterDate.date.getTime() + step * 24 * 3600 * 1000;
    this.comFilterDateSubject.next(new Date(newDate));
  }

  toggleFullscreen(): void {
    this.fullscreen = !this.fullscreen;
    if (this.fullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  isSmallScreen(): boolean {
    return window.innerWidth < 600;
  }
  trackByID(index, task) {
    return task.id;
  }

  ngONDestroy(): void {
    this.taskDataSub_.unsubscribe();
    this.locationDataSub_.unsubscribe();
    this.warehouseViewModel$.unsubscribe();
  }
}
