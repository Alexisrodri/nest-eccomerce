import { SetMetadata } from '@nestjs/common';
import { roles } from 'src/auth/interfaces';

export const META_ROLES = ['roles']

export const RoleProtected = (...args: roles[]) => {
  return SetMetadata(META_ROLES, args);
}
