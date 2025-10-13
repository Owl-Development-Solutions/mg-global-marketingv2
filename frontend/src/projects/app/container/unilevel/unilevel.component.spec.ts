import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnilevelComponent } from './unilevel.component';

describe('UnilevelComponent', () => {
  let component: UnilevelComponent;
  let fixture: ComponentFixture<UnilevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnilevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnilevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
