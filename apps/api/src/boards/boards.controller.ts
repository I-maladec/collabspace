import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { BoardsService } from './boards.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../auth/auth-request.js';

@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.boardsService.findAll(request.user.id);
  }

  @Post()
  create(
    @Body() body: { title: string },
    @Req() request: AuthenticatedRequest,
  ) {
    return this.boardsService.create(body.title, request.user.id);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.boardsService.findOne(id, request.user.id);
  }
}