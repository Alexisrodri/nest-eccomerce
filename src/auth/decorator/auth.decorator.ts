import { applyDecorators, UseGuards } from "@nestjs/common";
import { RoleProtected } from "./role-protected/role-protected.decorator";
import { AuthGuard } from "@nestjs/passport";
import { UseroleGuard } from "../guards/userole/userole.guard";
import type { ValidRoles } from "../interfaces";

export function Auth(...rols: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...rols),
    UseGuards(AuthGuard(), UseroleGuard),
  )
}