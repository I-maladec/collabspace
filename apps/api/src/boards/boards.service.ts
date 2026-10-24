import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class BoardsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.board.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(title: string, userId: string) {
    return this.prisma.board.create({
      data: {
        title,
        ownerId: userId,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const board = await this.prisma.board.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });

    if (!board) {
      throw new NotFoundException('Доска не найдена');
    }

    return board;
  }
}