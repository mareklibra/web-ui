import { ClusterModel, ClusterDeploymentModel } from '../../models';

export const getCreateClusterDropdownProps = () => {
  const items: any = {
    deployDialog: 'Deploy cluster via dialog',
    deployYaml: 'Deploy cluster from YAML',
    importDialog: 'Import existing cluster',
  };

  return {
    items,
    createLink: (itemName) => {
      const base = `/${ClusterDeploymentModel.plural}`;
      const importBase = `/${ClusterModel.plural}`;

      switch (itemName) {
        case 'deployDialog':
          return `${base}/~new/form`;
        case 'importDialog':
          return `${importBase}/~new/import`;
        case 'deployYaml':
        default:
          return `${base}/~new`;
      }
    },
  };
};
