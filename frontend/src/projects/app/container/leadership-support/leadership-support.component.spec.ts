import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeadershipSupportComponent } from './leadership-support.component';

describe('LeadershipSupportComponent', () => {
  let component: LeadershipSupportComponent;
  let fixture: ComponentFixture<LeadershipSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeadershipSupportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeadershipSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
