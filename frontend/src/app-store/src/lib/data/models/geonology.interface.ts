import { Observable } from 'rxjs';
import {
  AddUserGeonologyData,
  GeonologyNode,
  GeonologyResponse,
} from './geonology.model';

export interface GeonologyInterface {
  addUserGeonology(data: AddUserGeonologyData): Observable<GeonologyResponse>;
  getGeanology(userId: string): Observable<GeonologyNode>;
}
