import { Component, OnInit } from '@angular/core';
import { AlertDataService } from 'src/app/main/shared/services/alert-data.service';
import { IAlert } from 'src/app/core/dto';

@Component({
  selector: 'fury-quickpanel',
  templateUrl: './quickpanel.component.html',
  styleUrls: ['./quickpanel.component.scss']
})
export class QuickpanelComponent implements OnInit {
  alerts: IAlert[] = [];

  constructor(private alertService: AlertDataService) {
    this.alertService.alerts$.subscribe((alerts) => {
      this.alerts = alerts;
    })
  }

  ngOnInit() {
    
  }

}
