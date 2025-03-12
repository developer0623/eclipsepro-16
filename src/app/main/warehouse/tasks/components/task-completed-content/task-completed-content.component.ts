import { Component, Input } from '@angular/core';
import { ITask } from 'src/app/core/dto';

@Component({
  selector: 'app-task-completed-content',
  templateUrl: './task-completed-content.component.html',
  styleUrls: ['./task-completed-content.component.scss'],
})
export class TaskCompletedContentComponent {
  @Input() task: ITask;
  @Input() loadImage: (imageName: string) => string;
}
