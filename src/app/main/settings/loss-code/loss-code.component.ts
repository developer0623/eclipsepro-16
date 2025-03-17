import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
import { DelayCodeComponent } from './delay-code/delay-code.component';
import { ScrapCodeComponent } from './scrap-code/scrap-code.component';
import { WorkgroupsComponent } from './workgroups/workgroups.component';

@Component({
  selector: 'app-loss-code',
  templateUrl: './loss-code.component.html',
  styleUrls: ['./loss-code.component.scss'],
})
export class LossCodeComponent {
  @ViewChild(DelayCodeComponent) delayComponent: DelayCodeComponent;
  @ViewChild(ScrapCodeComponent) scrapComponent: ScrapCodeComponent;
  @ViewChild(WorkgroupsComponent) workgroupsComponent: WorkgroupsComponent;
  selectedTabIndex = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.selectedTabIndex = Number(this.route.snapshot.paramMap.get('tab')) || 0;
  }
  onChangeTab(index) {
    this.selectedTabIndex = index;
    this.router.navigate([], {
      queryParams: {tab: index},
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  addCode() {
    if (this.selectedTabIndex === 1) {
      this.scrapComponent.addCode();
    } else if (this.selectedTabIndex == 0) {
      this.delayComponent.addCode();
    } else if (this.selectedTabIndex === 2) {
      this.workgroupsComponent.newWorkgroup();
    }
  }
}
