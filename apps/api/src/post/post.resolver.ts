import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { Post } from './entities/post.entity.js';
import { PostService } from './post.service.js';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Post], { name: 'post' })
  findAll(@CurrentUser() user: { id: number }) {
    console.log('Authenticated User ID:', user.id);
    console.log(`User: ${user}`);
    return this.postService.findAll();
  }
}
