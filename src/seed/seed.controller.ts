import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiTags } from '@nestjs/swagger';
// import { Auth } from 'src/auth/decorator';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) { }

  @Get()
  // @Auth('admin', 'super-user')
  executeSeed() {
    return this.seedService.runSeed();
  }

}
