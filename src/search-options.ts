import { ApiProperty } from '@nestjs/swagger';

export class SearchOptions {
  @ApiProperty({
    default: null,
    description: 'highest | lowest | raing | latest',
  })
  filter: string;
  @ApiProperty()
  take?: number;
}
