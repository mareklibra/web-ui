import * as React from 'react';
import {
  StatusBox,
  ScrollToTopOnMount,
  SectionHeading,
  ResourceSummary,
} from '@console/internal/components/utils';
import { getBasicID, prefixedID } from '../selectors';
import { PolicyKind } from '../types';
import { DetailsItem } from './details-item';

const PolicyResourceSummary: React.FC<PolicyDetailsSummaryProps> = (props) => {
  // TODO: applications, deployments
  // TODO: policy violation, security indings
  // TODO: link to Grafana
  const { policy } = props;
  // const id = getBasicID(policy);
  
  return (
    <ResourceSummary resource={policy}>
    </ResourceSummary>
  );
};

const PolicyDetailsList: React.FC<policyDetailsListProps> = (props) => {
  const { policy } = props;
  const id = getBasicID(policy);

  // const kubernetesVersion = clusterStatus && clusterStatus.spec && clusterStatus.spec.version;
  // const cloudProvider = getLabelValue(cluster, 'cloud');

  return (
    <dl className="co-m-pane__details">
      <DetailsItem title="TBD" idValue={prefixedID(id, 'master-status')}>
        TBD
      </DetailsItem>
    </dl>
  );
};

export const PolicyDetails: React.FC<PolicyDetailsProps> = (props) => {
  const { obj: policy, ...restProps } = props;
  const mainResources = {
    policy,
  };

  return (
    <StatusBox data={policy} loaded={!!policy} {...restProps}>
      <ScrollToTopOnMount />
      <div className="co-m-pane__body">
        <SectionHeading text="Policy Overview" />
        <div className="row">
          <div className="col-sm-6">
            <PolicyResourceSummary {...mainResources} />
          </div>
          <div className="col-sm-6">
            <PolicyDetailsList {...mainResources} />
          </div>
        </div>
      </div>
    </StatusBox>
  );
};

type PolicyDetailsSummaryProps = {
  policy: PolicyKind;
};
type policyDetailsListProps = PolicyDetailsSummaryProps;

type PolicyDetailsProps = {
  obj: PolicyKind;
};
