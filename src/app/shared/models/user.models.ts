/** Shape of the add/edit user form — kept separate from `User` since it has no `id`. */
export interface UserFormValue {
  username: string;
  name: string;
  email: string;
  role: string;
}

/** Roles selectable in the user form. */
export const USER_ROLES: string[] = ['ADMIN', 'EDITOR', 'USER'];
