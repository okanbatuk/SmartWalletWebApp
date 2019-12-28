import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityGuideComponent } from './city-guide.component';

describe('CityGuideComponent', () => {
  let component: CityGuideComponent;
  let fixture: ComponentFixture<CityGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CityGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
