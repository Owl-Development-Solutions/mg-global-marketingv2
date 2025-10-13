import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeonologyComponent } from './geonology.component';

describe('GeonologyComponent', () => {
  let component: GeonologyComponent;
  let fixture: ComponentFixture<GeonologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeonologyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeonologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
