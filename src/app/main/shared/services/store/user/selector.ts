import { createSelector } from '@ngrx/store';
import { IAppState } from '../store.dto';

const PathfinderUserRolesMasterList = ['None', 'Operator', 'Administrator'];

export const selectUserSession = (state: IAppState) => state.data.UserSession;

export const RolesMasterList = [
  'administrator',
  'scheduler',
  'job-editor',
  'job-editor-quantity',
  'pfpc',
  'tooling-editor',
  'pattern-editor',
  'machine-manager',
];
export const selectUsers = (state: IAppState) => state.data.collections.Users;
export const selectFolders = (state: IAppState) => state.data.collections.Folders;
const selectSystemPreferences = (state: IAppState) => state.data.collections.SystemPreferences;

export const UserHasRole = (role: string) =>
  createSelector(selectUserSession, (session) =>
    session ? session.roles.some((r) => r.toLowerCase() === role.toLowerCase()) : false
  );

export const UserHasRoles = (roles: string[], allRoles: boolean) =>
  createSelector(selectUserSession, (session) => {
    if (!session) return false;

    const matchedRoles = session.roles.filter((r) =>
      roles.some((x) => x.toLowerCase() === r.toLowerCase())
    );

    return allRoles ? matchedRoles.length === roles.length : matchedRoles.length > 0;
  });

export const UserHasClaim = (claim: string) =>
  createSelector(selectUserSession, (session) =>
    session ? session.claims.some((c) => c.toLowerCase() === claim.toLowerCase()) : false
  );

export const selectUserIsAdmin = createSelector(
  (state: IAppState) => state,
  (state) => UserHasRole('administrator')(state)
);

export const selectUserListModel = createSelector(
  selectUsers,
  selectFolders,
  selectSystemPreferences,
  selectUserIsAdmin,
  (users, folders, systemPreferences, userIsAdmin) => ({
    users: users.map((u) => ({
      ...u,
      rolesModel: RolesMasterList.map((rm) => ({
        roleName: rm,
        enabled: u.roles.includes(rm), // More readable than `indexOf(rm) > -1`
      })),
      folderRolesModel: folders.reduce((pfroles, pf) => {
        pfroles[pf.id] = u.folderRoles.find((x) => x.folderId === pf.id)?.role || 'None';
        return pfroles;
      }, {} as Record<string, string>),
    })),
    systemPreferences,
    userIsAdmin,
    PathfinderUserRolesMasterList,
    pathfinders: folders,
  })
);
