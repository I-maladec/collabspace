import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { NotesService } from './notes.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../auth/auth-request.js';

type NoteInput = {
  text?: string;
  color?: string;
  x?: number;
  y?: number;
};

@Controller()
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get('boards/:boardId/notes')
  findAll(
    @Param('boardId') boardId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.notesService.findAll(boardId, request.user.id);
  }

  @Post('boards/:boardId/notes')
  create(
    @Param('boardId') boardId: string,
    @Body() body: NoteInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.notesService.create(boardId, request.user.id, body);
  }

  @Patch('notes/:id')
  update(
    @Param('id') id: string,
    @Body() body: NoteInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.notesService.update(id, request.user.id, body);
  }

  @Delete('notes/:id')
  remove(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.notesService.remove(id, request.user.id);
  }
}