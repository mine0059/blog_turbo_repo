import { Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input.js';
import { UpdatePostInput } from './dto/update-post.input.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PostService {

  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.post.findMany();
  }

}
