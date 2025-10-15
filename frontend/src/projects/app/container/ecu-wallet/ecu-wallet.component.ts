import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitlePortalService } from '../../services';
import { CdkPortal } from '@angular/cdk/portal';
import { AddWalletButtonComponent } from '../../components';

interface Transaction {
  ref: string;
  userId: string;
  amount: number;
  date: string;
  author: string;
  remarks: string;
  currency: string;
}

@Component({
  selector: 'app-ecu-wallet',
  imports: [CommonModule, CdkPortal, AddWalletButtonComponent],
  templateUrl: './ecu-wallet.component.html',
  styleUrls: ['./ecu-wallet.component.scss'],
})
export class EcuWalletComponent {
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

  //refactor to use angular material

  // ✅ Transactions list
  transactions: Transaction[] = [
    {
      ref: 'TXN001',
      userId: 'FA049950',
      amount: 145.0,
      date: '2025-10-04',
      author: 'Admin',
      remarks: 'Initial Load',
      currency: 'PHP',
    },
    {
      ref: 'TXN002',
      userId: 'FA049950',
      amount: -50.0,
      date: '2025-10-04',
      author: 'Admin',
      remarks: 'Withdrawal',
      currency: 'PHP',
    },
  ];

  // ✅ Modal State
  showReloadModal = false;
  amounts = [500, 1000, 5000, 10000, 20000, 50000, 100000];
  selectedAmount = 0;
  operation: '+' | '-' = '+';

  // ✅ Open Modal
  openReloadModal() {
    this.showReloadModal = true;
  }

  // ✅ Close Modal
  closeReloadModal() {
    this.showReloadModal = false;
    this.selectedAmount = 0;
    this.operation = '+';
  }

  // ✅ Select Amount
  selectAmount(amount: number) {
    this.selectedAmount = amount;
  }

  // ✅ Toggle + or -
  toggleOperation(op: '+' | '-') {
    this.operation = op;
  }

  // ✅ Proceed (simulated transaction)
  proceed() {
    if (this.selectedAmount === 0) return;

    const newTx: Transaction = {
      ref: 'TXN' + (this.transactions.length + 1).toString().padStart(3, '0'),
      userId: 'FA049950',
      amount:
        this.operation === '+' ? this.selectedAmount : -this.selectedAmount,
      date: new Date().toISOString(),
      author: 'User1',
      remarks: this.operation === '+' ? 'Reload' : 'Deduction',
      currency: 'PHP',
    };

    // Add to transaction history
    this.transactions.unshift(newTx);

    this.closeReloadModal();
  }
}
