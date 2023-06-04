import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/** 추후 작성 예정 */
export const GetQuery = createParamDecorator((data, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest();
});
