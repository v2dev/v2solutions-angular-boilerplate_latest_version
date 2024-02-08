import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { ThemeService } from 'src/app/core/services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  profileMenu: MenuItem[] = [];
  theme = 'dark';
  destroy$: Subject<void> = new Subject();

  constructor(
    private readonly authService: AuthService,
    private readonly themeService: ThemeService,
  ) { }

  ngOnInit() {
    this.profileMenu = [
      {
        label: 'Dark mode',
        icon: 'pi pi-fw pi-moon',
        command: () => {
          this.change();
        },
        style: { cursor: 'pointer' }
      },
      {
        icon: 'pi pi-fw pi-power-off',
        label: 'Logout',
        command: () => {
          this.logout();
        },
        style: { cursor: 'pointer' }
      },
    ];
  }

  logout() {
    this.authService.logOut();
  }

  change() {
    let theme = '';
    if (this.theme === 'light') {
      theme = 'bootstrap4-light-blue';
      this.theme = 'dark';
      this.profileMenu[0].icon = 'pi pi-fw pi-moon';
      this.profileMenu[0].label = 'Dark mode';
    } else {
      theme = 'bootstrap4-dark-blue';
      this.theme = 'light';
      this.profileMenu[0].icon = 'pi pi-fw pi-sun';
      this.profileMenu[0].label = 'Light mode';
    }
    this.themeService.switchTheme(theme);
  }
}
