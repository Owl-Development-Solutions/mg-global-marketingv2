import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ProfileCardComponent,
  AddWalletButtonComponent,
} from '../../components';
import { ProfileTabsComponent } from '../../components/profile-tabs/profile-tabs.component';
import { PageTitlePortalService } from '../../services';
import { CdkPortal } from '@angular/cdk/portal';
import { AuthUsecase } from '@app-store/lib/usecases';
import { toSignal } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [ProfileCardComponent, ProfileTabsComponent, CdkPortal, JsonPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnDestroy, OnInit {
  private pageTitlePortal = inject(PageTitlePortalService);
  private authUsecase = inject(AuthUsecase);

  getAuthName$ = this.authUsecase.getAuthName$;
  getUserInfo$ = this.authUsecase.getUserInfo$;

  getUserInfo = toSignal(this.getUserInfo$);

  getAuthName = toSignal(this.getAuthName$);

  @ViewChild(CdkPortal) pageTitle!: CdkPortal;

  ngOnInit(): void {
    setTimeout(() => {
      this.pageTitlePortal.setPortal(this.pageTitle);
    });
  }

  getTitleBasedOnTime(): string {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  }
  balances = computed(() => {
    const user = this.getUserInfo();

    // Provide a fallback of 0 if the user isn't loaded yet
    const totalBalance = user?.totalBalance ?? 0;

    return [
      {
        amount: `${totalBalance.toFixed(2)} PHP`,
        label: 'TOTAL BALANCE',
      },
      {
        amount: `0.00 PHP`,
        label: 'TOTAL EARNINGS',
      },
    ];
  });
  ngOnDestroy(): void {
    if (this.pageTitle?.isAttached) {
      this.pageTitle.detach();
      this.pageTitlePortal.setPortal(null!);
    }
  }
}
