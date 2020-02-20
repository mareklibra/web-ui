import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Firehose, FirehoseResource } from '@console/internal/components/utils';
import { referenceForModel } from '@console/internal/module/k8s';
import { SecretModel, ConfigMapModel } from '@console/internal/models';
import { ClusterDeploymentModel, MachinePoolModel } from '../../models';
import CreateCluster from './CreateCluster';
import {
  getPullSecretName,
  getSSHPrivateKeyName,
  getMachinePoolName,
  getInstallManifestsName,
  getInstallConfigName,
} from '../../k8s/objects/cluster-deployment';

export type CreateClusterPageProps = RouteComponentProps<{ ns?: string; name?: string }>;

const CreateClusterPage: React.FC<CreateClusterPageProps> = ({ match }) => {
  const { name, ns: namespace } = match.params;
  const resources: FirehoseResource[] = [];

  const isEditing = !!name;
  if (isEditing) {
    resources.push(
      {
        kind: referenceForModel(ClusterDeploymentModel),
        namespaced: true,
        namespace: name,
        name,
        isList: false,
        prop: 'clusterDeployment',
      },
      {
        kind: referenceForModel(SecretModel),
        namespaced: true,
        namespace: name,
        name: getPullSecretName(name),
        isList: false,
        prop: 'pullSecret',
      },
      {
        kind: referenceForModel(SecretModel),
        namespaced: true,
        namespace: name,
        name: getSSHPrivateKeyName(name),
        isList: false,
        prop: 'sshPrivateKeySecret',
      },
      {
        kind: referenceForModel(SecretModel),
        namespaced: true,
        namespace: name,
        name: getInstallConfigName(name),
        isList: false,
        prop: 'installConfigSecret',
      },
      {
        kind: referenceForModel(MachinePoolModel),
        namespaced: true,
        namespace: name,
        name: getMachinePoolName(name),
        isList: false,
        prop: 'machinePool',
      },
      {
        kind: referenceForModel(ConfigMapModel),
        namespaced: true,
        namespace: name,
        name: getInstallManifestsName(name),
        isList: false,
        prop: 'installManifestsConfigMap',
      },
      // load associated secrets as well (install-config etc.)
      // {
      //   kind: SecretModel.kind,
      //   namespaced: true,
      //   namespace,
      //   name: getInstallConfigSecretName(name),
      //   isList: false,
      //   prop: 'secret',
      // },
    );
  }
  resources.push({
    kind: referenceForModel(ClusterDeploymentModel),
    namespaced: true,
    namespace,
    isList: true,
    prop: 'clusterDeployments',
  });

  const title = 'Deploy a cluster';
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="co-m-pane__body co-m-pane__form">
        {/* TODO(jtomasek): Turn this to PageHeading alternative for create forms (e.g.
        CreateResourceFormPageHeading) */}
        <h1 className="co-m-pane__heading co-m-pane__heading--baseline">
          <div className="co-m-pane__name">{title}</div>
        </h1>
        <Firehose resources={resources}>
          <CreateCluster namespace={namespace} isEditing={isEditing} />
        </Firehose>
      </div>
    </>
  );
};

export default CreateClusterPage;
