import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HerbdetailComponent } from './herbdetail.component';

describe('HerbdetailComponent', () => {
  let component: HerbdetailComponent;
  let fixture: ComponentFixture<HerbdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HerbdetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HerbdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
