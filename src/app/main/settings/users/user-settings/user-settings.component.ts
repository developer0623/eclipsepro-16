import { query } from '@angular/animations';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
})
export class UserSettingsComponent {
  userName: string = '';
  constructor(private route: ActivatedRoute) {
    this.userName = this.route.snapshot.paramMap.get('userName');
  }
}
