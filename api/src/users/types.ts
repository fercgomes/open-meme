import { User } from './users.entity';

/** Defines which fields of User entity are in the public profile type */
export type PublicProfile = Pick<User, 'id' | 'username'>;

/** Defines which fields of User entity are in the private profile type */
export type PrivateProfile = PublicProfile & Pick<User, 'email'>;
