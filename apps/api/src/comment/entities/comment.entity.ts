import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Post } from '../../post/entities/post.entity.js';
import { User } from '../../user/entities/user.entity.js';

type Relation<T> = T;

@ObjectType()
export class CommentEntity {
  @Field(() => Int)
  id: number;

  @Field()
  content: string;

  @Field(() => User)
  author: Relation<User>;

  @Field(() => Int)
  authorId: number;

  @Field(() => Int)
  postId: number;

  @Field(() => Post)
  post: Relation<Post>;

  @Field()
  createdAt: Date;
}
