import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcuWalletComponent } from './ecu-wallet.component';

describe('EcuWalletComponent', () => {
  let component: EcuWalletComponent;
  let fixture: ComponentFixture<EcuWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcuWalletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcuWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
