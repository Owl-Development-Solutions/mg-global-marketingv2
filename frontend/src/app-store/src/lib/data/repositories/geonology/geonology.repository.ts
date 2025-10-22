import { inject, Injectable } from '@angular/core';
import { GeonologyRepositoryInterface } from '../../../domain';
import { AddUserGeonologyData } from '@app-store/public-api';
import { Observable } from 'rxjs';
import { GeonologyDatasource } from '../../datasources';

@Injectable({
  providedIn: 'root',
})
export class GeonologyRepository implements GeonologyRepositoryInterface {
  private geonologyDatasource = inject(GeonologyDatasource);

  addUserGeonology(data: AddUserGeonologyData): Observable<any> {
    return this.geonologyDatasource.addUserGeonology(data);
  }
}
