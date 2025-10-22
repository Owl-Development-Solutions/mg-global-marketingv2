import { Injectable } from '@angular/core';
import {
  AddUserGeonologyData,
  GeonologyInterface,
  GeonologyNode,
} from '../../models';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeonologyDatasource implements GeonologyInterface {
  addUserGeonology(data: AddUserGeonologyData): Observable<any> {
    return of(data).pipe(delay(1000));
  }
}
