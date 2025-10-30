import { Component, input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-profile-tabs',
  imports: [MatTabsModule],
  templateUrl: './profile-tabs.component.html',
  styleUrl: './profile-tabs.component.scss',
})
export class ProfileTabsComponent {
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

  reminderText =
    ' PMA Reminder for FA049950: Qualified for next months (October 2025) Marketing Plan benefits. Get bigger income! Enjoy 20% MORE commissional points in your unilevel and stairstep, when you acquire 0.3334 more points!';

  reminderLink = ' https://shop.empoweredconsumerism.com/?ecpid=FA049950';
}
