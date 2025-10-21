import { UserResponseModel } from '@app-store/lib/data/models/user.attributes.model';
import { Observable } from 'rxjs';

export interface UserRepositoryInterface {
  getUser(token?: string): Observable<UserResponseModel>;
}
