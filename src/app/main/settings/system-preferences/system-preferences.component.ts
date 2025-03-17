import { Component, Inject } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { ISystemPreferences, ILanguage } from 'src/app/core/dto';
import { UnitsService } from '../../shared/services/units.service';
import { ClientDataStore } from '../../shared/services/clientData.store';
import { FeatureFlagService } from '../../shared/services/feature-flag.service';
import { TransService } from '../../shared/services/trans.service';
import { Ams } from 'src/app/amsconfig';

@Component({
  selector: 'app-system-preferences',
  templateUrl: './system-preferences.component.html',
  styleUrls: ['./system-preferences.component.scss'],
})
export class SystemPreferencesComponent {
  systemPreferences: ISystemPreferences;
  languages: ILanguage[] = [];
  selectedLanguage: any;
  units: any[];
  selectedUnit: any;
  experimentalFeatures: boolean;
  subscriptions_: Subscription[] = [];
  constructor(
    private unitsService: UnitsService,
    private clientDataStore: ClientDataStore,
    private featureFlagService: FeatureFlagService,
    private translationService: TransService,
    private translate: TranslateService,
    private http: HttpClient
  ) {
    this.getLanguages();
    this.subscriptions_ = [
      clientDataStore.SelectSystemPreferences().subscribe((preferences) => {
        this.systemPreferences = { ...preferences };
        this.selectTheLanguage();

        this.units = unitsService.getBaseUnits();
        this.units.forEach((unit) => {
          this.units[unit.key] = unit;
        });
        this.selectedUnit = this.units[this.systemPreferences.inchesUnit];
      }),
    ];
    this.featureFlagService.features$.subscribe((features) => {
      this.experimentalFeatures = features['experimental'];
    });
  }

  getLanguages() {
    this.http.get(`${Ams.Config.BASE_URL}/api/languages`).subscribe((data: ILanguage[]) => {
      this.languages = data;
      this.selectTheLanguage();
    });
  }

  selectTheLanguage() {
    if (this.systemPreferences && this.systemPreferences.systemLanguage) {
      if (this.languages.length > 0) {
        this.selectedLanguage = this.languages.find(
          (l) => l.code === this.systemPreferences.systemLanguage
        );
      }
    }
  }

  /**
   * Change Language Preference
   */
  updatePrefs(lang) {
    this.systemPreferences.systemLanguage = lang.code;
    this.http
      .post(`${Ams.Config.BASE_URL}/api/systemPreferences`, { systemLanguage: lang.code })
      .subscribe();
  }

  /**
   * Change Language Preference
   */
  changeLanguage(lang) {
    this.selectedLanguage = lang;
    // it is for angularjs.
    this.translationService.setLanguage(lang.code);
    // it is for angular 16.
    this.translate.use(lang.code);
    moment.locale(lang.code);
    this.updatePrefs(lang);
  }

  changeUnit(unit) {
    this.selectedUnit = unit;
    this.systemPreferences.inchesUnit = unit.key;
    this.unitsService.currentInchesKey = unit.key;
    this.http
      .post(`${Ams.Config.BASE_URL}/api/systemPreferences`, { inchesUnit: unit.key })
      .subscribe();
  }

  setExperimentalFeatures() {
    this.featureFlagService
      .setFeature('experimental', this.experimentalFeatures)
      .subscribe(() => document.location.reload());
  }

  update(property: string) {
    this.http
      .post(`${Ams.Config.BASE_URL}/api/systemPreferences`, {
        [property]: this.systemPreferences[property],
      })
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
  }
}
