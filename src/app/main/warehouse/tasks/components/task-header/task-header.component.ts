import { Component, Input } from '@angular/core';
import { ITask } from 'src/app/core/dto';

@Component({
  selector: 'app-task-header',
  templateUrl: './task-header.component.html',
  styleUrls: ['./task-header.component.scss'],
})
export class TaskHeaderComponent {
  @Input() task: ITask;
  @Input() loadImage: (imageName: string) => string;
}
