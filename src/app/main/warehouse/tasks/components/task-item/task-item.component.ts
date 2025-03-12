import { Component, Input, OnInit } from '@angular/core';
// import AlertPng from 'src/assets/images/taskicons/alert.png';
// import ErrorPng from 'src/assets/images/taskicons/error.png';
// import ZonePng from 'src/assets/images/taskicons/zone.png';
// import MachinePng from 'src/assets/images/taskicons/machine.png';
// import FillPng from 'src/assets/images/taskicons/fill.png';
import { ITask } from 'src/app/core/dto';

@Component({
  selector: 'task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
})
export class TaskItemComponent implements OnInit {
  @Input() task: ITask;
  @Input() state: number;
  timeOffsetFlag: boolean = false;
  late: boolean = false;

  ngOnInit(): void {
    const time1 = new Date(this.task.requiredDate);
    const nowDate = new Date();
    this.timeOffsetFlag =
      time1.getTime() - nowDate.getTime() < 86400000 &&
      time1.getTime() - nowDate.getTime() > -86400000 &&
      time1.getDate() === nowDate.getDate();
    this.late = nowDate > time1;
  }

  // loadImage(img: string): any {
  //   if (img === 'alert') {
  //     return AlertPng;
  //   } else if (img === 'zone') {
  //     return ZonePng;
  //   } else if (img === 'machine') {
  //     return MachinePng;
  //   } else if (img === 'fill') {
  //     return FillPng;
  //   }
  //   return ErrorPng;
  // }
}
