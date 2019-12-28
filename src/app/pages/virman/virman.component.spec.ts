import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirmanComponent } from './virman.component';

describe('VirmanComponent', () => {
  let component: VirmanComponent;
  let fixture: ComponentFixture<VirmanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirmanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
