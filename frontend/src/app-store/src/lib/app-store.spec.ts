import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppStore } from './app-store';

describe('AppStore', () => {
  let component: AppStore;
  let fixture: ComponentFixture<AppStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppStore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
