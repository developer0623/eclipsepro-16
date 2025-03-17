import { Pipe, PipeTransform } from '@angular/core';
import { IntegrationService } from '../../shared/services/integration.service';

@Pipe({
  name: 'configType',
})
export class ConfigTypePipe implements PipeTransform {
  constructor(private integrationConfigService: IntegrationService) {}

  transform(val: string, configField: string): unknown {
    const config = this.integrationConfigService.getConfigs(configField);
    if (config && config[val]) {
      return config[val].name;
    }

    return val;
  }
}
