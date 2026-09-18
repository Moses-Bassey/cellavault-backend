export class TutorCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly loginUrl: string,
    public readonly temporaryPassword: string,
  ) {}
}
