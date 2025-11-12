import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountInfoRegisterComponent } from './account-info-register.component';

describe('AccountInfoRegisterComponent', () => {
  let component: AccountInfoRegisterComponent;
  let fixture: ComponentFixture<AccountInfoRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountInfoRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountInfoRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
