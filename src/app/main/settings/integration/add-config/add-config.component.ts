import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Ams } from 'src/app/amsconfig';
import { IntegrationService } from 'src/app/main/shared/services/integration.service';
import { IExternalConnection } from 'src/app/core/dto';

@Component({
  selector: 'app-add-config',
  templateUrl: './add-config.component.html',
  styleUrls: ['./add-config.component.scss'],
})
export class AddConfigComponent implements OnInit {
  timeStampKey = '';
  config;
  title = '';
  key = '';
  configList;
  settings = {
    pollInterval: '',
  };
  selectedConfig;
  configEnabled = false;
  externalConnections = [];
  messages = [];
  itemsList;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AddConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { config; key: string; title: string },
    private integrationService: IntegrationService
  ) {
    this.config = { ...data.config };
    this.key = data.key;
    this.title = data.title;
    this.configList = this.integrationService.getConfigs(this.key);
    if (!this.config.type) {
      this.selectedConfig = Object.keys(this.configList)[0];
    } else {
      this.selectedConfig = this.config.type;
      this.settings = { ...this.config.settings };
    }

    this.configEnabled = data.config.enabled;

    this.messages = this.config.messages || [];
    this.itemsList = this.configList[this.selectedConfig].items;

    this.http
      .get<IExternalConnection[]>(
        Ams.Config.BASE_URL + '/_api/integration/externalConnectionConfigs'
      )
      .subscribe((list: any[]) => {
        this.externalConnections = list;
      });
  }

  onInitSettings() {
    const newItems = Object.keys(this.itemsList);
    newItems.forEach((item) => {
      if (!!this.settings[item] && this.itemsList[item].type === 'interval') {
        this.settings = {
          ...this.settings,
          [item]: this.settings[item].split(':'),
        };
        this.timeStampKey = item;
      } else if (!!this.settings[item] && this.itemsList[item].type !== 'interval') {
        this.settings = {
          ...this.settings,
          [item]: this.settings[item],
        };
      } else if (this.itemsList[item].type === 'interval') {
        this.settings = {
          ...this.settings,
          [item]: this.itemsList[item].default.split(':'),
        };
        this.timeStampKey = item;
      } else {
        this.settings = {
          ...this.settings,
          [item]: this.itemsList[item].default,
        };
      }
    });
  }

  getKeys(val) {
    return Object.keys(val);
  }

  onChangeConfig(configKey) {
    console.log('configKey', configKey);
    this.itemsList = this.configList[configKey].items;
    this.onInitSettings();
  }

  onUpdateSettings(valKey, index, val) {
    this.settings[valKey][index] = val;
  }

  onTest() {
    this.messages = [...this.messages, 'Testing is not implemented'];
  }

  onSave() {
    let newSettings = { ...this.settings };
    if (this.timeStampKey) {
      const timestampArr = newSettings[this.timeStampKey];
      const realTimeVal = `${timestampArr[0]}:${timestampArr[1]}:${timestampArr[2]}`;
      newSettings = {
        ...newSettings,
        [this.timeStampKey]: realTimeVal,
      };
    }
    const newConfig = {
      ...this.config,
      type: this.selectedConfig,
      enabled: this.configEnabled,
      settings: newSettings,
    };

    if (this.config.id) {
      this.integrationService.update(newConfig, this.key);
    } else {
      this.integrationService.save(newConfig, this.key);
    }
    this.cancel();
  }

  cancel() {
    this.dialogRef.close(false);
  }

  trackByKey = (index: number): any => {
    return index;
  };

  ngOnInit(): void {
    this.onInitSettings();
  }
}
