import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { PostsModule } from './posts/posts.module';
import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware';
import { TagsModule } from './tags/tags.module';
import { CategoriesModule } from './categories/categories.module';
import { TagFoldersModule } from './tag_folders/tag_folders.module';
import { UsersModule } from './users/users.module';

import { TagsModule } from './tags/tags.module';
import { CategoriesModule } from './categories/categories.module';
import { TagFoldersModule } from './tag_folders/tag_folders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot(typeORMConfig),
    PostsModule,
    TagsModule,
    CategoriesModule,
    TagFoldersModule,
    UsersModule,
    TagsModule,
    CategoriesModule,
    TagFoldersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
