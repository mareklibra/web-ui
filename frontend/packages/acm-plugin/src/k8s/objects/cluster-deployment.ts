import { safeDump } from 'js-yaml';
import { K8sResourceKind } from '@console/internal/module/k8s';
import { ClusterDeploymentModel, MachinePoolModel } from '../../models';
import { SecretModel, ConfigMapModel } from '@console/internal/models';
import { ClusterDeploymentParams } from '../../types/cluster-deployment';

const platformLabelToObject = (label) => ({ [label]: {} });

export const getPullSecretName = (clusterName: string): string => `${clusterName}-pull-secret`;
export const getInstallConfigName = (clusterName: string): string =>
  `${clusterName}-install-config`;
export const getSSHPrivateKeyName = (clusterName: string): string =>
  `${clusterName}-ssh-private-key`;
export const getInstallManifestsName = (clusterName: string): string =>
  `${clusterName}-install-manifests`;
export const getMachinePoolName = (clusterName: string): string => `${clusterName}-worker`;

export const buildClusterDeploymentObject = ({
  clusterName,
  platform,
  baseDomain,
}: ClusterDeploymentParams): K8sResourceKind => ({
  apiVersion: `${ClusterDeploymentModel.apiGroup}/${ClusterDeploymentModel.apiVersion}`,
  kind: ClusterDeploymentModel.kind,
  metadata: {
    name: clusterName,
    namespace: clusterName,
    annotations: {
      'hive.openshift.io/try-install-once': 'true',
    },
  },
  spec: {
    baseDomain,
    clusterName,
    controlPlaneConfig: {},
    images: {
      installerImagePullPolicy: 'Always',
    },
    installed: false,
    platform: platformLabelToObject(platform),
    provisioning: {
      releaseImage:
        'quay.io/openshift-release-dev/ocp-release@sha256:ea7ac3ad42169b39fce07e5e53403a028644810bee9a212e7456074894df40f3',
      installConfigSecretRef: {
        name: getInstallConfigName(clusterName),
      },
      sshPrivateKeySecretRef: {
        name: getSSHPrivateKeyName(clusterName),
      },
      manifestsConfigMapRef: {
        name: getInstallManifestsName(clusterName),
      },
      sshKnownHosts: [],
    },
    pullSecretRef: {
      name: getPullSecretName(clusterName),
    },
  },
});

export const buildPullSecretObject = ({
  clusterName,
  pullSecret,
}: ClusterDeploymentParams): K8sResourceKind => ({
  apiVersion: SecretModel.apiVersion,
  kind: SecretModel.kind,
  metadata: {
    name: getPullSecretName(clusterName),
    namespace: clusterName,
  },
  stringData: {
    '.dockerconfigjson': pullSecret,
  },
  type: 'kubernetes.io/dockerconfigjson',
});

export const buildSshPrivateKeyObject = ({
  clusterName,
  sshPrivateKey,
}: ClusterDeploymentParams): K8sResourceKind => ({
  apiVersion: SecretModel.apiVersion,
  kind: SecretModel.kind,
  metadata: {
    name: getSSHPrivateKeyName(clusterName),
    namespace: clusterName,
  },
  stringData: {
    'ssh-privatekey': sshPrivateKey,
  },
  type: 'Opaque',
});

export const buildInstallConfigObject = ({
  clusterName,
  baseDomain,
  platform,
  sshPublicKey,
  pullSecret,
  libvirtURI,
  apiVIP,
  dnsVIP,
  ingressVIP,
  machineCIDR,
}: ClusterDeploymentParams): any => ({
  apiVersion: 'v1',
  baseDomain,
  networking: {
    machineCIDR,
  },
  metadata: {
    name: clusterName,
  },
  compute: [
    {
      name: 'worker',
      replicas: 0,
    },
  ],
  controlPlane: {
    name: 'master',
    replicas: 3,
    platform: platformLabelToObject(platform),
  },
  platform: {
    baremetal: {
      libvirtURI,
      dnsVIP,
      apiVIP,
      ingressVIP,
      provisioningBridge: 'provisioning',
      externalBridge: 'baremetal',
      hosts: [
        {
          name: 'openshift-master-0',
          role: 'master',
          bmc: {
            address: 'ipmi://192.168.111.1:6230',
            username: 'admin',
            password: 'password',
          },
          bootMACAddress: '00:6e:f1:e7:1e:83',
          hardwareProfile: 'default',
        },
        {
          name: 'openshift-master-1',
          role: 'master',
          bmc: {
            address: 'ipmi://192.168.111.1:6231',
            username: 'admin',
            password: 'password',
          },
          bootMACAddress: '00:6e:f1:e7:1e:87',
          hardwareProfile: 'default',
        },
        {
          name: 'openshift-master-2',
          role: 'master',
          bmc: {
            address: 'ipmi://192.168.111.1:6232',
            username: 'admin',
            password: 'password',
          },
          bootMACAddress: '00:6e:f1:e7:1e:8b',
          hardwareProfile: 'default',
        },
      ],
    },
  },
  pullSecret,
  sshKey: sshPublicKey,
});

export const buildInstallConfigSecretObject = (
  params: ClusterDeploymentParams,
): K8sResourceKind => {
  const { clusterName } = params;
  return {
    apiVersion: SecretModel.apiVersion,
    kind: SecretModel.kind,
    metadata: {
      name: getInstallConfigName(clusterName),
      namespace: clusterName,
    },
    data: {
      'install-config.yaml': btoa(safeDump(buildInstallConfigObject(params))),
    },
    type: 'Opaque',
  };
};

export const metal3ConfigConfigMap: K8sResourceKind = {
  apiVersion: ConfigMapModel.apiVersion,
  kind: ConfigMapModel.kind,
  metadata: {
    name: 'metal3-config',
    namespace: 'openshift-machine-api',
  },
  data: {
    cache_url: '',
    deploy_kernel_url: 'http://172.22.0.3:6180/images/ironic-python-agent.kernel',
    deploy_ramdisk_url: 'http://172.22.0.3:6180/images/ironic-python-agent.initramfs',
    dhcp_range: '172.22.0.10,172.22.0.100',
    http_port: '6180',
    ironic_endpoint: 'http://172.22.0.3:6385/v1/',
    ironic_inspector_endpoint: 'http://172.22.0.3:5050/v1/',
    provisioning_interface: 'eno1',
    provisioning_ip: '172.22.0.3/24',
    rhcos_image_url:
      'https://releases-art-rhcos.svc.ci.openshift.org/art/storage/releases/rhcos-4.3/43.81.201911221453.0/x86_64/rhcos-43.81.201911221453.0-openstack.x86_64.qcow2.gz',
  },
};

export const buildInstallManifestsConfigMapObject = ({
  clusterName,
}: ClusterDeploymentParams): K8sResourceKind => ({
  apiVersion: ConfigMapModel.apiVersion,
  kind: ConfigMapModel.kind,
  metadata: {
    creationTimestamp: null,
    name: getInstallManifestsName(clusterName),
    namespace: clusterName,
  },
  data: {
    'metal3-config.yaml': safeDump(metal3ConfigConfigMap),
  },
});

export const buildMachinePoolObject = ({
  clusterName,
  platform,
}: ClusterDeploymentParams): K8sResourceKind => ({
  apiVersion: `${MachinePoolModel.apiGroup}/${MachinePoolModel.apiVersion}`,
  kind: MachinePoolModel.kind,
  metadata: {
    name: getMachinePoolName(clusterName),
    namespace: clusterName,
  },
  spec: {
    clusterDeploymentRef: {
      name: clusterName,
    },
    name: 'worker',
    platform: platformLabelToObject(platform),
    replicas: 0,
  },
});
