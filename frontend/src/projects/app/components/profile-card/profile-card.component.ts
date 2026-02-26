import { Component, input, OnInit, OnDestroy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { BalanceCardComponent } from '../balance-card/balance-card.component';
import { ProfileUpdateService } from '../../services/profile-update.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-card',
  imports: [MatIcon, BalanceCardComponent],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
})
export class ProfileCardComponent implements OnInit, OnDestroy {
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
    'PMA Reminder for FA049950: Qualified for next month\'s benefits...';

  balances = [
    { amount: 'PHP', label: 'TOTAL BALANCE' },
    { amount: 'PHP', label: 'TOTAL EARNINGS' },
  ];

  imgUrl = 'person-img.jpg';
  
  private profileUpdateSubscription!: Subscription;

  constructor(private profileUpdateService: ProfileUpdateService) {}

  ngOnInit() {
    // Listen for profile updates
    this.profileUpdateSubscription = this.profileUpdateService.profileUpdate$.subscribe(
      (updatedProfile: any) => {
        console.log('Profile card received update:', updatedProfile);
        
        // Update profile image if available
        if (updatedProfile.profileImage) {
          // Handle profile image update - you might need to adjust the path
          this.imgUrl = updatedProfile.profileImage.startsWith('http') 
            ? updatedProfile.profileImage 
            : `uploads/${updatedProfile.profileImage}`;
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.profileUpdateSubscription) {
      this.profileUpdateSubscription.unsubscribe();
    }
  }
}
