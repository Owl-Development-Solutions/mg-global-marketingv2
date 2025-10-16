import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageTitlePortalService } from '../../services';

@Component({
  selector: 'app-leadership-support',
  standalone: true,
  imports: [PortalModule, CommonModule],
  templateUrl: './leadership-support.component.html',
  styleUrls: ['./leadership-support.component.scss'],
})
export class LeadershipSupportComponent implements OnInit, OnDestroy {
  activeTab: 'wallet' | 'history' = 'wallet';
  hovered = false;
  private pageTitlePortal = inject(PageTitlePortalService);

  @ViewChild(CdkPortal) pageTitle!: CdkPortal;

  // Simple mock transactions for display. Replace with real data from a service.
  transactions: Array<{ date: string; description: string; amount: number; balance: number }> = [
    { date: '2025-10-01', description: 'Referral bonus', amount: 50, balance: 1050 },
    { date: '2025-09-28', description: 'Withdrawal', amount: -20, balance: 1000 },
    { date: '2025-09-15', description: 'Commission', amount: 100, balance: 1020 },
  ];

  // Base balance if you need to compute dynamically; using last known balance in transactions as current balance
  get currentBalance(): number {
    if (this.transactions.length === 0) return 0;
    // Transactions are assumed to be ordered newest-first
    return this.transactions[0].balance;
  }

  get recentTransactions() {
    return this.transactions.slice(0, 3);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.pageTitlePortal.setPortal(this.pageTitle);
    });
  }

  ngOnDestroy(): void {
    if (this.pageTitle?.isAttached) {
      this.pageTitle.detach();
    }
  }
}