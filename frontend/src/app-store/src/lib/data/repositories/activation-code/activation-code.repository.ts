import { inject, Injectable } from '@angular/core';
import { ActivationCodeRepositoryInterface } from '../../../domain/index';
import { Observable } from 'rxjs';
import { ActivationCodeDatasource } from '../../datasources';

@Injectable({
  providedIn: 'root',
})
export class ActivationCodeRepository
  implements ActivationCodeRepositoryInterface
{
  private activationDatasource = inject(ActivationCodeDatasource);

  searchActivationCode(activationCode: string): Observable<string> {
    return this.activationDatasource.searchActivationCode(activationCode);
  }
}
