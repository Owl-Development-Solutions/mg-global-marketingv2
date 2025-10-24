import { inject, Injectable } from '@angular/core';
import { GeonologyRepositoryInterface } from '../../../domain';
import {
  AddUserGeonologyData,
  GeonologyNode,
  GeonologyResponse,
} from '../../models';
import { Observable } from 'rxjs';
import { GeonologyDatasource } from '../../datasources';

@Injectable({
  providedIn: 'root',
})
export class GeonologyRepository implements GeonologyRepositoryInterface {
  private geonologyDatasource = inject(GeonologyDatasource);

  addUserGeonology(data: AddUserGeonologyData): Observable<GeonologyResponse> {
    return this.geonologyDatasource.addUserGeonology(data);
  }

  getGeanology(userId: string): Observable<GeonologyNode> {
    return this.geonologyDatasource.getGeanology(userId);
  }
}
