import { inject, Injectable } from '@angular/core';
import { ActivationCodeRepository } from '../../data/repositories';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivationCodeUsecase {
  private activationCodeRepo = inject(ActivationCodeRepository);

  searchActivationCode(activationCode: string): Observable<string> {
    return this.activationCodeRepo.searchActivationCode(activationCode);
  }
}
