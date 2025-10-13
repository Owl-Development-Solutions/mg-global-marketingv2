import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSysSidenavComponent } from './app-sys-sidenav.component';

describe('AppSysSidenavComponent', () => {
  let component: AppSysSidenavComponent;
  let fixture: ComponentFixture<AppSysSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSysSidenavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppSysSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
