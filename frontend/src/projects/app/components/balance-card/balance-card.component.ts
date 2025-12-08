import { Component, input } from '@angular/core';
import { MatCard, MatCardContent, MatCardFooter } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-balance-card',
  imports: [MatCard, MatCardContent, MatDivider, MatCardFooter],
  templateUrl: './balance-card.component.html',
  styleUrl: './balance-card.component.scss',
})
export class BalanceCardComponent {
  amount = input.required<string>();
  label = input.required<string>();
}
