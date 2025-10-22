import { Observable } from 'rxjs';
import { AddUserGeonologyData } from './geonology.model';

export interface GeonologyInterface {
  addUserGeonology(data: AddUserGeonologyData): Observable<any>;
}
