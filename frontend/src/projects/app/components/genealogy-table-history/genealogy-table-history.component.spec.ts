import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenealogyTableHistoryComponent } from './genealogy-table-history.component';

describe('GenealogyTableHistoryComponent', () => {
  let component: GenealogyTableHistoryComponent;
  let fixture: ComponentFixture<GenealogyTableHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenealogyTableHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenealogyTableHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
