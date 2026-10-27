import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity.js';
import { Post } from '../../post/entities/post.entity.js';

type Relation<T> = T;

@ObjectType()
export class Like {
  @Field(() => Int)
  id: number;

  @Field(() => User)
  user: Relation<User>;

  @Field(() => Post)
  post: Relation<Post>;

  @Field()
  createdAt: Date;
}
