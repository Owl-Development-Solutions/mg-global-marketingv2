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
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { AddUserGeonologyData, GeonologyNode } from '@app-store/public-api';

@Component({
  selector: 'app-geonology',
  imports: [CommonModule, GeonologyTreeComponent, MatIcon, CdkPortal],
  styleUrl: './geonology.component.scss',
  templateUrl: './geonology.component.html',
})
export class GeonologyComponent implements OnInit, OnDestroy {
  private pageTitlePortal = inject(PageTitlePortalService);
  private dialog = inject(MatDialog);
  private geonologyUsecase = inject(GeonologyUsecase);
  private route = inject(ActivatedRoute);

  @ViewChild(CdkPortal) pageTitle!: CdkPortal;

  geonologyData$ = this.geonologyUsecase.geonologyData$;
  genealogyTreeLoading$ = this.geonologyUsecase.genealogyTreeLoading$;

  handleAddMember(geonologyData: { data: GeonologyNode; side: string }) {
    this.dialog.open(AddMemberModalComponent, {
      data: {
        data: geonologyData.data,
        side: geonologyData.side,
        onSubmit: this.submitAddMember.bind(this),
      },
    });
  }

  submitAddMember({
    data,
    onSuccess,
    onFailure,
  }: {
    data: AddUserGeonologyData;
    onSuccess: () => void;
    onFailure: (errors: { errorMsg: string }) => void;
  }) {
    this.geonologyUsecase.addUserGeonology(data, {
      onSuccess: () => {
        onSuccess();
      },
      onFailure,
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
