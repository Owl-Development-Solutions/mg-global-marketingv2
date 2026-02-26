import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitlePortalService } from '../../services';
import { CdkPortal } from '@angular/cdk/portal';
import { ColumnContainerComponent } from '../../components';
import { BalanceCardComponent } from 'projects/app/components/balance-card/balance-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { WalletTableHistoryComponent } from 'projects/app/components/wallet-table-history/wallet-table-history.component';
import { MatDialog } from '@angular/material/dialog';
import { AddWalletModalComponent } from 'projects/app/components/add-wallet-modal/add-wallet-modal.component';
import { AuthUsecase, UserUsecase } from '@app-store/lib/usecases';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-ecu-wallet',
  imports: [
    CommonModule,
    CdkPortal,
    BalanceCardComponent,
    ColumnContainerComponent,
    MatButtonModule,
    MatIcon,
    WalletTableHistoryComponent,
  ],
  templateUrl: './ecu-wallet.component.html',
  styleUrls: ['./ecu-wallet.component.scss'],
})
export class EcuWalletComponent {
  private pageTitlePortal = inject(PageTitlePortalService);
  private dialog = inject(MatDialog);
  private userUsecase = inject(AuthUsecase);

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

  userId = toSignal(this.userUsecase.getUserId$);

  dataSource = [];

  balances = [
    { amount: '339.18 PHP', label: 'TOTAL BALANCE' },
    { amount: '145.00 PHP', label: 'TOTAL ELEARNINGS' },
  ];

  handleAddWallet() {
    this.dialog.open(AddWalletModalComponent, {
      width: '500px',
      data: {
        onSubmit: this.submitWallet.bind(this),
      },
    });
  }

  submitWallet({
    price,
    onSuccess,
    onFailure,
  }: {
    price: string;
    onSuccess: () => void;
    onFailure: (errors: { errorMsg: string }) => void;
  }) {
    console.log(`price from modal`, price);
  }
}
