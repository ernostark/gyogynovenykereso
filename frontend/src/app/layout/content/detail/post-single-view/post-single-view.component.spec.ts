import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostSingleViewComponent } from './post-single-view.component';

describe('PostSingleViewComponent', () => {
  let component: PostSingleViewComponent;
  let fixture: ComponentFixture<PostSingleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostSingleViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostSingleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
