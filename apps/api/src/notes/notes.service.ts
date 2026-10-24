import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

type NoteInput = {
  text?: string;
  color?: string;
  x?: number;
  y?: number;
};

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureBoardAccess(boardId: string, userId: string) {
    const board = await this.prisma.board.findFirst({
      where: {
        id: boardId,
        ownerId: userId,
      },
      select: { id: true },
    });

    if (!board) {
      throw new NotFoundException('Доска не найдена');
    }
  }

  private async ensureNoteAccess(noteId: string, userId: string) {
    const note = await this.prisma.stickyNote.findFirst({
      where: {
        id: noteId,
        board: {
          ownerId: userId,
        },
      },
      select: { id: true },
    });

    if (!note) {
      throw new NotFoundException('Заметка не найдена');
    }
  }

  async findAll(boardId: string, userId: string) {
    await this.ensureBoardAccess(boardId, userId);

    return this.prisma.stickyNote.findMany({
      where: { boardId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(boardId: string, userId: string, data: NoteInput) {
    await this.ensureBoardAccess(boardId, userId);

    return this.prisma.stickyNote.create({
      data: {
        boardId,
        text: data.text ?? '',
        color: data.color ?? '#fef08a',
        x: data.x ?? 40,
        y: data.y ?? 40,
      },
    });
  }

  async update(id: string, userId: string, data: NoteInput) {
    await this.ensureNoteAccess(id, userId);

    return this.prisma.stickyNote.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    await this.ensureNoteAccess(id, userId);

    await this.prisma.stickyNote.delete({
      where: { id },
    });

    return { success: true };
  }
}