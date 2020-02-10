import { safeLoad } from 'js-yaml';
import { K8sResourceKind } from '@console/internal/module/k8s';
import { ClusterDeploymentPlatform } from '../types/cluster-deployment';

export const getPlatform = (clusterDeployment: K8sResourceKind): ClusterDeploymentPlatform =>
  clusterDeployment?.spec?.platform;

export const getPlatformLabel = (clusterDeployment: K8sResourceKind): string => {
  const platform = getPlatform(clusterDeployment);
  return platform ? Object.keys(getPlatform(clusterDeployment))[0] : '';
};

export const getBaseDomain = (clusterDeployment: K8sResourceKind): string =>
  clusterDeployment?.spec?.baseDomain;

export const getPullSecret = (secret: K8sResourceKind): string =>
  secret?.stringData?.['.dockerconfigjson'];

export const getSSHPrivateKey = (secret: K8sResourceKind): string =>
  secret?.stringData?.['ssh-privatekey'];

export const getInstallConfigFromSecret = (secret: K8sResourceKind) => {
  const installConfigEncoded = secret?.data?.['install-config.yaml'];
  return installConfigEncoded && safeLoad(atob(secret?.data?.['install-config.yaml']));
};

export const getLibvirtURI = (installConfig: any): string =>
  installConfig?.platform?.baremetal?.libvirtURI;

export const getApiVIP = (installConfig: any): string => installConfig?.platform?.baremetal?.apiVIP;

export const getDnsVIP = (installConfig: any): string => installConfig?.platform?.baremetal?.dnsVIP;

export const getIngressVIP = (installConfig: any): string =>
  installConfig?.platform?.baremetal?.ingressVIP;

export const getMachineCIDR = (installConfig: any): string =>
  installConfig?.platform?.baremetal?.machineCIDR;

export const getSSHPublicKey = (installConfig: any): string => installConfig?.sshKey;
