import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletTableHistoryComponent } from './wallet-table-history.component';

describe('WalletTableHistoryComponent', () => {
  let component: WalletTableHistoryComponent;
  let fixture: ComponentFixture<WalletTableHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletTableHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletTableHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
