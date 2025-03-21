import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Ams } from 'src/app/amsconfig';

const ConfigValues = {
  orderImport: {
    AmsBundleInFileOrderImport: {
      name: 'Ams BundleIn File Import',
      items: {
        pollInterval: {
          name: 'Interval',
          type: 'interval',
          default: '00:10:00',
        },
        importFileDirectory: {
          name: 'File Directory',
          type: 'string',
          default: '',
        },
        importFileSpec: {
          name: 'File Name',
          type: 'string',
          default: '',
        },
      },
    },
    AmsOrdInFileOrderImport: {
      name: 'Ams OrdIn File Import',
      items: {
        pollInterval: {
          name: 'Interval',
          type: 'interval',
          default: '00:10:00',
        },
        importFileDirectory: {
          name: 'File Directory',
          type: 'string',
          default: '',
        },
        importFileSpec: {
          name: 'File Name',
          type: 'string',
          default: '',
        },
      },
    },
    BeckFileOrderImport: {
      name: 'Beck File Import',
      items: {
        pollInterval: {
          name: 'Interval',
          type: 'interval',
          default: '00:10:00',
        },
        importFileDirectory: {
          name: 'Order File Directory',
          type: 'string',
          default: '',
        },
        importFileSpec: {
          name: 'Order File Name',
          type: 'string',
          default: '',
        },
      },
    },
    SqlOrderImport: {
      name: 'SQL Import',
      items: {
        pollInterval: {
          name: 'Interval',
          type: 'interval',
          default: '00:10:00',
        },
        connStr: {
          name: 'Connection String',
          type: 'string',
          default: '',
        },
        orderInTable: {
          name: 'OrderIn Table',
          type: 'string',
          default: '',
        },
        bundleInTable: {
          name: 'BundleIn Table',
          type: 'string',
          default: '',
        },
      },
    },
    MetalSalesOrderImport: {
      name: 'Metal Sales',
      items: {
        pollInterval: {
          name: 'Interval',
          type: 'interval',
          default: '00:10:00',
        },
        fetchPageSize: {
          name: 'Fetch Page Size',
          type: 'integer',
          default: '5',
        },
        //// this might be a good idea in the future but not yet.
        // createStockBundles: {
        //     name: 'Create Stock Bundles',
        //     type: 'bool',
        //     default: 'true'
        // },
        bundleByRules: {
          name: 'Bundle On Import',
          type: 'bool',
          default: 'true',
        },
        makeSpecialPatternNames: {
          name: 'Specialize Pattern Names (SP1 becomes WO99-123-SP1)',
          type: 'bool',
          default: 'false',
        },
      },
    },
    TriCountyOrderImport: {
      name: 'Tri-County',
      items: {
        pollInterval: {
          name: 'Interval',
          type: 'interval',
          default: '00:10:00',
        },
        fetchPageSize: {
          name: 'Fetch Page Size',
          type: 'integer',
          default: '5',
        },
        //// this might be a good idea in the future but not yet.
        // createStockBundles: {
        //     name: 'Create Stock Bundles',
        //     type: 'bool',
        //     default: 'true'
        // },
        // bundleByRules: {
        //     name: 'Bundle On Import',
        //     type: 'bool',
        //     default: 'true'
        // },
        // makeSpecialPatternNames: {
        //     name: 'Specialize Pattern Names (SP1 becomes WO99-123-SP1)',
        //     type: 'bool',
        //     default: 'false'
        // }
      },
    },
  },
  coilImport: {
    FileCoilImporter: {
      name: 'File Import',
      items: {
        pollInterval: {
          name: 'Interval',
          type: 'interval',
          default: '00:10:00',
        },
        importFileDirectory: {
          name: 'CoilIn File Location',
          type: 'string',
          default: '',
        },
        importFileSpec: {
          name: 'CoilIn File Name',
          type: 'string',
          default: '',
        },
      },
    },
    DbCoilImporter: {
      name: 'Database Import',
      items: {
        pollInterval: {
          name: 'Interval',
          type: 'interval',
          default: '00:10:00',
        },
        externalConnectionId: {
          name: 'Connection',
          type: 'externalConnection',
          default: '',
        },
        tableOrViewName: {
          name: 'CoilIn Table',
          type: 'string',
          default: '',
        },
      },
    },
    DbCoilSyncer: {
      name: 'Database Coil Sync',
      items: {
        pollInterval: {
          name: 'Interval',
          type: 'interval',
          default: '00:10:00',
        },
        externalConnectionId: {
          name: 'Connection',
          type: 'externalConnection',
          default: '',
        },
        tableOrViewName: {
          name: 'Coil Sync Table',
          type: 'string',
          default: '',
        },
        fetchSize: {
          name: 'Fetch Size',
          type: 'integer',
          default: '1000',
        },
        // changeDetectionMethod, syncChangeField, pageSize?
      },
    },
    MetalSalesCoilImportingImplementation: {
      name: 'Metal Sales',
      items: {
        pollInterval: {
          name: 'Interval',
          type: 'interval',
          default: '00:10:00',
        },
      },
    },
  },
  materialImport: {
    FileMaterialImporter: {
      name: 'File Import',
      items: {
        pollInterval: {
          name: 'Interval',
          type: 'interval',
          default: '00:10:00',
        },
        importFileDirectory: {
          name: 'MaterialIn File Location',
          type: 'string',
          default: '',
        },
        importFileSpec: {
          name: 'MaterialIn File Name',
          type: 'string',
          default: '',
        },
      },
    },
    SqlMaterialImporter: {
      name: 'SQL Import',
      items: {
        pollInterval: {
          name: 'Interval',
          type: 'interval',
          default: '00:10:00',
        },
        ConnectionString: {
          name: 'Connection String',
          type: 'string',
          default: '',
        },
        TableOrViewName: {
          name: 'MaterialIn Table',
          type: 'string',
          default: '',
        },
      },
    },
    MetalSalesMaterialImportingImplementation: {
      name: 'Metal Sales',
      items: {},
    },
  },
  scheduleSync: {
    DbScheduleSyncer: {
      name: 'Database Sync',
      items: {
        externalConnectionId: {
          name: 'Connection',
          type: 'externalConnection',
          default: '',
        },
        tableOrViewName: {
          name: 'Schedule Table',
          type: 'string',
          default: 'ams_SchSync',
          kbLink: 'https://www.amscontrols.com/kb/schedule-sync-table-definition/',
        },
        pollInterval: {
          name: 'Interval',
          type: 'interval',
          default: '00:10:00',
        },
        fetchSize: {
          name: 'Fetch Size',
          type: 'integer',
          default: '1000',
        },
        holdJobsNotInSyncData: {
          name: 'Hold Jobs Not In Sync Data',
          type: 'bool',
          default: false,
        },
      },
    },
  },
  export: {
    MetalSalesExport: {
      name: 'Metal Sales',
      items: {
        maxAdjustmentFeet: {
          name: 'Max Feet to Adjust',
          type: 'integer',
          default: '50',
        },
        defaultIssueBin: {
          name: 'BIN ID for non-serialized items',
          type: 'string',
          default: '',
        },
      },
    },
    DigitalBuildingsExport: {
      name: 'Digital Buildings',
      items: {
        externalConnectionId: {
          name: 'Connection',
          type: 'externalConnection',
          default: '',
        },
      },
    },
  },
  coilValidation: {
    DefaultCoilValidation: {
      name: 'Default Validation',
      items: {},
    },
    DbCoilValidation: {
      name: 'Database Coil Validation',
      items: {
        externalConnectionId: {
          name: 'Connection',
          type: 'externalConnection',
          default: '',
        },
        tableOrViewName: {
          name: 'Coil Table/View',
          type: 'string',
          default: '',
        },
      },
    },
    MetalSalesCoilValidation: {
      name: 'Metal Sales',
      items: {},
    },
    DigitalBuildingsCoilValidation: {
      name: 'Digital Buildings',
      items: {
        externalConnectionId: {
          name: 'Connection',
          type: 'externalConnection',
          default: '',
        },
      },
    },
  },
  webhook: {
    MachineScheduleWebhook: {
      name: 'Machine Schedule',
      items: {
        url: {
          name: 'Url',
          type: 'string',
          default: '',
        },
        throttleTime: {
          name: 'Throttle Time',
          type: 'interval',
          default: '00:10:00',
        },
      },
    },
  },
  externalConnection: {
    DatabaseConnection: {
      name: 'Database Connection',
      items: {
        name: {
          name: 'Name',
          type: 'string',
          default: 'Database Connection',
        },
        connectionString: {
          name: 'Connection String',
          type: 'string',
          default: '',
        },
        databaseType: {
          name: 'Database Type',
          type: 'option',
          default: 'SqlServer',
          options: [
            { key: 'SqlServer', value: 'SQL Server' },
            { key: 'Oracle', value: 'Oracle' },
            { key: 'MySql', value: 'MySQL' },
            { key: 'DB2', value: 'DB2' },
          ],
        },
        plantCode: {
          name: 'Plant Code',
          type: 'string',
          default: '',
        },
      },
    },
    AzureADConnection: {
      name: 'Azure AD Connection',
      items: {
        name: {
          name: 'Name',
          type: 'string',
          default: 'Azure AD Connection',
        },
        azureAdTenantId: {
          name: 'Tenant Id',
          type: 'string',
          default: '',
        },
        azureAdClientId: {
          name: 'Client Id',
          type: 'string',
          default: '',
        },
        azureAdClientSecret: {
          name: 'Client Secret',
          type: 'string',
          default: '',
        },
        azureAdResource: {
          name: 'Resource',
          type: 'string',
          default: 'https://<your-d365fo-environment>.dynamics.com',
        },
      },
    },
    NetSuiteConnection: {
      name: 'NetSuite Connection',
      items: {
        name: {
          name: 'Name',
          type: 'string',
          default: 'NetSuite Connection',
        },
        netSuiteAccount: {
          name: 'Account',
          type: 'string',
          default: '',
        },
        netSuiteApplicationId: {
          name: 'Application Id',
          type: 'string',
          default: '',
        },
        netSuiteConsumerKey: {
          name: 'Consumer Key',
          type: 'string',
          default: '',
        },
        netSuiteConsumerSecret: {
          name: 'Consumer Secret',
          type: 'string',
          default: '',
        },
        netSuiteTokenId: {
          name: 'Token Id',
          type: 'string',
          default: '',
        },
        netSuiteTokenSecret: {
          name: 'Token Secret',
          type: 'string',
          default: '',
        },
        netSuiteLocationId: {
          name: 'Location Id',
          type: 'string',
          default: '',
        },
      },
    },
  },
};

@Injectable({
  providedIn: 'root',
})
export class IntegrationService {
  allowedImplementations: string[] = [];

  constructor(private http: HttpClient) {
    this.http
      .get(Ams.Config.BASE_URL + '/_api/integration/configsmasterlist')
      .subscribe((list: any[]) => {
        this.allowedImplementations = [
          ...list,
          'DatabaseConnection',
          'AzureADConnection',
          'NetSuiteConnection',
        ];
      });
  }

  save(config, key) {
    this.http.put(`${Ams.Config.BASE_URL}/_api/integration/${key}Configs`, config).subscribe({
      next: (data) => {
        console.log('integration config save----------', data);
      },
      error: (error) => {
        console.log('integration config error', error);
      },
    });
  }

  update(config, key) {
    this.http
      .put(
        `${Ams.Config.BASE_URL}/_api/integration/${key}Configs/${encodeURIComponent(config.id)}`,
        config
      )
      .subscribe({
        next: (data) => {
          console.log('integration config save----------', data);
        },
        error: (error) => {
          console.log('integration config error', error);
        },
      });
  }

  runConfig(id: string) {
    this.http
      .post(
        `${Ams.Config.BASE_URL}/_api/integration/requestImmediateImport/${encodeURIComponent(id)}`,
        { id }
      )
      .subscribe({
        next: (result) => {
          console.log('run config ----------', result);
        },
        error: (error) => {
          console.log('run config error', error);
        },
      });
  }

  getConfigs(field: string) {
    const configs = ConfigValues[field];
    if (!configs) throw `There is no ConfigValues entry for ${field}`;

    let filteredConfigs = {};
    for (let key of Object.keys(configs)) {
      if (this.allowedImplementations.indexOf(key) > -1) {
        filteredConfigs[key] = configs[key];
      }
    }

    return filteredConfigs;
  }
}
