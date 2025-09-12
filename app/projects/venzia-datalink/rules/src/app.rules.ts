import { RuleContext } from '@alfresco/adf-extensions';
import { getFileExtension, supportedExtensions } from '@alfresco/aca-shared/rules';

export function canDatalink(context: RuleContext): boolean {
  if (!context?.selection) {
    return false;
  }

  if (context.navigation?.url?.startsWith('/trashcan')) {
    return false;
  }

  const { file } = context.selection;

  if (!file?.entry) {
    return false;
  }

  const extension = getFileExtension(file.entry.name);
  if (!extension || !supportedExtensions[extension]) {
    return false;
  }

  // workaround for Shared files
  if (context.navigation?.url?.startsWith('/shared')) {
    if (Object.prototype.hasOwnProperty.call(file.entry, 'allowableOperationsOnTarget')) {
      return context.permissions.check(file, ['update'], {
        target: 'allowableOperationsOnTarget'
      });
    }
  }

  if (!file.entry.properties) {
    return false;
  }

  if (file.entry.isLocked) {
    return false;
  }

  if (file.entry?.aspectNames) {
    const checkedOut = file.entry.aspectNames.find((aspect: string) => aspect === 'cm:checkedOut');

    if (checkedOut) {
      return false;
    }
  }

  if (file.entry.properties['cm:lockType'] === 'WRITE_LOCK' || file.entry.properties['cm:lockType'] === 'READ_ONLY_LOCK') {
    return false;
  }

  const lockOwner = file.entry.properties['cm:lockOwner'];
  if (lockOwner && lockOwner.id !== context.profile.id) {
    return false;
  }

  return context.permissions.check(file, ['update']);
}
