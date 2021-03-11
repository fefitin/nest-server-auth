import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Request,
  Body,
  Param,
  ParseIntPipe,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { UserDto, UpdateUserDto } from './user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('/')
  findAll(@Request() req) {
    return this.usersService.findAll();
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/')
  create(@Request() req, @Body() user: UserDto) {
    return this.usersService.create(user);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/:id')
  async findById(@Request() req, @Param('id', ParseIntPipe) id) {
    const user = await this.usersService.findById(id);
    if (user) {
      return user;
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('/:id')
  async update(
    @Request() req,
    @Param('id', ParseIntPipe) id,
    @Body() user: UpdateUserDto,
  ) {
    const updated = await this.usersService.update(id, user);
    if (updated) {
      return updated;
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/:id')
  async delete(@Request() req, @Param('id', ParseIntPipe) id) {
    const deleted = await this.usersService.delete(id);
    if (!deleted) {
      throw new NotFoundException();
    }
  }
}
