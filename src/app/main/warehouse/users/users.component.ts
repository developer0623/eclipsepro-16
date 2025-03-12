import { Component, OnDestroy } from '@angular/core';
import { combineLatestWith, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IUserTaskFilters } from 'src/app/core/dto';
import { ClientDataStore } from '../../shared/services/clientData.store';

interface IUserViewModel extends IUserTaskFilters {
  transferType: 'All' | 'Coil' | 'Finished Product';
}
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnDestroy {
  public facets: any[] = [];
  public users: IUserViewModel[] = [];
  public transferTypes = [{ title: 'All' }, { title: 'Coil' }, { title: 'Finished Product' }];
  panelIsOpen = false;
  selectedType: string;
  dataSub_: Subscription;
  constructor(private clientDataStore: ClientDataStore) {}

  onChangeTransferType(user, event) {
    console.log(user, event);
  }
  ngOnInit(): void {
    this.selectedType = '';
    this.dataSub_ = this.clientDataStore
      .SelectTaskFilters()
      .pipe(
        combineLatestWith(
          this.clientDataStore.SelectUsersTaskFilters().pipe(filter((users) => users.length > 0))
        )
      )
      .subscribe(([taskFilters, userTaskFilters]) => {
        const facets = taskFilters;
        const usersfilters = userTaskFilters;

        this.facets = facets.map((facet) => {
          const userSettings = usersfilters.map((user) => {
            const isAllFacetChecked = facet.filters.every((filter) =>
              user.filters.some((f) => f.filterId === filter.id && f.checked)
            );
            const isAnyFacetChecked = facet.filters.some((filter) =>
              user.filters.some((f) => f.filterId === filter.id && f.checked)
            );
            return {
              isAllFacetChecked,
              isFacetIndeterminate: !isAllFacetChecked && isAnyFacetChecked,
            };
          });

          const filters = facet.filters.map((filter) => {
            const userSettings = usersfilters.map((user) => ({
              isFilterChecked: user.filters.some((f) => f.filterId === filter.id && f.checked),
            }));
            return { ...filter, userSettings };
          });

          return { ...facet, userSettings, filters };
        });

        const transferTypeFacet = facets.find((f) => f.title === 'Transfer Type');

        this.users = usersfilters.map((user) => {
          console.log(user);
          const coilIsOn = user.filters.some(
            (f) => f.filterId === 'TransferType/coil' && f.checked
          );
          const finiIsOn = user.filters.some(
            (f) => f.filterId === 'TransferType/finished' && f.checked
          );

          const ttVal =
            (coilIsOn && finiIsOn) || (!coilIsOn && !finiIsOn)
              ? 'All'
              : coilIsOn
              ? 'Coil'
              : 'Finished Product';

          return { transferType: ttVal, ...user };
        });
      });
  }

  ngOnDestroy(): void {
    this.dataSub_.unsubscribe();
  }
}
