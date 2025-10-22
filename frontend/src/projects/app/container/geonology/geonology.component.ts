import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  GeonologyTreeComponent,
  AddWalletButtonComponent,
  AddMemberModalComponent,
} from '../../components';
import { GeonolyResult } from '../../mock';
import { MatIcon } from '@angular/material/icon';
import { CdkPortal } from '@angular/cdk/portal';
import { PageTitlePortalService } from '../../services';
import { MatDialog } from '@angular/material/dialog';
import { GeonologyUsecase } from '@app-store/lib/usecases';

@Component({
  selector: 'app-geonology',
  imports: [CommonModule, GeonologyTreeComponent, MatIcon, CdkPortal],
  styleUrl: './geonology.component.scss',
  templateUrl: './geonology.component.html',
})
export class GeonologyComponent implements OnInit, OnDestroy {
  userNode = GeonolyResult;

  private pageTitlePortal = inject(PageTitlePortalService);
  private dialog = inject(MatDialog);
  private geonologyData = inject(GeonologyUsecase);

  @ViewChild(CdkPortal) pageTitle!: CdkPortal;

  data = this.geonologyData.geonologyData$;

  handleAddMember(geonologyData: { data: any; side: string }) {
    this.dialog.open(AddMemberModalComponent, {
      data: {
        data: geonologyData.data,
        side: geonologyData.side,
      },
    });
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
