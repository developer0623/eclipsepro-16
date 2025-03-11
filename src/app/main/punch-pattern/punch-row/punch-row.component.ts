import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Renderer2,
  OnChanges,
  SimpleChanges,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  AvailableMacro,
  PatternDefPunch,
  PatternDefPunchError,
  ReferenceColumnsDef,
} from 'src/app/core/dto';

import { UnitsService } from '../../shared/services/units.service';

@Component({
  selector: 'app-punch-row',
  templateUrl: './punch-row.component.html',
  styleUrls: ['./punch-row.component.scss'],
})
export class PunchRowComponent implements OnChanges, OnInit, OnDestroy {
  @Input() punch: PatternDefPunch & {
    resultingPunches: PatternDefPunch[];
    errors: PatternDefPunchError[];
    isDeleted: boolean;
  };
  @Input() isMacro = false;
  @Input() availableMacros: AvailableMacro[] = [];
  @Input() index = 0;
  @Input() isFirst = false;
  @Input() isLast = false;
  @Input() isNew = false;
  @Output() save = new EventEmitter<typeof this.punch>();
  @Output() moveDown = new EventEmitter<number>();
  @Output() delete = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<string>();
  @Output() saveNew = new EventEmitter<typeof this.punch>();

  @ViewChild('punchRow') punchRow: ElementRef;

  originalPunch: PatternDefPunch & {
    resultingPunches: PatternDefPunch[];
    errors: PatternDefPunchError[];
    isDeleted: boolean;
  };
  outSideClickListenerFunc: Function;

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
  macroReferenceColumns: ReferenceColumnsDef[] = [
    { value: 'LeadingCenter', text: 'Leading Center' },
    { value: 'TrailingCenter', text: 'Trailing Center' },
    {
      value: 'CenterMirror',
      text: 'Center Mirror',
      resultingRefValue: ['LeadingCenter', 'TrailingCenter'],
    },
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

  typeList = ['Tool', 'Shape', 'Macro'];

  references = this.referenceColumns;

  toolId: string;
  xReference: string;
  yReference: string;
  xOffset: string;
  yOffset: string;
  isEdit = false;

  constructor(private unitsService: UnitsService, private renderer: Renderer2) {}

  onGetReferenceValue(type, val) {
    if (type === 'x') {
      const selected = this.references.filter((item) => item.value == val);
      return selected.length ? selected[0].text : '';
    } else {
      const selected = this.yReferenceColumns.filter((item) => item.value == val);
      return selected.length ? selected[0].text : '';
    }
  }
  onGetXreferenceError(reference) {
    const selected = this.macroReferenceColumns.filter((item) => item.value == reference);
    return selected.length ? { color: 'black' } : { color: 'red' };
  }

  movePunchDown(dir) {
    if (this.isEdit) {
      this.isEdit = false;
    }
    this.moveDown.emit(dir);
  }

  deletePunchRow() {
    this.punch.isDeleted = !this.punch.isDeleted;
    this.updatePunchDetail();

    // if we are deleting, no need to show any errors
    if (this.punch.isDeleted) {
      this.punch.errors = [];
      this.save.emit(this.punch);
    }
  }

  onEdit($event) {
    if (!this.isEdit) {
      window.setTimeout(() => {
        this.isEdit = true;
      });
    }
  }

  onCancel($event) {
    $event.stopPropagation();
    this.isEdit = false;
    this.punch = { ...this.originalPunch };
    this.initPunch();
  }

  cancelNewPunch() {
    this.isEdit = false;
    this.cancel.emit();
  }

  saveNewPunch($event) {
    this.isEdit = false;
    this.updatePunchDetail();
    this.saveNew.emit(this.punch);
    $event.stopPropagation();
  }

  savePunch($event) {
    this.isEdit = false;
    this.originalPunch = { ...this.punch };
    this.save.emit(this.punch);
    $event.stopPropagation();
  }

  updatePunchDetail() {
    // clear the errors
    let newErrors: PatternDefPunchError[] = [];
    // are there any expanding features?
    // - Mirror References
    // - commas in offsets and tools
    let tools = this.toolId.split(',').map((t) => this.parseInt(t, 'toolId', newErrors));
    let xOffs = this.xOffset.split(',').map((x) => this.parseLengthToInch(x, 'xOffset', newErrors));
    let yOffs = this.yOffset.split(',').map((x) => this.parseLengthToInch(x, 'yOffset', newErrors));
    // todo: validate results ^^^

    let xRef = this.references.find((r) => r.value === this.xReference) ?? this.references[0]; // instead of defaulting, it should probably error
    let xRefs = xRef.resultingRefValue ? xRef.resultingRefValue : [this.xReference];
    let yRef =
      this.yReferenceColumns.find((r) => r.value === this.yReference) ?? this.yReferenceColumns[0];
    let yRefs = yRef.resultingRefValue ? yRef.resultingRefValue : [this.yReference];
    let index = 0;

    this.punch.resultingPunches = yRefs.flatMap((yr) => {
      return xRefs.flatMap((xr) => {
        return xOffs.flatMap((x) => {
          return yOffs.flatMap((y) => {
            return tools.flatMap((t) => {
              let { resultingPunches, ...rest } = this.punch;
              return {
                ...rest,
                toolId: t,
                xOffset: x,
                yOffset: y,
                xReference: xr,
                yReference: yr,
                punchId: index++ === 0 ? this.punch.punchId : undefined,
              };
            });
          });
        });
      });
    });
    this.punch.errors = newErrors;
  }

  parseLengthToInch(s: string, field: string, errors: PatternDefPunchError[]): number {
    // todo: a bunch more stuff
    let i = parseFloat(s);
    if (isNaN(i)) {
      errors.push({
        field: field,
        input: s,
        error: 'Could not convert',
      });
      return 0; // ????
    }

    let x = this.unitsService.convertUnits(i, this.unitsService.getUserUnits('in', true), 3, 'in');
    return x;
  }

  parseInt(s: string, field: string, errors: PatternDefPunchError[]): number {
    // todo: a bunch more stuff
    let i = parseInt(s);
    if (isNaN(i)) {
      errors.push({
        field: field,
        input: s,
        error: 'Could not convert',
      });
      return 0; // ????
    }

    return i;
  }

  formatIn(i: number): string {
    let x = this.unitsService.formatUserUnits(i, 'in', 3, true, '', true);
    return x;
  }

  initPunch() {
    if (this.punch?.resultingPunches) {
      // maybe we have already expanded???
      if (this.punch.resultingPunches.length === 0) {
        this.toolId = this.punch.toolId.toString();
        this.xReference = this.punch.xReference ? this.punch.xReference : this.references[0].value;
        this.yReference = this.punch.yReference
          ? this.punch.yReference
          : this.yReferenceColumns[0].value;
        this.xOffset = this.formatIn(this.punch.xOffset);
        this.yOffset = this.formatIn(this.punch.yOffset);
        let { resultingPunches, ...rest } = this.punch;
        this.punch.resultingPunches.push(rest);
      } else {
        // this is already expanded, maybe it's ok???
        // but I think we need to csv the list of resultingPunches for display
        this.toolId = this.punch.resultingPunches
          .map((p) => p.toolId.toString())
          .filter((v, i, a) => a.indexOf(v) === i)
          .reduce((acc, val) => acc + ', ' + val);
        this.xReference = this.punch.xReference;
        this.yReference = this.punch.yReference;
        this.xOffset = this.punch.resultingPunches
          .map((p) => this.formatIn(p.xOffset))
          .filter((v, i, a) => a.indexOf(v) === i)
          .reduce((acc, val) => acc + ', ' + val); // todo: localize inch value
        this.yOffset = this.punch.resultingPunches
          .map((p) => this.formatIn(p.yOffset))
          .filter((v, i, a) => a.indexOf(v) === i)
          .reduce((acc, val) => acc + ', ' + val); // todo: localize inch value
      }
    }
  }

  ngOnInit(): void {
    this.outSideClickListenerFunc = this.renderer.listen('window', 'click', (e: Event) => {
      if (!this.punchRow.nativeElement.contains(e.target) && this.isEdit) {
        if (this.isNew) {
          this.saveNewPunch(e);
        } else {
          this.savePunch(e);
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isMacro && changes.isMacro.currentValue !== changes.isMacro.previousValue) {
      this.references = this.isMacro ? this.macroReferenceColumns : this.referenceColumns;
    }
    if (changes && changes.punch && changes.punch.currentValue) {
      this.originalPunch = this.punch;
      this.initPunch();
    }
  }
  ngOnDestroy(): void {
    this.outSideClickListenerFunc();
  }
}
