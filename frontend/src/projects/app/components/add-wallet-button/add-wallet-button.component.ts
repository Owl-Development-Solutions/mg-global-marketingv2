import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-add-wallet-button',
  imports: [MatButton, MatIcon],
  template: `
    <button mat-flat-button color="primary" class="add-wallet-button">
      <mat-icon>add_card</mat-icon>
      Add Wallet
    </button>
  `,
  styles: [
    `
      .add-wallet-button {
        text-wrap: nowrap;
      }
    `,
  ],
})
export class AddWalletButtonComponent {}
