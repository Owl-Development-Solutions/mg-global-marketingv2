import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonUserNodeComponent } from './skeleton-user-node.component';

describe('SkeletonUserNodeComponent', () => {
  let component: SkeletonUserNodeComponent;
  let fixture: ComponentFixture<SkeletonUserNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonUserNodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonUserNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
