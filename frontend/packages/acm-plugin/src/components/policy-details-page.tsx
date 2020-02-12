import * as React from 'react';
import { DetailsPage } from '@console/internal/components/factory';
import { K8sResourceKindReference } from '@console/internal/module/k8s';
import { connectToModel } from '@console/internal/kinds';
import { ResourceDetailsPageProps } from '@console/internal/components/resource-list';
import { PolicyDetails } from './policy-details';

export const PolicyDetailsPage = connectToModel((props: PolicyDetailsPageProps) => {
  // const { name, namespace } = props.match.params;

  const resources = [];

  const pages = [
    {
      href: '',
      name: 'Overview',
      component: PolicyDetails,
    },
  ];

  return (
    <DetailsPage {...props} pages={pages} resources={resources} />
  );
});

type PolicyDetailsPageProps = ResourceDetailsPageProps & {
  name: string;
  namespace: string;
  kind: K8sResourceKindReference;
};
