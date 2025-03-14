import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { IMachine, ToolingDef } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';
import { selectSingleTooling } from './selector';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { AddMachineModalComponent } from '../add-machine-modal/add-machine-modal.component';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, NavigationEnd  } from '@angular/router';
import { UserHasRoles } from '../../shared/services/store/user/selector';
import { putAction } from '../../shared/services/clientData.actions';
import { selectMachines } from '../../shared/services/store/scheduler/selectors';

@Component({
  selector: 'app-tooling-detail',
  templateUrl: './tooling-detail.component.html',
  styleUrls: ['./tooling-detail.component.scss'],
})
export class ToolingDetailComponent implements OnDestroy, OnInit {
  toolingCode: string;
  tooling: ToolingDef;
  userHasEditorRole = false;
  machines: IMachine[] = [];
  showedMachineKeys = [];
  checkedMachineKeys = [];

  toolingKeys = [
    { field: 'toolingCode', name: 'ToolingCode', isEditable: false },
    { field: 'description', name: 'Description', isEditable: true },
    { field: 'pCodeGroup', name: 'PCodeGroup', isEditable: true },
    { field: 'finWidth', name: 'FinWidth', isEditable: true },
    { field: 'legHeight', name: 'LegHeight', isEditable: true },
    { field: 'profile', name: 'Profile', isEditable: true },
  ];

  machineKeys = [
    { field: 'name', name: 'Name', isChecked: true, isEditable: false },
    { field: 'calcLength', name: 'Calc Length', isChecked: true, isEditable: true, isSelect: true },
    {
      field: 'description',
      name: 'Description',
      isWarning: true,
      isChecked: true,
      isEditable: true,
    },
    { field: 'finWidth', name: 'Fin Width', isWarning: true, isChecked: true, isEditable: true },
    { field: 'holeCount', name: 'Hole Count', isChecked: true, isEditable: true, isSelect: true },
    { field: 'holeSpace', name: 'Hole Space', isChecked: true, isEditable: true },
    { field: 'legHeight', name: 'Leg Height', isWarning: true, isChecked: true, isEditable: true },
    { field: 'pcodeGroup', name: 'PcodeGroup', isWarning: true, isChecked: true, isEditable: true },
    { field: 'stageBay', name: 'Stage Bay', isChecked: true, isEditable: true },
    { field: 'loadDock', name: 'Load Dock', isChecked: true, isEditable: true },
  ];
  statuses = [
    { value: true, text: 'true' },
    { value: false, text: 'false' },
  ];

  private subscriptions: Subscription[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private store: Store
  ) {
    this.toolingCode = this.route.snapshot.paramMap.get('id');

    this.http
      .get<ToolingDef>(`${Ams.Config.BASE_URL}/_api/tooling/${this.toolingCode}`)
      .subscribe((response) => {
        this.store.dispatch(putAction({ collection: 'ToolingDefs', payload: response }));
      });

    this.subscriptions.push(
      this.store
        .select(UserHasRoles(['tooling-editor', 'administrator'], false))
        .subscribe((userHasEditorRole) => (this.userHasEditorRole = userHasEditorRole)),

      this.store.select(selectMachines).subscribe((machines) => (this.machines = machines)),

      this.store.select(selectSingleTooling(this.toolingCode)).subscribe((tooling) => {
        if (tooling) {
          this.tooling = tooling;
          this.showedMachineKeys = this.machineKeys.filter((item) => {
            switch (item.field) {
              case 'description':
                return this.tooling.needNormalizing.descriptions;
              case 'pcodeGroup':
                return this.tooling.needNormalizing.pCodeGroups;
              case 'finWidth':
                return this.tooling.needNormalizing.finWidths;
              case 'legHeight':
                return this.tooling.needNormalizing.legHeights;
              default:
                return true;
            }
          });
          this.checkedMachineKeys = this.showedMachineKeys;
        }
      })
    );
  }
  onChangeDetail(value: number | string, field: string) {
    if (!this.userHasEditorRole) {
      this.toast('You do not have permission to edit toolings');
      return;
    }
    const data = {
      [field]: value,
      id: this.toolingCode,
    };

    this.http
      .patch<ToolingDef>(`${Ams.Config.BASE_URL}/_api/tooling/${this.toolingCode}`, data)
      .subscribe({
        next: (data) => {
          this.toast('Tooling updated');
          this.store.dispatch(putAction({ collection: 'ToolingDefs', payload: data }));
        },
        error: (e) => {
          this.toast('Update failed.' + e.error.errors.join('\n'));
        },
      });
  }
  onChangeMachineDetail(value: any, field: string, machine: any) {
    if (!this.userHasEditorRole) {
      this.toast('You do not have permission to edit toolings');
      return;
    }
    const data = {
      [field]: value,
    };
    this.http
      .patch<ToolingDef>(
        `${Ams.Config.BASE_URL}/_api/tooling/${this.toolingCode}/machine/${machine.machineNumber}`,
        { toolingCode: this.toolingCode, machineNumber: machine.machineNumber, ...data }
      )
      .subscribe({
        next: (data) => {
          this.toast('Tooling updated.');
          this.store.dispatch(putAction({ collection: 'ToolingDefs', payload: data }));
        },
        error: (e) => {
          this.toast('Update failed.' + e.error.errors.join('\n'));
        },
      });
  }

  addMachine() {
    if (!this.userHasEditorRole) {
      this.toast('You do not have permission to edit toolings');
      return;
    }
    const machines: IMachine[] = this.machines.filter((ms: IMachine) => {
      const index: number = this.tooling.machines.findIndex((item) => {
        item.machineNumber === ms.machineNumber;
      });
      return index === -1;
    });
    const dialogRef = this.dialog.open(AddMachineModalComponent, {
      data: { machines },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.http
          .put<ToolingDef>(
            `${Ams.Config.BASE_URL}/_api/tooling/${this.toolingCode}/machine/${result}`,
            {
              toolingCode: this.toolingCode,
              machineNumber: result,
            }
          )
          .subscribe({
            next: (data) => {
              this.toast('Tooling updated.');
              this.store.dispatch(putAction({ collection: 'ToolingDefs', payload: data }));
            },
            error: (e) => {
              this.toast('Update failed.' + e.error.errors.join('\n'));
            },
          });
      }
    });
  }

  deleteMachine(machine) {
    if (!this.userHasEditorRole) {
      this.toast('You do not have permission to edit toolings');
      return;
    }
    this.http
      .delete<ToolingDef>(
        `${Ams.Config.BASE_URL}/_api/tooling/${this.toolingCode}/machine/${machine.machineNumber}`
      )
      .subscribe({
        next: (data) => {
          this.toast('Tooling updated.');
          this.store.dispatch(putAction({ collection: 'ToolingDefs', payload: data }));
        },
        error: (e) => {
          this.toast('Update failed.' + e.error.errors.join('\n'));
        },
      });
  }

  onChangeColumn = (column, $event) => {
    $event.stopPropagation();
    $event.preventDefault();
    column.isChecked = !column.isChecked;
    this.checkedMachineKeys = this.showedMachineKeys.filter((x) => x.isChecked);
  };

  gotoList() {
    this.router.navigate(['/tooling'])
  }

  ngOnDestroy(): void {
    [
      this.toolingCode,
      this.tooling,
      this.machines,
      this.showedMachineKeys,
      this.checkedMachineKeys,
    ].forEach((item) => (item = null));
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {}

  private toast(textContent: string) {
    this._snackBar.open(textContent, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 2000,
    });
  }
}
