import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class TransService {
  constructor(private translate: TranslateService) {}
  setLanguage(code) {
    this.translate.use(code);
    moment.locale(code);
  }
}
