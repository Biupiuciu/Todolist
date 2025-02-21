export class TokenGenerationError extends Error {
  constructor(message = "Failed to generate access token") {
    super(message);
    this.name = "TokenGenerationError";
  }
}
