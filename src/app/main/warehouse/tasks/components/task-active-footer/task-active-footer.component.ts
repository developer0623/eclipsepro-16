import { Component, Input, OnInit } from '@angular/core';
import { ITask } from 'src/app/core/dto';

@Component({
  selector: 'app-task-active-footer',
  templateUrl: './task-active-footer.component.html',
  styleUrls: ['./task-active-footer.component.scss'],
})
export class TaskActiveFooterComponent {
  @Input() task: ITask;
  @Input() state: number;
  @Input() timeOffsetFlag: boolean;
  @Input() loadImage: (imageName: string) => string;
}
