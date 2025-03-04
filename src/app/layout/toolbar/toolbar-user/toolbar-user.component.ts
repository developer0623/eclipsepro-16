import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserSession } from 'src/app/main/shared/services/store/user/selector';
import { IUserSession } from 'src/app/core/dto';
import { AuthService } from 'src/app/main/shared/services/auth.service';

@Component({
  selector: 'fury-toolbar-user',
  templateUrl: './toolbar-user.component.html',
  styleUrls: ['./toolbar-user.component.scss']
})
export class ToolbarUserComponent implements OnInit {
  isOpen: boolean;
  user: IUserSession;

  constructor(
    private store: Store,
    private authService: AuthService
  ) {
    this.store.select(selectUserSession).subscribe((user) => {
      if (user !== null) {
        this.user = { ...user };
      } else {
        this.user = { userName: '' } as IUserSession;
      }
    });
   }

  ngOnInit() {
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onClickOutside() {
    this.isOpen = false;
  }

  logout() {
    this.authService.logout();
  }

}
