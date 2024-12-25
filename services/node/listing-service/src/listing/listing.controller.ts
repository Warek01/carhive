import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('listing')
@ApiTags('Listing')
export class ListingController {
   constructor() {}

   @Get('test')
   test() {
      return 'test';
   }
}
