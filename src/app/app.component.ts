import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { SidenavService } from './layout/sidenav/sidenav.service';
import { ThemeService } from '../@fury/services/theme.service';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Platform } from '@angular/cdk/platform';
import { SplashScreenService } from '../@fury/services/splash-screen.service';
import { AuthService } from './main/shared/services/auth.service';
import { FeatureFlagService } from './main/shared/services/feature-flag.service';

@Component({
  selector: 'fury-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(private sidenavService: SidenavService,
              private iconRegistry: MatIconRegistry,
              private renderer: Renderer2,
              private themeService: ThemeService,
              @Inject(DOCUMENT) private document: Document,
              private platform: Platform,
              private route: ActivatedRoute,
              private splashScreenService: SplashScreenService,
              private authService: AuthService,
              private featureFlagService: FeatureFlagService) {
    this.authService.getSession();
    this.featureFlagService.refresh()
    this.route.queryParamMap.pipe(
      filter(queryParamMap => queryParamMap.has('style'))
    ).subscribe(queryParamMap => this.themeService.setStyle(queryParamMap.get('style')));

    this.iconRegistry.setDefaultFontSetClass('material-icons-outlined');
    this.themeService.theme$.subscribe(theme => {
      if (theme[0]) {
        this.renderer.removeClass(this.document.body, theme[0]);
      }

      this.renderer.addClass(this.document.body, theme[1]);
    });

    if (this.platform.BLINK) {
      this.renderer.addClass(this.document.body, 'is-blink');
    }

    this.sidenavService.addItems([
      {
        name: 'Dashboards',
        icon: 'mdi-microsoft',
        position: 10,
        subItems: [
          {
            name: 'machines',
            routeOrFunction: '/dashboards/machines',
            position: 10
          },
        ]
      },
      {
        name: 'schedule',
        icon: 'mdi-calendar',
        position: 20,
        subItems: [
          {
            name: 'scheduler',
            routeOrFunction: '/schedule/jobs',
            position: 10
          },
          {
            name: 'timeline',
            routeOrFunction: '/schedule/timeline',
            position: 10
          },
          {
            name: 'plannedDowntime',
            routeOrFunction: '/schedule/downtime',
            position: 10
          },
        ]
      },
      {
        name: 'orders',
        routeOrFunction: '/orders',
        icon: 'mdi-receipt',
        position: 30,
      },
      {
        name: 'punchPatterns',
        routeOrFunction: '/punch-patterns',
        icon: 'mdi-stamper',
        position: 40,
      },
      {
        name: 'inventory',
        icon: 'mdi-clipboard-check',
        position: 50,
        subItems: [
          {
            name: 'materials',
            routeOrFunction: '/inventory/coil-types',
            position: 10
          },
          {
            name: 'coils',
            routeOrFunction: '/inventory/coils',
            position: 20
          },
        ]
      },
      {
        name: 'Warehouse',
        icon: 'mdi-forklift',
        position: 60,
        subItems: [
          {
            name: 'Tasks',
            routeOrFunction: '/warehouse/tasks',
            position: 10
          },
          {
            name: 'Users',
            routeOrFunction: '/warehouse/users',
            position: 20
          },
          {
            name: 'App Settings',
            routeOrFunction: '/warehouse/app-settings',
            position: 30
          },
        ]
      },
      {
        name: 'reports',
        icon: 'mdi-chart-bar',
        position: 70,
        subItems: [
          {
            name: 'productionSummary',
            routeOrFunction: '/report/production-summary',
            position: 10
          },
          {
            name: 'productionEvents',
            routeOrFunction: '/report/production-events',
            position: 20,
            claims: 'pro.machine.reports',
          },
          {
            name: 'goodProductionExplorer',
            routeOrFunction: '/production-explorer/good-production',
            position: 30,
          },
          {
            name: 'Delay Summary',
            routeOrFunction: '/report/delay-summary',
            position: 40
          },
          {
            name: 'downtimeExplorer',
            routeOrFunction: '/production-explorer/downtime',
            position: 50,
          },
          {
            name: 'Scrap Summary',
            routeOrFunction: '/report/scrap-summary',
            position: 60,
            claims: 'pro.machine.reports',
          },
          {
            name: 'scrapExplorer',
            routeOrFunction: '/production-explorer/scrap',
            position: 70,
          },
          {
            name: 'Coil Summary',
            routeOrFunction: '/report/coil-summary',
            position: 80,
            badge: '🧪',
            // claims: 'pro.machine.reports',
          },
          {
            name: 'Coil Scrap Breakdown',
            routeOrFunction: '/report/coil-scrap',
            position: 90,
            badge: '🧪',
            // claims: 'pro.machine.reports',
          },
          
          {
            name: 'Material Usage',
            routeOrFunction: '/report/material-usage',
            position: 100,
            claims: 'pro.machine.reports',
            badge: '🧪',
          },
          {
            name: 'Tooling Code Usage',
            routeOrFunction: '/report/tooling-usage',
            position: 110,
            claims: 'pro.machine.reports',
            badge: '🧪',
          },
          {
            name: 'Material Demand',
            routeOrFunction: '/report/material-demand',
            position: 120,
            claims: 'pro.machine.reports',
            badge: '🧪',
          },
          {
            name: 'Order Summary',
            routeOrFunction: '/report/order-summary',
            position: 130,
            claims: 'pro.machine.reports',
            badge: '🧪',
          },
          {
            name: 'Order Summary',
            routeOrFunction: '/report/order-sequence',
            position: 140,
            claims: 'pro.machine.reports',
            
          },
          {
            name: 'Quality Audit',
            routeOrFunction: '/report/quality-audit',
            position: 150,
            claims: 'pro.machine.reports',
            badge: '🧪',
          },
          {
            name: 'Pathfinder Operations Explorer',
            routeOrFunction: '/production-explorer/pathfinder-operations',
            position: 160,
            claims: 'pro.machine.reports.explorers',
            badge: '🧪',
            featureFlag: 'experimental',
          },
          {
            name: 'Pathfinder Good Parts Explorer',
            routeOrFunction: '/production-explorer/pathfinder-goodparts',
            position: 170,
            badge: '🧪',
            featureFlag: 'experimental',
          }, 
        ]
      },
      {
        name: 'machines',
        icon: 'mdi-factory',
        position: 80,
        subItems: [
          {
            name: 'Pathfinder',
            routeOrFunction: '/machines/pathfinder',
            position: 10,
            claims: 'pro.machine.dashboard',
          },
          {
            name: 'XL200',
            routeOrFunction: '/machines/xl200',
            position: 20
          },
        ]
      },
      {
        name: 'tooling',
        routeOrFunction: '/tooling',
        icon: 'mdi-hammer-wrench',
        position: 90,
      },
      // {
      //   name: 'Calendar',
      //   routeOrFunction: '/apps/calendar',
      //   icon: 'date_range',
      //   position: 40
      // },
    //   {
    //     name: 'Inbox',
    //     routeOrFunction: '/apps/inbox',
    //     icon: 'inbox',
    //     position: 25
    //   },
    //   {
    //     name: 'Chat',
    //     routeOrFunction: '/apps/chat',
    //     icon: 'chat',
    //     position: 30,
    //     badge: '14',
    //     badgeColor: '#009688'
    //   },
    //   {
    //     name: 'USER INTERFACE',
    //     type: 'subheading',
    //     position: 35
    //   },
    //   {
    //     name: 'Components',
    //     routeOrFunction: '/components',
    //     icon: 'layers',
    //     position: 40
    //   },
    //   {
    //     name: 'Forms',
    //     icon: 'description',
    //     position: 45,
    //     subItems: [
    //       {
    //         name: 'Form Elements',
    //         routeOrFunction: '/forms/form-elements',
    //         position: 10
    //       },
    //       {
    //         name: 'Form Wizard',
    //         routeOrFunction: '/forms/form-wizard',
    //         position: 15
    //       }
    //     ]
    //   },
    //   {
    //     name: 'Drag & Drop',
    //     routeOrFunction: '/drag-and-drop',
    //     icon: 'mouse',
    //     position: 55
    //   },
    //   {
    //     name: 'WYSIWYG Editor',
    //     routeOrFunction: '/editor',
    //     icon: 'format_shapes',
    //     position: 60
    //   },
    //   {
    //     name: 'PAGES',
    //     type: 'subheading',
    //     position: 65
    //   },
    //   {
    //     name: 'Authentication',
    //     icon: 'lock',
    //     position: 66,
    //     subItems: [
    //       {
    //         name: 'Login Page',
    //         routeOrFunction: '/login',
    //         position: 5
    //       },
    //       {
    //         name: 'Register Page',
    //         routeOrFunction: '/register',
    //         position: 10
    //       },
    //       {
    //         name: 'Forgot Password',
    //         routeOrFunction: '/forgot-password',
    //         position: 15
    //       }
    //     ]
    //   },
    //   {
    //     name: 'Page Layouts',
    //     icon: 'view_compact',
    //     position: 67,
    //     subItems: [
    //       {
    //         name: 'Simple',
    //         routeOrFunction: '/page-layouts/simple',
    //         position: 5
    //       },
    //       {
    //         name: 'Simple Tabbed',
    //         routeOrFunction: '/page-layouts/simple-tabbed',
    //         position: 5
    //       },
    //       {
    //         name: 'Card',
    //         routeOrFunction: '/page-layouts/card',
    //         position: 10
    //       },
    //       {
    //         name: 'Card Tabbed',
    //         routeOrFunction: '/page-layouts/card-tabbed',
    //         position: 15
    //       },
    //     ],
    //     badge: '4',
    //     badgeColor: '#4CAF50'
    //   },
    //   {
    //     name: 'Coming Soon',
    //     routeOrFunction: '/coming-soon',
    //     icon: 'watch_later',
    //     position: 68
    //   },
    //   {
    //     name: 'Blank',
    //     routeOrFunction: '/blank',
    //     icon: 'picture_in_picture',
    //     position: 69
    //   },
    //   {
    //     name: 'Material Icons',
    //     routeOrFunction: '/icons',
    //     icon: 'grade',
    //     position: 75
    //   },
    //   {
    //     name: 'Multi-Level Menu',
    //     icon: 'menu',
    //     position: 85,
    //     subItems: [
    //       {
    //         name: 'Level 1',
    //         subItems: [
    //           {
    //             name: 'Level 2',
    //             subItems: [
    //               {
    //                 name: 'Level 3',
    //                 subItems: [
    //                   {
    //                     name: 'Level 4',
    //                     subItems: [
    //                       {
    //                         name: 'Level 5',
    //                         routeOrFunction: '/level1/level2/level3/level4/level5'
    //                       }
    //                     ]
    //                   }
    //                 ]
    //               }
    //             ]
    //           }
    //         ]
    //       }
    //     ]
    //   }
    ]);
  }
}
