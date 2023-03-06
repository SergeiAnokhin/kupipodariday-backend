import { Users } from '../users/entities/user.entity';

export interface RequestWithUser extends Request {
  user: 'Вася';
}
