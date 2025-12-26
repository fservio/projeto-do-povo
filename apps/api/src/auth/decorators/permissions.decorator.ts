import { SetMetadata } from '@nestjs/common';

export interface Permission {
  resource: string;
  action: string;
}

export const Permissions = (...permissions: Permission[]) => SetMetadata('permissions', permissions);
