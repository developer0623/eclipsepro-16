import { Component, HostBinding, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { SidenavItem } from './sidenav-item/sidenav-item.interface';
import { SidenavService } from './sidenav.service';
import { ThemeService } from '../../../@fury/services/theme.service';
import { selectSystemInfo,
  selectSystemPreferences
 } from 'src/app/main/shared/services/store/misc/selectors';
 import { ISystemInfo, ISystemPreferences } from 'src/app/core/dto';

@Component({
  selector: 'fury-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {

  sidenavUserVisible$ = this.themeService.config$.pipe(map(config => config.sidenavUserVisible));
  dataSub_: Subscription;

  @Input()
  @HostBinding('class.collapsed')
  collapsed: boolean;

  @Input()
  @HostBinding('class.expanded')
  expanded: boolean;

  items$: Observable<SidenavItem[]>;
  systemInfoSub_: Subscription;
  systemInfo: ISystemInfo;
  versionComparison: number;
  systemPrefSub_: Subscription;
  systemPreferences: ISystemPreferences;

  constructor(private router: Router,
              private sidenavService: SidenavService,
              private themeService: ThemeService,
              private store: Store
  ) {
                this.systemInfoSub_ = this.store.select
                (selectSystemInfo).subscribe((systemInfo) => {
                  this.systemInfo = { ...systemInfo };
              
                  if (this.systemInfo?.latestReleaseVersion?.version && this.systemInfo.version) {
                    this.versionComparison = this.compareVersions(
                      this.systemInfo.latestReleaseVersion.version,
                      this.systemInfo.version
                    );
                  }
                });

                this.systemPrefSub_ = this.store.select
                (selectSystemPreferences).subscribe((systemPreferences) => {
                  this.systemPreferences = { ...systemPreferences };
                });
  }

  ngOnInit() {
    this.items$ = this.sidenavService.items$.pipe(
      map((items: SidenavItem[]) => this.sidenavService.sortRecursive(items, 'position'))
    );
  }

  parseVersion(version: string): [number, number, number, number] {
    // Split the version string by the full stops
    const parts = version.split('.');

    // Convert each part to a number and validate, defaulting to 0 for missing parts
    const versionNumbers = parts.map((part) => {
      const num = parseInt(part, 10);
      if (isNaN(num)) {
        throw new Error(`Invalid number part in version: "${part}"`);
      }
      return num;
    });

    // Ensure the result is a tuple of four numbers, filling missing parts with 0
    while (versionNumbers.length < 4) {
      versionNumbers.push(0);
    }

    return [versionNumbers[0], versionNumbers[1], versionNumbers[2], versionNumbers[3]];
  }

  compareVersions(version1: string, version2: string): number {
    // Parse both version strings into tuples of four numbers
    const [major1, minor1, patch1, build1] = this.parseVersion(version1);
    const [major2, minor2, patch2, build2] = this.parseVersion(version2);

    // Compare versions from major to build, section by section
    if (major2 > major1) return -1;
    if (major2 < major1) return 1;

    if (minor2 > minor1) return -1;
    if (minor2 < minor1) return 1;

    if (patch2 > patch1) return -1;
    if (patch2 < patch1) return 1;

    if (build2 > build1) return -1;
    if (build2 < build1) return 1;

    // If all sections are equal, the second version is not newer
    return 0;
  }

  toggleCollapsed() {
    this.sidenavService.toggleCollapsed();
  }

  @HostListener('mouseenter')
  @HostListener('touchenter')
  onMouseEnter() {
    this.sidenavService.setExpanded(true);
  }

  @HostListener('mouseleave')
  @HostListener('touchleave')
  onMouseLeave() {
    this.sidenavService.setExpanded(false);
  }

  ngOnDestroy() {
    this.systemInfoSub_.unsubscribe();
    this.systemPrefSub_.unsubscribe();
  }
}
