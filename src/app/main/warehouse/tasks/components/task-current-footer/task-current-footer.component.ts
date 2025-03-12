import { Component, Input } from '@angular/core';
import { ITask } from 'src/app/core/dto';

@Component({
  selector: 'app-task-current-footer',
  templateUrl: './task-current-footer.component.html',
  styleUrls: ['./task-current-footer.component.scss'],
})
export class TaskCurrentFooterComponent {
  @Input() task: ITask;
  @Input() state: number;
  @Input() timeOffsetFlag: boolean;
  @Input() loadImage: (imageName: string) => string;
}
