import { ProfileState } from '@alfresco/adf-extensions';

export interface AppProfileState extends ProfileState {
  isGuest: boolean;
}
