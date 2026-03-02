import { CommonModule, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  Signal,
  signal,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { AppSysSidenavComponent } from '../../components/app-sys-sidenav/app-sys-sidenav.component';
import { filter, fromEvent, map } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  AppLogoComponent,
  PageTitleComponent,
  UserIdentityComponent,
  AccountModalComponent,
} from '../../components';
import { PageTitlePortalService } from '../../services';
import { AuthUsecase, EditUserUsecase } from '@app-store/lib/usecases';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-shell-component',
  standalone: true,
  imports: [
    AppSysSidenavComponent,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatDividerModule,
    NgTemplateOutlet,
    PageTitleComponent,
    MatMenuTrigger,
    UserIdentityComponent,
    MatMenu,
    MatMenuItem,
    CommonModule,
    AppLogoComponent,
  ],
  templateUrl: './shell-component.html',
  styleUrls: ['./shell-component.scss'],
})
export class ShellComponent {
  localStorageKey = 'system-sidenav-setting';

  protected breakpointObserver = inject(BreakpointObserver);

  private authUsecase = inject(AuthUsecase);
  private editUserUsecase = inject(EditUserUsecase);
  private dialog = inject(MatDialog);

  getAuthName$ = this.authUsecase.getAuthName$;
  getUserId$ = this.authUsecase.getUserId$;
  getUserInfo$ = this.authUsecase.getUserInfo$;

  getUserId = toSignal(this.getUserId$);
  userAuthName = toSignal(this.getAuthName$);
  userProfile = toSignal(this.getUserInfo$);

  breakpoint: Signal<BreakpointState | undefined> = toSignal(
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]),
  );

  portalOpen = signal(false);

  drawerToggle = signal(false);

  drawerOpen = computed(() => {
    return this.drawerToggle() || !this.breakpoint()?.matches;
  });

  smallerScreens = computed(() => {
    return this.breakpoint()?.matches;
  });

  readLocalStorageSidenavSetting(): boolean {
    const item = localStorage.getItem(this.localStorageKey);

    return item !== null ? item === 'true' : true;
  }

  isExpanded = signal(this.readLocalStorageSidenavSetting());

  toggleExpansion() {
    const updatedExpanded = !this.isExpanded();

    this.writeLocalStorageSidenavSetting(updatedExpanded);
    window.dispatchEvent(new Event('resize'));
    const event = new CustomEvent('localStorageChanged', {
      detail: { key: this.localStorageKey, value: updatedExpanded },
    });

    window.dispatchEvent(event);
  }

  writeLocalStorageSidenavSetting(setting: boolean) {
    localStorage.setItem(this.localStorageKey, `${setting}`);
  }

  private localStorageKeyChange$ = fromEvent<CustomEvent>(
    window,
    'localStorageChanged',
  ).pipe(
    filter((event) => event.detail?.key === this.localStorageKey),
    map((event) => event.detail?.value),
  );

  localStorageKeyChange = toSignal(this.localStorageKeyChange$);

  storageEffect = effect(
    () => {
      const storageEvent = this.localStorageKeyChange();
      this.isExpanded.update((v) =>
        typeof storageEvent !== 'undefined'
          ? storageEvent
          : this.readLocalStorageSidenavSetting(),
      );
    },
    { allowSignalWrites: true },
  );

  largerScreens = computed(() => {
    return !this.breakpoint()?.matches;
  });

  toggleDrawer() {
    this.drawerToggle.update((dt) => !dt);
  }

  togglePortal() {
    this.portalOpen.update((p) => !p);
  }

  roles$ = ['user'];

  private pageTitlePortal = inject(PageTitlePortalService);

  portal = toSignal(this.pageTitlePortal.portal$);

  logout() {
    this.authUsecase.logout();
  }

  openMyAccountModal() {
    this.dialog.open(AccountModalComponent, {
      width: '500px',
      data: {
        fullName: this.userAuthName(),
        userProfile: this.userProfile(),
        onSubmit: this.editAccount.bind(this),
      },
    });
  }

  editAccount({
    data,
    onSuccess,
    onFailure,
  }: {
    data: any;
    onSuccess: () => void;
    onFailure: (errors: { errorMsg: string }) => void;
  }) {
    this.editUserUsecase.execute(
      {
        ...data,
        id: this.getUserId(),
      },
      {
        onSuccess: () => {
          onSuccess();
        },
        onFailure,
      },
    );
  }

  //hardcoded for now
  currentMenuItems = [
    // DASHBOARD
    {
      label: 'Dashboard Activity',
      children: [
        {
          label: 'Dashboard',
          icon: 'dashboard',
          routerLink: ['/dashboard'],
        },
      ],
    },

    // NJ WALLET
    {
      label: 'Financial',
      children: [
        {
          label: 'Wallet',
          icon: 'account_balance_wallet',
          routerLink: ['/ecu-wallet'], // <-- FIXED
        },
      ],
    },

    // UNILEVEL
    {
      label: 'Network',
      children: [
        {
          label: 'Unilevel',
          icon: 'account_tree',
          routerLink: ['/unilevel'], // <-- FIXED
        },
      ],
    },

    // GENEALOGY
    {
      label: 'Genealogy',
      children: [
        {
          label: 'Genealogy',
          icon: 'family_restroom',
          routerLink: ['/geonology', this.getUserId() as string],
          // Replace 'current' with the actual user ID dynamically
        },
        // {
        //   label: 'User Log',
        //   icon: 'connect_without_contact',
        //   routerLink: ['/unilevel'],
        // },
      ],
    },
  ];
}
