# Profile Update Service

This service provides real-time profile update notifications across the application.

## Usage

### In components that need to listen for profile updates:

```typescript
import { ProfileUpdateService } from '../../services/profile-update.service';

export class MyComponent implements OnInit, OnDestroy {
  private profileUpdateSubscription: Subscription;

  constructor(private profileUpdateService: ProfileUpdateService) {}

  ngOnInit() {
    // Listen for profile updates
    this.profileUpdateSubscription = this.profileUpdateService.profileUpdate$.subscribe(
      (updatedProfile) => {
        // Handle the update - refresh data, update UI, etc.
        console.log('Profile updated:', updatedProfile);
        this.refreshUserData();
      }
    );
  }

  ngOnDestroy() {
    // Clean up subscription
    if (this.profileUpdateSubscription) {
      this.profileUpdateSubscription.unsubscribe();
    }
  }
}
```

### How it works:

1. When user saves profile changes in MyAccountModalComponent
2. The component calls `profileUpdateService.notifyProfileUpdate(updatedProfile)`
3. All subscribed components receive the update immediately
4. Components can refresh their data or update UI without page reload

## Benefits:

- **Real-time updates**: No page refresh required
- **Decoupled**: Components don't need to know about each other
- **Efficient**: Only components that need updates receive notifications
- **Type-safe**: Strongly typed update data

## Integration Points:

- **MyAccountModalComponent**: Sends updates when profile is saved
- **DashboardComponent**: Can listen to update user display info
- **ShellComponent**: Can update header user info
- **Any component**: Can subscribe to profile changes
