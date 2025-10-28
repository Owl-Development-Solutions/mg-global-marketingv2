import {
  AddUserGeonologyData,
  GeonologyNode,
  GeonologyResponse,
} from '../../data/models';
import { Observable } from 'rxjs';

export interface GeonologyRepositoryInterface {
  addUserGeonology(data: AddUserGeonologyData): Observable<GeonologyResponse>;
  getGeanology(userId: string): Observable<GeonologyNode>;
}
