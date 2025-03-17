import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  IAndonSequenceConfig,
  IMachine,
  IWallboardDevice,
  IWallboardDeviceParams,
} from 'src/app/core/dto';

interface Range {
  title: string;
  field: string;
  isChecked?: boolean;
}

interface Metric {
  title: string;
  field: string;
  unit: string;
  isChecked?: boolean;
}

@Component({
  selector: 'app-edit-wallboard-dialog',
  templateUrl: './edit-wallboard-dialog.component.html',
  styleUrls: ['./edit-wallboard-dialog.component.scss'],
})
export class EditWallboardDialogComponent {
  displayTypes = ['NoContent', 'Andon', 'Message', 'ExternalUrl', 'Warehouse', 'ProductionSummary'];
  themes = [
    {
      displayName: 'Light',
      value: 'light',
    },
    {
      displayName: 'Dark',
      value: 'dark',
    },
  ];
  metrics: Metric[] = [
    {
      title: 'Total(ft)',
      field: 'totalGoodLn',
      unit: 'ft',
      isChecked: true,
    },
    {
      title: 'Scrap(%)',
      field: 'netScrap',
      unit: '%',
      isChecked: false,
    },
    {
      title: 'ReclaimedScrap(ft)',
      field: 'reclaimedScrap',
      unit: 'ft',
      isChecked: false,
    },
    {
      title: 'Run(fpm)',
      field: 'runningThroughput',
      unit: 'fpm',
      isChecked: false,
    },
    {
      title: 'OEE(%)',
      field: 'oEE',
      unit: '%',
      isChecked: false,
    },
    {
      title: 'Target(%)',
      field: 'target',
      unit: '%',
      isChecked: false,
    },
    {
      title: 'Availability(%)',
      field: 'availability',
      unit: '%',
      isChecked: false,
    },
    {
      title: 'Speed(%)',
      field: 'speed',
      unit: '%',
      isChecked: false,
    },
    {
      title: 'Yield(%)',
      field: 'yield',
      unit: '%',
      isChecked: false,
    },
    {
      title: 'Coil Changes',
      field: 'coilChangeCount',
      unit: '',
      isChecked: false,
    },
    {
      title: 'Material Changes',
      field: 'materialChangeCount',
      unit: '',
      isChecked: false,
    },
    {
      title: 'Tooling Changes',
      field: 'toolingChangeCount',
      unit: '',
      isChecked: false,
    },
    {
      title: 'Total Cuts',
      field: 'totalCutCount',
      unit: '',
      isChecked: false,
    },
  ];
  ranges: Range[] = [
    //// The server can't calculate the current shift yet.
    //   {
    //     title: 'Current Shift',
    //     field: 'CurrentShift',
    //     isChecked: false
    //   },
    //   {
    //     title: 'Previous Shift',
    //     field: 'PreviousShift',
    //     isChecked: false
    //   },
    {
      title: 'Current Day',
      field: 'CurrentDay',
      isChecked: true,
    },
    {
      title: 'Previous Day',
      field: 'PreviousDay',
      isChecked: false,
    },
    {
      title: 'Current Week',
      field: 'CurrentWeek',
      isChecked: true,
    },
    {
      title: 'Previous Week',
      field: 'PreviousWeek',
      isChecked: true,
    },
    {
      title: 'Current Month',
      field: 'CurrentMonth',
      isChecked: true,
    },
    {
      title: 'Previous Month',
      field: 'PreviousMonth',
      isChecked: false,
    },
    {
      title: 'Past 7 Days',
      field: 'Past7Days',
      isChecked: false,
    },
    {
      title: 'Past 30 Days',
      field: 'Past30Days',
      isChecked: false,
    },
    {
      title: 'Past 90 Days',
      field: 'Past90Days',
      isChecked: false,
    },
    {
      title: 'Year To Date',
      field: 'YearToDate',
      isChecked: false,
    },
  ];
  machines: { machineNumber: number; description: string }[] = [];
  sequences: IAndonSequenceConfig[];
  selectedDevice: IWallboardDevice;
  selectedType:
    | 'NoContent'
    | 'Andon'
    | 'ExternalUrl'
    | 'Message'
    | 'Warehouse'
    | 'ProductionSummary';
  deviceParams: IWallboardDeviceParams;
  selectedMachine = 0;
  selectedSequence = '';
  showSchedule = false;
  selectedExternalUrl = '';
  message = '';
  selectedTheme = 'dark';
  allMetricsItem = { field: 'All', isChecked: false };
  selectedMetricsNum = 1;
  selectedMetrics = [];
  selectedMachines = [];
  allRangesItem = { field: 'All', isChecked: false };
  selectedRangesNum = 4;
  selectedRanges = [];

  constructor(
    public dialogRef: MatDialogRef<EditWallboardDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      machines: IMachine[];
      sequences: IAndonSequenceConfig[];
      device: IWallboardDevice;
    }
  ) {
    this.machines = data.machines.map((m) => ({
      machineNumber: m.machineNumber,
      description: m.description,
    }));
    this.sequences = data.sequences;
    this.selectedDevice = data.device;
    this.selectedType = data.device.contentType;
    // todo: stop using these this properties and use deviceParams instead
    this.deviceParams = data.device.deviceParams;
    this.selectedMachine = data.device.deviceParams?.machineNumber || 0;
    this.selectedSequence = data.device.deviceParams?.andonSequenceId || '';
    this.showSchedule = data.device.deviceParams?.showSchedule || false;
    this.selectedExternalUrl = data.device.deviceParams?.externalUrl || '';
    this.message = data.device.deviceParams?.message || '';
    this.selectedTheme = data.device.deviceParams?.theme || 'dark';
    if (this.deviceParams && this.deviceParams.machines && this.deviceParams.machines.length > 0) {
      this.selectedMachines = this.deviceParams.machines.map((m) => Number(m));
    }
    if (data.device.deviceParams?.metrics.length > 0) {
      this.selectedMetricsNum = data.device.deviceParams.metrics.length;
      this.selectedMetrics = data.device.deviceParams.metrics.map((r) => {
        const foundMetric = this.metrics.find((rr) => rr.field === r);
        return foundMetric;
      });
      this.metrics = this.metrics.map((m) => {
        if (data.device.deviceParams?.metrics.includes(m.field)) {
          return {
            ...m,
            isChecked: true,
          };
        }
        return {
          ...m,
          isChecked: false,
        };
      });
      this.allMetricsItem.isChecked = this.selectedMetricsNum === this.metrics.length;
    } else {
      this.selectedMetrics = this.metrics.filter((r) => r.isChecked);
    }

    if (data.device.deviceParams?.ranges.length > 0) {
      this.selectedRangesNum = data.device.deviceParams.ranges.length;
      this.selectedRanges = data.device.deviceParams.ranges.map((r) => {
        const foundRange = this.ranges.find((rr) => rr.field === r);
        return foundRange;
      });
      this.ranges = this.ranges.map((m) => {
        if (data.device.deviceParams.ranges.includes(m.field)) {
          return {
            ...m,
            isChecked: true,
          };
        }

        return {
          ...m,
          isChecked: false,
        };
      });
      this.allRangesItem.isChecked = this.selectedRangesNum === this.ranges.length;
    } else {
      this.selectedRanges = this.ranges.filter((r) => r.isChecked);
    }
  }

  onClickMetricMenuItem(item, $event) {
    //still needs to adjust visable list
    $event.stopPropagation();
    $event.preventDefault();
    if (item.field === 'All') {
      this.allMetricsItem.isChecked = !this.allMetricsItem.isChecked;
      this.checkedAllMetrics(this.allMetricsItem.isChecked);
    } else if (item.isChecked) {
      this.onRemoveMetricItem(item);
    } else {
      this.onAddMetricItem(item);
    }
  }

  isAllMetricsIndeterminate() {
    if (this.selectedMetricsNum > 0 && this.selectedMetricsNum < this.metrics.length) {
      return true;
    }

    return false;
  }

  checkedAllMetrics(flag) {
    this.metrics.map((m) => {
      m.isChecked = flag;
    });
    if (flag) {
      this.selectedMetricsNum = this.metrics.length;
      this.selectedMetrics = [...this.metrics];
    } else {
      this.selectedMetricsNum = 0;
      this.selectedMetrics = [];
    }
  }

  onClickRangeMenuItem(item, $event) {
    //still needs to adjust visable list
    $event.stopPropagation();
    $event.preventDefault();
    if (item.field === 'All') {
      this.allRangesItem.isChecked = !this.allRangesItem.isChecked;
      this.checkedAllRanges(this.allRangesItem.isChecked);
    } else if (item.isChecked) {
      this.onRemoveRangeItem(item);
    } else {
      this.onAddRangeItem(item);
    }
  }

  isAllRangesIndeterminate() {
    if (this.selectedRangesNum > 0 && this.selectedRangesNum < this.ranges.length) {
      return true;
    }

    return false;
  }

  checkedAllRanges(flag) {
    this.ranges.map((m) => {
      m.isChecked = flag;
    });
    if (flag) {
      this.selectedRangesNum = this.ranges.length;
      this.selectedRanges = [...this.ranges];
    } else {
      this.selectedRangesNum = 0;
      this.selectedRanges = [];
    }
  }

  getDisableState() {
    if (!this.selectedDevice.wallboardDeviceName) {
      return true;
    }
    if (this.selectedType === 'Andon') {
      return !this.selectedMachine || !this.selectedSequence;
    }

    if (this.selectedType === 'ExternalUrl') {
      return !this.selectedExternalUrl;
    }

    if (this.selectedType === 'Message') {
      return !this.message;
    }

    return false;
  }

  cancel() {
    this.dialogRef.close(false);
  }

  onRemoveMetricItem(item) {
    this.metrics = this.metrics.map((r) => {
      if (r.field === item.field) {
        return { ...r, isChecked: false };
      }
      return r;
    });
    this.selectedMetrics = this.selectedMetrics.filter((r) => r.field !== item.field);
    this.selectedMetricsNum--;
    this.allMetricsItem.isChecked = false;
  }

  onAddMetricItem(item) {
    this.metrics = this.metrics.map((r) => {
      if (r.field === item.field) {
        return { ...r, isChecked: true };
      }
      return r;
    });
    this.selectedMetricsNum++;
    this.selectedMetrics.push(item);
    this.allMetricsItem.isChecked = this.selectedMetricsNum === this.metrics.length;
  }

  onAddRangeItem(item) {
    this.ranges = this.ranges.map((r) => {
      if (r.field === item.field) {
        return { ...r, isChecked: true };
      }
      return r;
    });
    this.selectedRangesNum++;
    this.selectedRanges.push(item);
    this.allRangesItem.isChecked = this.selectedRangesNum === this.ranges.length;
  }

  onRemoveRangeItem(item) {
    this.ranges = this.ranges.map((r) => {
      if (r.field === item.field) {
        return { ...r, isChecked: false };
      }
      return r;
    });
    this.selectedRanges = this.selectedRanges.filter((r) => r.field !== item.field);
    this.selectedRangesNum--;
    this.allRangesItem.isChecked = false;
  }

  saveWallboard() {
    let updatedParams = {};
    switch (this.selectedType) {
      case 'Andon': {
        updatedParams = {
          machineNumber: this.selectedMachine,
          AndonSequenceId: this.selectedSequence,
          showSchedule: this.showSchedule,
          theme: this.selectedTheme,
        };
        break;
      }
      case 'ExternalUrl': {
        updatedParams = {
          externalUrl: this.selectedExternalUrl,
        };
        break;
      }
      case 'Message': {
        updatedParams = {
          message: this.message,
          theme: this.selectedTheme,
        };
        break;
      }
      case 'Warehouse': {
        updatedParams = {
          machines: this.selectedMachines.map((m) => m.toString()),
        };
        break;
      }
      case 'ProductionSummary': {
        const checkedMetrics = this.selectedMetrics.map((m) => m.field);
        const checkedRanges = this.selectedRanges.map((m) => m.field);
        updatedParams = {
          machines: this.selectedMachines.map((m) => m.toString()),
          metrics: checkedMetrics,
          ranges: checkedRanges,
          cycleSec: this.deviceParams.cycleSec,
          theme: this.selectedTheme,
        };
        break;
      }
    }

    const newDevie = {
      ...this.selectedDevice,
      contentType: this.selectedType,
      deviceParams: { ...this.deviceParams, ...updatedParams },
    };
    this.dialogRef.close(newDevie);
  }

  dropRange(event: CdkDragDrop<Range[]>) {
    moveItemInArray(this.selectedRanges, event.previousIndex, event.currentIndex);
  }

  dropMetric(event: CdkDragDrop<Metric[]>) {
    moveItemInArray(this.selectedMetrics, event.previousIndex, event.currentIndex);
  }
}
