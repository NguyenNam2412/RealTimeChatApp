import { plainToInstance } from 'class-transformer';
import { IsInt, IsString, validateSync } from 'class-validator';

// Define a class to validate the environment variables
class EnvironmentVariables {
  @IsInt()
  PORT!: number;

  @IsString()
  DB_HOST!: string;

  @IsInt()
  DB_PORT!: number;

  @IsString()
  DB_USER!: string;

  @IsString()
  DB_PASS!: string;

  @IsString()
  DB_NAME!: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
