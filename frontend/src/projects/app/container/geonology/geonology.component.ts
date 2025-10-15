import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  GeonologyTreeComponent,
  AddWalletButtonComponent,
} from '../../components';
import { GeonolyResult } from '../../mock';
import { MatIcon } from '@angular/material/icon';
import { CdkPortal } from '@angular/cdk/portal';
import { PageTitlePortalService } from '../../services';

@Component({
  selector: 'app-geonology',
  imports: [
    CommonModule,
    GeonologyTreeComponent,
    MatIcon,
    CdkPortal,
    AddWalletButtonComponent,
  ],
  styleUrl: './geonology.component.scss',
  templateUrl: './geonology.component.html',
})
export class GeonologyComponent implements OnInit, OnDestroy {
  userNode = GeonolyResult;

  private pageTitlePortal = inject(PageTitlePortalService);

  @ViewChild(CdkPortal) pageTitle!: CdkPortal;

  handleAddMember(event: any) {
    console.log('click parent');

    console.log(event);
  }

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
