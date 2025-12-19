import { Component, input } from '@angular/core';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatCellDef,
  MatHeaderRowDef,
  MatCell,
  MatRow,
  MatRowDef,
  MatNoDataRow,
  MatHeaderRow,
} from '@angular/material/table';
import { SkeletonTextComponent } from '../skeleton-text/skeleton-text.component';
import { EmptyHistoryMessageComponent } from '../empty-history-message/empty-history-message.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-wallet-table-history',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    SkeletonTextComponent,
    MatCell,
    MatCellDef,
    MatRow,
    MatRowDef,
    MatNoDataRow,
    MatHeaderRow,
    MatHeaderRowDef,
    CommonModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule,
    EmptyHistoryMessageComponent,
  ],
  templateUrl: './wallet-table-history.component.html',
  styleUrl: './wallet-table-history.component.scss',
})
export class WalletTableHistoryComponent {
  dataSource = input<any[]>([]);

  skeleton = input<boolean | null>(true);

  displayedColumns = [
    'referenceNumber',
    'amount',
    'date',
    'author',
    'remarks',
    'status',
  ];

  trackById = (index: any, item: any) => {
    return item.id || index;
  };
}
