import { Component, inject, ViewChild } from '@angular/core';
import { PageTitlePortalService } from '../../services';
import { CdkPortal } from '@angular/cdk/portal';
import { AddWalletButtonComponent } from '../../components';

@Component({
  selector: 'app-unilevel',
  imports: [CdkPortal, AddWalletButtonComponent],
  templateUrl: './unilevel.component.html',
  styleUrl: './unilevel.component.scss',
})
export class UnilevelComponent {
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

  test = 'project';
}
