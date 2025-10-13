import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeonologyTreeComponent } from './geonology-tree.component';

describe('GeonologyTreeComponent', () => {
  let component: GeonologyTreeComponent;
  let fixture: ComponentFixture<GeonologyTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeonologyTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeonologyTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
