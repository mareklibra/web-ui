import { safeDump } from 'js-yaml';
import {
  buildClusterDeploymentObject,
  buildPullSecretObject,
  buildSshPrivateKeyObject,
  buildMachinePoolObject,
  buildInstallManifestsConfigMapObject,
  buildInstallConfigSecretObject,
} from '../objects/cluster-deployment';
// import { PatchBuilder } from '@console/shared/src/k8s/patch';
import { k8sCreate, k8sPatch, K8sResourceKind } from '@console/internal/module/k8s';
import { ClusterDeploymentModel, MachinePoolModel } from '../../models';
import { ClusterDeploymentParams } from '../../types/cluster-deployment';
import { SecretModel, ConfigMapModel } from '@console/internal/models';

export const createClusterDeployment = async (params: ClusterDeploymentParams) => {
  const clusterDeployment = buildClusterDeploymentObject(params);
  const pullSecret = buildPullSecretObject(params);
  const sshPrivateKeySecret = buildSshPrivateKeyObject(params);
  const machinePool = buildMachinePoolObject(params);
  const installManifestsConfigMap = buildInstallManifestsConfigMapObject(params);
  const installConfigSecret = buildInstallConfigSecretObject(params);
  console.log('ClusterDeployment: \n', safeDump(clusterDeployment));
  console.log('Pull Secret: \n', safeDump(pullSecret));
  console.log('SSH Private Key: \n', safeDump(sshPrivateKeySecret));
  console.log('Machine Pool: \n', safeDump(machinePool));
  console.log('Install Manifests: \n', safeDump(installManifestsConfigMap));
  console.log('Install Config: \n', safeDump(installConfigSecret));
  // await k8sCreate(SecretModel, pullSecret);
  // await k8sCreate(SecretModel, sshPrivateKeySecret);
  // await k8sCreate(SecretModel, installConfigSecret);
  // await k8sCreate(ConfigMapModel, installManifestsConfigMap);
  // await k8sCreate(ClusterDeploymentModel, clusterDeployment);
  // await k8sCreate(MachinePoolModel, machinePool);
};

export const updateClusterDeployment = async (
  clusterDeployment: K8sResourceKind,
  pullSecret: K8sResourceKind,
  sshPrivateKeySecret: K8sResourceKind,
  {
    clusterName,
    namespace,
    baseDomain,
    platform,
    pullSecret,
    sshPrivateKey,
  }: ClusterDeploymentParams,
) => {
  const patches = [
    // ...new PatchBuilder('/spec').buildAddObjectKeysPatches(
    //   { description },
    //   clusterDeployment.spec,
    // ),
  ];

  if (patches.length > 0) {
    await k8sPatch(ClusterDeploymentModel, clusterDeployment, patches);
  }
};
