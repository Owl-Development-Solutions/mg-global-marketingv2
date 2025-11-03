import { Component, input } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { SkeletonTextComponent } from '../skeleton-text/skeleton-text.component';
import {
  CommonModule,
  DatePipe,
  NgClass,
  TitleCasePipe,
} from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { GeonologyNode } from '@app-store/public-api';
import { EmptyHistoryMessageComponent } from '../empty-history-message/empty-history-message.component';

@Component({
  selector: 'app-genealogy-table-history',
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
  templateUrl: './genealogy-table-history.component.html',
  styleUrl: './genealogy-table-history.component.scss',
})
export class GenealogyTableHistoryComponent {
  dataSource = input<GeonologyNode[]>([]);

  skeleton = input<boolean | null>(true);

  displayedColumns = ['id', 'name', 'left', 'right', 'sponsor'];

  trackById = (index: any, item: any) => {
    return item.id || index;
  };
}
