import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { BalanceCardComponent } from '../balance-card/balance-card.component';

@Component({
  selector: 'app-profile-card',
  imports: [MatIcon, BalanceCardComponent],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
})
export class ProfileCardComponent {
  userInfo = input.required<
    | {
        firstName: string;
        lastName: string;
        username: string;
        email: string;
      }
    | undefined
    | null
  >();

  reminderLink = 'https://shop.empoweredconsumerism.com/?epid=FA049950';
  reminderText =
    'PMA Reminder for FA049950: Qualified for next month’s benefits...';

  balances = [
    { amount: 'PHP', label: 'Balance' },
    { amount: 'PHP', label: 'EC Wallet' },
    { amount: 'PHP', label: 'Travel GC' },
  ];

  imgUrl = 'person-img.jpg';
}
