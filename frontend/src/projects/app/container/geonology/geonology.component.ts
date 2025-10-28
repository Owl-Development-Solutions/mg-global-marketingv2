import { CommonModule, Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  GeonologyTreeComponent,
  AddMemberModalComponent,
  SkeletonTextComponent,
} from '../../components';
import { MatIcon } from '@angular/material/icon';
import { CdkPortal } from '@angular/cdk/portal';
import { PageTitlePortalService } from '../../services';
import { MatDialog } from '@angular/material/dialog';
import { AuthUsecase, GeonologyUsecase } from '@app-store/lib/usecases';
import { ActivatedRoute, Router } from '@angular/router';
import { AddUserGeonologyData, GeonologyNode } from '@app-store/public-api';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-geonology',
  imports: [
    CommonModule,
    GeonologyTreeComponent,
    MatIcon,
    CdkPortal,
    MatButtonModule,
    SkeletonTextComponent,
    MatTooltipModule,
  ],
  styleUrl: './geonology.component.scss',
  templateUrl: './geonology.component.html',
})
export class GeonologyComponent implements OnInit, OnDestroy {
  private pageTitlePortal = inject(PageTitlePortalService);
  private dialog = inject(MatDialog);
  private geonologyUsecase = inject(GeonologyUsecase);
  private authUsecase = inject(AuthUsecase);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private router = inject(Router);

  @ViewChild(CdkPortal) pageTitle!: CdkPortal;

  back = signal(false);
  paramUserId = signal<any>(null);

  geonologyData$ = this.geonologyUsecase.geonologyData$;
  genealogyTreeLoading$ = this.geonologyUsecase.genealogyTreeLoading$;
  geonoloyRootFullName$ = this.geonologyUsecase.geonoloyRootFullName$;

  getUserId$ = this.authUsecase.getUserId$;

  loading = toSignal(this.genealogyTreeLoading$);
  fullName = toSignal(this.geonoloyRootFullName$);
  userId = toSignal(this.getUserId$);

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

  handleRouteToMember({ userId }: { userId: string | undefined }) {
    if (userId) {
      this.router.navigate(['/geonology', userId]);
      this.back.set(true);
    }
  }

  goBack(event: Event) {
    this.location.back();
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
