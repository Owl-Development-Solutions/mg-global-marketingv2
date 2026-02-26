import { Component, Inject, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import {
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AuthUsecase } from '@app-store/lib/usecases';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG, getUpdateUserEndpoint } from '../../config/api.config';
import { GetTokenUsecase } from '@app-store/lib/usecases';
import { Store } from '@ngrx/store';

export interface MyAccountModalData {
  userId?: string;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  role?: string;
}

@Component({
  selector: 'app-my-account-modal',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './my-account-modal.component.html',
  styleUrl: './my-account-modal.component.scss',
})
export class MyAccountModalComponent implements OnInit {
  isEditMode = false;
  isSaving = false;
  editableProfile: UserProfile = {};
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  
  @ViewChild('imageUpload') imageUploadInput!: ElementRef<HTMLInputElement>;

  // Web-friendly keyboard shortcuts
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Ctrl/Cmd + S to save
    if ((event.ctrlKey || event.metaKey) && event.key === 's' && this.isEditMode) {
      event.preventDefault();
      this.saveChanges();
    }
    
    // Escape to cancel edit mode
    if (event.key === 'Escape' && this.isEditMode) {
      this.cancelEdit();
    }
    
    // Ctrl/Cmd + E to enter edit mode
    if ((event.ctrlKey || event.metaKey) && event.key === 'e' && !this.isEditMode) {
      event.preventDefault();
      this.enableEditMode();
    }
  }

  constructor(
    public dialogRef: MatDialogRef<MyAccountModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MyAccountModalData,
    private authUsecase: AuthUsecase,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private getTokenUsecase: GetTokenUsecase,
    private store: Store,
  ) {}

  userProfile$!: Observable<UserProfile>;

  ngOnInit() {
    this.userProfile$ = this.authUsecase.getUserInfo$.pipe(
      map(userInfo => {
        if (!userInfo) return this.getDefaultProfile();
        
        const profile = {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email,
          username: userInfo.username,
          role: 'Member'
        };
        
        // Initialize editable profile with current values
        this.editableProfile = { ...profile };
        
        return profile;
      }),
      startWith(this.getDefaultProfile())
    );
  }

  private getDefaultProfile(): UserProfile {
    return {
      firstName: 'User',
      lastName: 'Name',
      email: 'user@example.com',
      username: 'username',
      role: 'Member'
    };
  }

  get userId(): string {
    return this.data?.userId || 'N/A';
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  enableEditMode(): void {
    this.isEditMode = true;
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.selectedImage = null;
    this.imagePreview = null;
    // Reset editable profile to current values
    this.userProfile$.subscribe(profile => {
      this.editableProfile = { ...profile };
    });
  }

  triggerImageUpload(): void {
    this.imageUploadInput.nativeElement.click();
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveChanges(): void {
    if (this.isSaving) return;
    
    // Web-friendly validation feedback
    if (!this.editableProfile.firstName?.trim()) {
      this.snackBar.open('First name is required', 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar'
      });
      return;
    }
    
    if (!this.editableProfile.lastName?.trim()) {
      this.snackBar.open('Last name is required', 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar'
      });
      return;
    }
    
    if (!this.editableProfile.email?.trim()) {
      this.snackBar.open('Email is required', 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar'
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.editableProfile.email)) {
      this.snackBar.open('Please enter a valid email address', 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar'
      });
      return;
    }
    
    this.isSaving = true;
    
    // Create FormData for file upload and profile data
    const formData = new FormData();
    
    // Add profile fields
    if (this.editableProfile.firstName) {
      formData.append('firstName', this.editableProfile.firstName);
    }
    if (this.editableProfile.lastName) {
      formData.append('lastName', this.editableProfile.lastName);
    }
    if (this.editableProfile.email) {
      formData.append('email', this.editableProfile.email);
    }
    if (this.editableProfile.username) {
      formData.append('username', this.editableProfile.username);
    }
    
    // Add image if selected
    if (this.selectedImage) {
      formData.append('profileImage', this.selectedImage, this.selectedImage.name);
    }
    
    // API call to update profile
    const apiEndpoint = getUpdateUserEndpoint(this.userId);
    
    console.log('Updating profile with endpoint:', apiEndpoint);
    console.log('User ID:', this.userId);
    console.log('Current hostname:', window.location.hostname);
    console.log('Current port:', window.location.port);
    
    // Debug: Check authentication state
    this.getTokenUsecase.execute().subscribe((token: string | undefined) => {
      console.log('=== FRONTEND TOKEN DEBUG ===');
      console.log('Token from store:', token ? 'exists' : 'missing');
      if (token) {
        console.log('Token length:', token.length);
        console.log('Token preview:', token.substring(0, 50) + '...');
        console.log('Token starts with Bearer?', token.startsWith('Bearer'));
      } else {
        console.log('No token found in store - this will cause 401/403 errors');
      }
    });
    
    // Debug: Check if we're on the right port
    if (window.location.port === '4201') {
      console.log('Running on port 4201 - proxy should be active');
    }
    
    this.http.put(apiEndpoint, formData, { withCredentials: true }).subscribe({
      next: (response: any) => {
        console.log('Profile update successful:', response);
        this.isSaving = false;
        
        // Show success message
        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
        
        // Update local state to trigger real-time UI updates
        this.updateLocalState(response);
        
        // Exit edit mode
        this.isEditMode = false;
        this.selectedImage = null;
        this.imagePreview = null;
        
        // Close dialog with updated data
        this.dialogRef.close({ success: true, data: response });
      },
      error: (error) => {
        this.isSaving = false;
        
        console.error('Profile update failed with status:', error.status);
        console.error('Error details:', error);
        console.error('Error URL:', apiEndpoint);
        
        // Show error message
        let errorMessage = 'Failed to update profile. Please try again.';
        
        if (error.status === 404) {
          errorMessage = 'Update endpoint not found. Please check API configuration.';
        } else if (error.status === 401) {
          errorMessage = 'You are not authorized to update this profile.';
        } else if (error.status === 403) {
          errorMessage = 'You do not have permission to update this profile.';
        } else if (error.status === 422) {
          errorMessage = error.error?.message || 'Invalid data provided.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }
  
  private updateLocalState(updatedProfile: any): void {
    // Update the auth store to trigger real-time updates across the app
    this.authUsecase.updateUserProfile({
      firstName: updatedProfile.firstName,
      lastName: updatedProfile.lastName,
      email: updatedProfile.email,
      username: updatedProfile.username,
    });
    
    // Also update the local observable for immediate UI updates
    this.userProfile$ = this.authUsecase.getUserInfo$.pipe(
      map(userInfo => {
        if (!userInfo) return this.getDefaultProfile();
        
        const profile = {
          firstName: updatedProfile.firstName || userInfo.firstName,
          lastName: updatedProfile.lastName || userInfo.lastName,
          email: updatedProfile.email || userInfo.email,
          username: updatedProfile.username || userInfo.username,
          role: 'Member'
        };
        
        // Update editable profile with new values
        this.editableProfile = { ...profile };
        
        return profile;
      }),
      startWith(this.getDefaultProfile())
    );
  }
}
