import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const RawHeaders = createParamDecorator(
  (data, ext: ExecutionContext) => {
    const req = ext.switchToHttp().getRequest()
    const headers = req.headers
    return headers;
  }
)
