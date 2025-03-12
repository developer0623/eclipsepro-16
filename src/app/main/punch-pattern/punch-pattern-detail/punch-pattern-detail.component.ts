import {
  Component,
  Renderer2,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as _ from 'lodash';
import {
  PatternDef,
  IMachine,
  PatternDefPunch,
  PatternDefPunchError,
  AvailableMacro,
  MachinePattern,
  ReferenceColumnsDef,
} from 'src/app/core/dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Ams } from 'src/app/amsconfig';
import { UserHasRole } from '../../shared/services/store/user/selector';
import { ProductionLogComponent } from '../../shared/components/production-log/production-log.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ClientDataStore } from '../../shared/services/clientData.store';
import { CanComponentDeactivate  } from './confirm-exist.guard';

@Component({
  selector: 'app-punch-pattern-detail',
  templateUrl: './punch-pattern-detail.component.html',
  styleUrls: ['./punch-pattern-detail.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PunchPatternDetailComponent implements OnDestroy, CanComponentDeactivate  {
  @ViewChild(ProductionLogComponent) productionLogComponent: ProductionLogComponent;
  patternId: string;
  unmodifiedPattern: PatternDef;
  pattern: PatternDef;
  machines: IMachine[] = [];
  xlPatterns = [];
  punches: (PatternDefPunch & {
    resultingPunches: PatternDefPunch[];
    errors: PatternDefPunchError[];
    isDeleted: boolean;
  })[];
  punchColumns = [
    {
      field: 'idType',
      displayName: 'punchType',
    },
    {
      field: 'toolId',
      displayName: 'tool',
    },
    {
      field: 'xOffset',
      displayName: 'xOffset',
    },
    {
      field: 'xReference',
      displayName: 'xReference',
    },
    {
      field: 'yOffset',
      displayName: 'yOffset',
    },
    {
      field: 'yReference',
      displayName: 'yReference',
    },
  ];
  xlPatternsColumns = [
    {
      field: 'machineNumber',
      displayName: 'Machine',
    },
    {
      field: 'pattern',
      displayName: 'pattern',
    },
    {
      field: 'operations',
      displayName: 'punchCount',
    },
    {
      field: 'status',
      displayName: 'Status',
    },
  ];
  xlPatternSubColumns = [
    {
      field: 'idType',
      displayName: 'type',
    },
    {
      field: 'tool',
      displayName: 'tool',
    },
    {
      field: 'xOffset',
      displayName: 'xOffset',
    },
    {
      field: 'xReference',
      displayName: 'xReference',
    },
    {
      field: 'yOffset',
      displayName: 'yOffset',
    },
    {
      field: 'yReference',
      displayName: 'yReference',
    },
  ];

  xlPatternColumnsToDisplayWithExpand = ['expand', ...this.xlPatternsColumns.map((c) => c.field)];

  patternIsModified = false;
  patternIsNew = false;
  disableSave = false;
  selectedTabIndex = 0;
  availableMacros: AvailableMacro[] = [];
  userHasEditorRole = false;
  newPunch = {
    idType: 'Tool',
    xOffset: 0,
    yOffset: 0,
    xReference: '',
    yReference: '',
    toolId: 0,
    macroPatternName: '',
    resultingPunches: [],
    errors: [],
    isDeleted: false,
  };

  addNew = false;

  expandedElement: MachinePattern | null;

  referenceColumns: ReferenceColumnsDef[] = [
    { value: 'LeadingEdge', text: 'Leading Edge' },
    { value: 'TrailingEdge', text: 'Trailing Edge' },
    { value: 'LeadingCenter', text: 'Leading Center' },
    { value: 'TrailingCenter', text: 'Trailing Center' },
    {
      value: 'EdgeMirror',
      text: 'Edge Mirror',
      resultingRefValue: ['LeadingEdge', 'TrailingEdge'],
    },
    {
      value: 'CenterMirror',
      text: 'Center Mirror',
      resultingRefValue: ['LeadingCenter', 'TrailingCenter'],
    },
    { value: 'EvenSpacing', text: 'Even Spacing' },
    { value: 'SpacingLimit', text: 'Spacing Limit' },
    { value: 'ProportionalMin', text: 'ProportionalMin' },
    { value: 'ProportionalMax', text: 'ProportionalMax' },
    { value: 'ProportionalLimit', text: 'ProportionalLimit' },
    { value: 'KerfAdjust', text: 'Kerf Adjust' },
    { value: 'Independent', text: 'Independent' },
  ];

  yReferenceColumns: ReferenceColumnsDef[] = [
    { value: 'None', text: 'None' },
    { value: 'CenterPlus', text: 'Center+' },
    { value: 'CenterMinus', text: 'Center-' },
    { value: 'PlusEdge', text: '+Edge' },
    { value: 'MinusEdge', text: '-Edge' },
    { value: 'MacroPlus', text: 'Macro+' },
    { value: 'MacroMinus', text: 'Macro-' },
    {
      value: 'CenterMirror',
      text: 'Center Mirror',
      resultingRefValue: ['CenterPlus', 'CenterMinus'],
    },
    { value: 'EdgeMirror', text: 'Edge Mirror', resultingRefValue: ['PlusEdge', 'MinusEdge'] },
  ];
  keyDownListenerFunc: Function;
  userRolesSub_;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private renderer: Renderer2,
    public dialog: MatDialog,
    private clientDataStore: ClientDataStore,
    private store: Store
  ) {
    this.patternId = this.route.snapshot.paramMap.get('id');
    if (this.patternId === 'new') {
      this.patternIsNew = true;
      this.pattern = {
        id: '',
        patternName: '',
        punches: [],
        defaultLength: 0,
        option: '',
        importDate: null,
        isPermanent: false,
        hash: '',
        lastUsedDate: null,
        patternNumber: 0,
        isMacro: false,
        changeId: 0,
        machinePatterns: [],
      };
      this.unmodifiedPattern = _.cloneDeep(this.pattern);
      this.punches = [];
      const newName = this.route.snapshot.paramMap.get('name');
      if (newName) {
        this.pattern.patternName = newName;
        this.patternIsModified = true;
      }
    } else {
      this.http
        .get<PatternDef>(`${Ams.Config.BASE_URL}/_api/punchpatterns/${this.patternId}`)
        .subscribe((data) => {
          this.pattern = data;
          this.unmodifiedPattern = _.cloneDeep(this.pattern);
          this.punches = this.pattern.punches.map((p) => {
            return {
              ...p,
              resultingPunches: [],
              errors: [],
              isDeleted: false,
            };
          });
        });
    }

    this.http
      .get<AvailableMacro[]>(
        `${Ams.Config.BASE_URL}/_api/punchpatterns/${this.patternId}/availableMacros`
      )
      .subscribe((data) => {
        this.availableMacros = data;
      });

    this.userRolesSub_ = this.store
      .select(UserHasRole('pattern-editor'))
      .subscribe((userHasEditorRole) => {
        this.userHasEditorRole = userHasEditorRole;
      });

    this.keyDownListenerFunc = this.renderer.listen('document', 'keydown', (e) => {
      if (e.altKey && e.keyCode === 80) {
        this.addPunch();
        return false;
      }
    });
  }

  onClose(selectedItem) {
    selectedItem.isOpen = !selectedItem.isOpen;
  }

  saveChanges() {
    if (!this.userHasEditorRole) {
      this.toast('You do not have permission to edit patterns');
      return;
    }
    // expand punches for saving...
    let seq = 1;
    this.pattern.punches = this.punches
      .filter((p) => !p.isDeleted)
      .flatMap((p) => {
        return p.resultingPunches.flatMap((pp) => {
          return { ...pp, sequence: seq++ };
        });
      });

    if (this.patternIsNew) {
      // create new pattern and redirect to edit page
      if (!this.pattern.patternName) {
        this.toast('Pattern Name is required.');
        return;
      }
      this.http
        .put<PatternDef>(Ams.Config.BASE_URL + '/_api/punchpatterns', this.pattern)
        .subscribe({
          next: (data) => {
            if (data.id) {
              this.router.navigate(['/punch-patterns', data.id]);
              this.pattern = data;
              this.unmodifiedPattern = _.cloneDeep(this.pattern);
              this.punches = this.pattern.punches.map((p) => {
                return {
                  ...p,
                  resultingPunches: [],
                  errors: [],
                  isDeleted: false,
                };
              });
              this.patternIsModified = false;
              this.patternIsNew = false;
              this.patternId = this.pattern.id;
              this.toast('Punch created successfully');
            }
          },
          error: (error) => {
            this.toast('Error saving pattern: ' + error.error.errors.join(' '));
          },
        });
    } else {
      this.http
        .put<PatternDef>(
          Ams.Config.BASE_URL + `/_api/punchpatterns/${this.patternId}`,
          this.pattern
        )
        .subscribe({
          next: (data) => {
            this.pattern = data;
            this.unmodifiedPattern = _.cloneDeep(this.pattern);
            this.punches = this.pattern.punches.map((p) => {
              return {
                ...p,
                resultingPunches: [],
                errors: [],
                isDeleted: false,
              };
            });
            this.patternIsModified = false;
            this.toast('Punch updated successfully');
          },
          error: (error) => {
            this.toast('Punch change was not saved. ' + error.error.errors.join(' '));
          },
        });
    }
  }

  onChangePatternDetail(value: number | string, path: string) {
    this.patternIsModified = true;
  }

  cancelUnsavedChanges() {
    this.pattern = _.cloneDeep(this.unmodifiedPattern);
    this.patternIsModified = false;
    this.punches = this.pattern.punches.map((p) => {
      return { ...p, resultingPunches: [], errors: [], isDeleted: false };
    });
  }

  updatePunchDetail(punch, index) {
    this.patternIsModified = true;
    this.punches[index] = { ...punch };
    this.disableSave = this.punches.flatMap((p) => p.errors).length > 0;
  }

  selectTab(index) {
    this.selectedTabIndex = index;
    if (this.selectedTabIndex === 2) {
      this.productionLogComponent.onSizeToFit();
    }
  }

  deletePunchRow(sequence) {
    let remainingPunches = [];
    this.punches.map((item) => {
      if (item.sequence < sequence) {
        remainingPunches.push(item);
      } else if (item.sequence > sequence) {
        const newItem = {
          ...item,
          sequence: item.sequence - 1,
        };
        remainingPunches.push(newItem);
      }
    });
    this.punches = remainingPunches;
    this.patternIsModified = true;
  }
  addPunch() {
    this.addNew = true;
  }

  saveNewPunch(newPunch) {
    this.punches = [
      ...this.punches,
      ...newPunch.resultingPunches.flatMap((pp, i) => {
        return { ...pp, resultingPunches: [], sequence: this.punches.length + i + 1 };
      }),
    ];
    this.patternIsModified = true;
    this.addNew = false;
    this.newPunch = {
      idType: 'Tool',
      xOffset: 0,
      yOffset: 0,
      xReference: '',
      yReference: '',
      toolId: 0,
      macroPatternName: '',
      resultingPunches: [],
      errors: [],
      isDeleted: false,
    };
  }

  cancelNewPunch() {
    this.addNew = false;
    this.newPunch = {
      idType: 'Tool',
      xOffset: 0,
      yOffset: 0,
      xReference: '',
      yReference: '',
      toolId: 0,
      macroPatternName: '',
      resultingPunches: [],
      errors: [],
      isDeleted: false,
    };
  }

  movePunchDown(punchIdx: number) {
    // Note that moving a punch up is the same thing as moving the one above
    // it down. Thus, we only need this one function.
    const by = (selector) => (e1, e2) => selector(e1) > selector(e2) ? 1 : -1;

    // punchIdx is assigned, by the view, after a sort.
    // We rely on that sort order here.
    this.punches.sort(by((x) => x.sequence));
    let punches = this.punches;
    let pos = punchIdx;
    let tmp = punches[pos].sequence;
    punches[pos].sequence = punches[pos + 1].sequence;
    punches[pos + 1].sequence = tmp;
    this.punches.sort(by((x) => x.sequence));
    this.punches = [...this.punches];
    this.patternIsModified = true;
  }

  private toast(textContent: string) {
    this._snackBar.open(textContent, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 2000,
    });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.patternIsModified || this.patternIsNew) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
      });

      return dialogRef.afterClosed()
    }
    return true;
  }

  ngOnDestroy(): void {
    this.keyDownListenerFunc();
    this.userRolesSub_.unsubscribe();
  }
}
