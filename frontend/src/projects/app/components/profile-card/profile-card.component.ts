import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { BalanceCardComponent } from '../balance-card/balance-card.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-profile-card',
  imports: [MatIcon, BalanceCardComponent, JsonPipe],
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
        image: string;
      }
    | undefined
    | null
  >();

      balances = input.required<any>()
}
