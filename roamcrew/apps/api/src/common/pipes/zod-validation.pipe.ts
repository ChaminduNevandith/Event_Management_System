import { PipeTransform, ArgumentMetadata, BadRequestException, Injectable } from '@nestjs/common';
import { ZodError } from 'zod';
import type { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<any>) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }
    
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error: any) {
      if (error instanceof ZodError) {
        const zodError = error as any;
        throw new BadRequestException({
          message: 'Validation failed',
          errors: zodError.errors.map((err: any) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
