import { AddUserGeonologyData } from '@app-store/public-api';
import { Observable } from 'rxjs';

export interface GeonologyRepositoryInterface {
  addUserGeonology(data: AddUserGeonologyData): Observable<any>;
}
