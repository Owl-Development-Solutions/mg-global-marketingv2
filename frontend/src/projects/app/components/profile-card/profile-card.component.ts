import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-profile-card',
    imports: [MatIcon],
    templateUrl: './profile-card.component.html',
    styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
  name = 'NENA SARAMOSING';
  reminderLink = 'https://shop.empoweredconsumerism.com/?epid=FA049950';
  reminderText =
    'PMA Reminder for FA049950: Qualified for next month’s benefits...';

  id = 'FA049960';
  email = 'nenasaramosing@yahoo.com';

  balances = [
    { amount: '339.18P PHP', label: 'PHP Balance' },
    { amount: '145.00 PHP', label: 'EC Wallet' },
    { amount: '0', label: 'Travel GC' },
  ];

  imgUrl = 'person-img.jpg';
}
