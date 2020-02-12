import { K8sResourceKind, K8sResourceCondition, K8sResourceCommon } from '@console/internal/module/k8s';

export enum ClusterConditionTypes {
  OK = 'OK',
  // TODO: add more
};

export enum PolicyComplianceTypes {
  MUST_HAVE = 'musthave',
  // TODO: add more
};

export enum RemediationActionTypes {
  INFORM = 'inform',
  // TODO: add more
};

export enum SeverityTypes {
  LOW = 'low',
  // TODO: add more
};

export type ClusterSpec = {
  authInfo: any;
  kubernetesApiEndpoints: any; // TODO: be more specific
};

export type ClusterStatus = {
  conditions?: any[]; // TODO: be more specific
};

export type ClusterKind = {
  spec: ClusterSpec;
  status: ClusterStatus;
} & K8sResourceKind;

export type ClusterStatusKind = {
  // TODO
} & K8sResourceKind;

export type ClusterCondition = K8sResourceCondition<ClusterConditionTypes>;

export type PolicyNamespaces = {
  exclude?: string[];
  include?: string[];
};

export type PolicyObjectDefinition = {
  objectDefinition: K8sResourceCommon & {
    spec: {
      clusterAuditPolicy: {} // TODO
      namespaceSelector: {
        exclude?: string[];
        include?: string[]
      };
      remediationAction: RemediationActionTypes
      severity: SeverityTypes;
    }
  };
  status: {
    Validity: any; // TODO
  };
};

export type PolicyTemplates = PolicyObjectDefinition[];

export type PolicySpec = {
  complianceType: PolicyComplianceTypes;
  disabled: boolean;
  namespaces: PolicyNamespaces;
  "policy-templates": PolicyTemplates;
  remediationAction: RemediationActionTypes;
};

export type PolicyStatus = {
  placementBindings?: string[];
  placementPolicies?: string[];
};

export type PolicyKind = {
  spec: PolicySpec;
  status: PolicyStatus;
} & K8sResourceKind;
