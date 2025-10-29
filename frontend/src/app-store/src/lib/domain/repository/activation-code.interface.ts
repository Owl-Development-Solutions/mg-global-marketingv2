import { Observable } from 'rxjs';

export interface ActivationCodeRepositoryInterface {
  searchActivationCode(activationCode: string): Observable<string>;
}
