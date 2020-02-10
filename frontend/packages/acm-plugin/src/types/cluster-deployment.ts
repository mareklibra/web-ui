export type ClusterDeploymentPlatform = {
  [key: string]: any;
};

export type CreateClusterFormValues = {
  clusterName: string;
  platform: string;
  baseDomain: string;
  pullSecret: string;
  sshPrivateKey: string;
  sshPublicKey: string;
  libvirtURI: string;
  apiVIP: string;
  dnsVIP: string;
  ingressVIP: string;
  machineCIDR: string;
};

export type ClusterDeploymentParams = CreateClusterFormValues & {
  namespace: string;
};
