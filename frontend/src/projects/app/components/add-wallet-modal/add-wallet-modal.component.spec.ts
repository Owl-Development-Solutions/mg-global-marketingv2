import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWalletModalComponent } from './add-wallet-modal.component';

describe('AddWalletModalComponent', () => {
  let component: AddWalletModalComponent;
  let fixture: ComponentFixture<AddWalletModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWalletModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWalletModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
