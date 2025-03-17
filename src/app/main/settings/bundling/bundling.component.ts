import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { UserHasRoles } from '../../shared/services/store/user/selector';
import { IBundlingRule } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AddBundlerDialogComponent } from './add-bundler-dialog/add-bundler-dialog.component';
import { ClientDataStore } from '../../shared/services/clientData.store';

@Component({
  selector: 'app-bundling',
  templateUrl: './bundling.component.html',
  styleUrls: ['./bundling.component.scss'],
})
export class BundlingComponent implements OnDestroy {
  userHasAdminRole = false;
  systemSortOptions = [
    { value: 'LongToShort', text: 'Long To Short' },
    { value: 'ShortToLong', text: 'Short To Long' },
  ];
  sortOptions = [
    { value: 'LongToShort', text: 'Long To Short' },
    { value: 'ShortToLong', text: 'Short To Long' },
    { value: null, text: 'n/a' },
  ];

  bundlerRules;
  loading = false;
  hideComplete = false;

  subscriptions_: Subscription[] = [];
  constructor(
    private clientDataStore: ClientDataStore,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private store: Store
  ) {
    this.subscriptions_ = [
      clientDataStore.SelectBundlerRules().subscribe((bundlerRule) => {
        this.bundlerRules = _.cloneDeep(bundlerRule);
      }),

      this.store
        .select(UserHasRoles(['administrator', 'job-editor'], false))
        .subscribe((userHasAdminRole) => {
          this.userHasAdminRole = userHasAdminRole;
        }),
    ];
  }

  objectToArray(obj: any) {
    return Object.entries(obj)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => ({
        key,
        ...(value as any),
      }));
  }

  updateBundlerRule(
    type: string,
    customer: string,
    tooling: string,
    material: string,
    rule: IBundlingRule,
    objKey: string = '',
    val: string | number = ''
  ) {
    if (!this.userHasAdminRole) {
      this.toast('You do not have permission to change this setting');
      return;
    }
    rule[objKey] = val;

    const r = { type, customer, tooling, material, rule };

    // Support entering the % value in either 0-1 or 1-100.
    // The underlying data is stored as 0-1 and a template
    // filter formats that to a nice looking %. It seems
    // like there ought to be a better way. Perhaps x-editable
    // has some options for this.
    if (rule.minPctOfMaxLength > 1) rule.minPctOfMaxLength = rule.minPctOfMaxLength / 100;

    this.http
      .post<any>(
        Ams.Config.BASE_URL +
          `/_api/integration/bundlerRules/${r.type}?customer=${r.customer}&tooling=${r.tooling}&material=${r.material}`,
        r.rule
      )
      .subscribe({
        next: (data) => {},
        error: (error) => {
          this._snackBar.open(
            error.data.errors.reduce((x, y) => x + ' ' + y),
            '',
            {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 3000,
            }
          );
        },
      });
  }

  deleteBundlerRule(type: string, customer: string, tooling: string, material: string) {
    if (!this.userHasAdminRole) {
      this.toast('You do not have permission to change this setting');
      return;
    }
    const r = { type, customer, tooling, material };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { title: 'Delete Bundler Rule', message: 'Are you sure?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.http
          .delete(
            Ams.Config.BASE_URL +
              `/_api/integration/bundlerRules/${r.type}?customer=${r.customer}&tooling=${r.tooling}&material=${r.material}`
          )
          .subscribe(() => {});
      } else {
        console.log('Bundler rule delete action canceled');
      }
    });
  }

  addBundlerRuleDialog(type: string) {
    const dialogRef = this.dialog.open(AddBundlerDialogComponent, {
      width: '250px',
      data: { type },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.updateBundlerRule(
          result.type,
          result.customer,
          result.tooling,
          result.material,
          {} as any
        );
      } else {
        console.log('Bundler rule add action canceled');
      }
    });
  }

  focusSelect(form) {
    const input = form.$editables[0].inputEl;
    setTimeout(function () {
      input.select();
    }, 0);
  }

  private toast(textContent: string) {
    this._snackBar.open(textContent, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 2000,
    });
  }

  trackByKey = (index: number, item: any): any => {
    return item.key;
  };

  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
  }
}
