import { Observable } from 'rxjs';

export interface ActivationCodeInterface {
  searchActivationCode(activationCode: string): Observable<string>;
}
