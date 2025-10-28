interface DomainErrorInterface {
  message: string;
}
export declare abstract class DomainError implements DomainErrorInterface {
  readonly message: string;
  protected constructor(message: string);
}
export {};
