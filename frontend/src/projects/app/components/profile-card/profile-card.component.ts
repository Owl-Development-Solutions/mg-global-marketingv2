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
  userInfo: any = input.required<
    | {
        firstName: string;
        lastName: string;
        userName: string;
        email: string;
      }
    | undefined
    | null
  >();

  reminderLink = 'https://shop.empoweredconsumerism.com/?epid=FA049950';
  reminderText =
    "PMA Reminder for FA049950: Qualified for next month's benefits...";

  balances = [
    { amount: 'PHP', label: 'TOTAL BALANCE' },
    { amount: 'PHP', label: 'TOTAL EARNINGS' },
  ];

  imgUrl = 'person-img.jpg';
}
