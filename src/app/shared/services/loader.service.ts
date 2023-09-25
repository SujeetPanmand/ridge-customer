import { Injectable, SkipSelf, Optional } from '@angular/core';
import { Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
interface LoadingStatus {
  active: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loadingSubject = new Subject<LoadingStatus>();
  loadingState = this.loadingSubject.asObservable().pipe(delay(10));

  display = true;
  constructor(@Optional() @SkipSelf() prior: LoaderService) {
    if (prior) {
      return prior;
    }
  }

  setLoaderDisplay(value: boolean) {
    this.display = value;
  }

  show() {
    this.display
      ? this.loadingSubject.next(<LoadingStatus>{ active: true })
      : this.loadingSubject.next(<LoadingStatus>{ active: false });
  }

  hide() {
    this.loadingSubject.next(<LoadingStatus>{ active: false });
  }
}
