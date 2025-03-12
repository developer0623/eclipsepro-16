import { Component, Input, OnInit } from '@angular/core';
import { ITask } from 'src/app/core/dto';

@Component({
  selector: 'app-task-active-content',
  templateUrl: './task-active-content.component.html',
  styleUrls: ['./task-active-content.component.scss'],
})
export class TaskActiveContentComponent {
  @Input() task: ITask;
  @Input() loadImage: (imageName: string) => string;
}
