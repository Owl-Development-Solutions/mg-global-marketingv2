import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProfileCardComponent } from '../../components';
import { ProfileTabsComponent } from '../../components/profile-tabs/profile-tabs.component';
import { PageTitlePortalService } from '../../services';
import { CdkPortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-dashboard',
  imports: [ProfileCardComponent, ProfileTabsComponent, CdkPortal],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnDestroy, OnInit {
  private pageTitlePortal = inject(PageTitlePortalService);

  @ViewChild(CdkPortal) pageTitle!: CdkPortal;

  ngOnInit(): void {
    setTimeout(() => {
      this.pageTitlePortal.setPortal(this.pageTitle);
    });
  }

  ngOnDestroy(): void {
    if (this.pageTitle?.isAttached) {
      this.pageTitle.detach();
      this.pageTitlePortal.setPortal(null!);
    }
  }
}
