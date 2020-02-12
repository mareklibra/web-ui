import * as React from 'react';
import * as classNames from 'classnames';
import { sortable } from '@patternfly/react-table';
import {
  getName,
  getNamespace,
  getUID,
  dimensifyHeader,
  dimensifyRow,
  DASH,
} from '@console/shared';
import { Table, TableRow, TableData, MultiListPage } from '@console/internal/components/factory';
import { FirehoseResult, Kebab, ResourceLink } from '@console/internal/components/utils';
import { referenceForModel } from '@console/internal/module/k8s';
import { ClusterModel, PolicyModel } from '../models';
import { getLoadedData, getAnnotationlValue } from '../selectors';
import { PolicyKind } from '../types';

const ANNOTATION_STANDARDS = 'policy.mcm.ibm.com/standards';
const ANNOTATION_CONTROLS = 'policy.mcm.ibm.com/controls';
const ANNOTATION_CATEGORIES = 'policy.mcm.ibm.com/categories';

const tableColumnClasses = [
  classNames('col-lg-2', 'col-md-2', 'col-sm-2', 'col-xs-2'),
  classNames('col-lg-2', 'col-md-2', 'col-sm-2', 'col-xs-2'),
  classNames('col-lg-2', 'col-md-2', 'col-sm-2', 'col-xs-2'),
  classNames('col-lg-2', 'col-md-2', 'col-sm-2', 'col-xs-2'),
  classNames('col-lg-2', 'col-md-2', 'col-sm-2', 'col-xs-2'),
  classNames('col-lg-2', 'col-md-2', 'col-sm-2', 'col-xs-2'),
  Kebab.columnClass,
];

const ClusterHeader = () =>
  dimensifyHeader(
    [
      {
        title: 'Name',
        sortField: 'metadata.name',
        transforms: [sortable],
      },
      {
        title: 'Namespace',
        sortField: 'metadata.namespace',
        transforms: [sortable],
      },
      {
        title: 'Remediation',
        sortFunc: 'string',
        transforms: [sortable],
      },
      {
        title: 'Standards',
        sortFunc: 'string',
        transforms: [sortable],
      },
      {
        title: 'Controls',
        sortFunc: 'string',
        transforms: [sortable],
      },
      {
        title: 'Categories',
        sortFunc: 'string',
        transforms: [sortable],
      },
      // Public service endpoint URL (aka console)
      // API endpoint
      // Namespace
      // nodes
      {
        title: '',
      },
    ],
    tableColumnClasses,
  );

const PolicyRow: React.FC<PolicyRowProps> = (props) => {
  const {
    obj: policy,
    index,
    key,
    style,
  } = props;

  const dimensify = dimensifyRow(tableColumnClasses);
  const name = getName(policy);
  const namespace = getNamespace(policy);
  const uid = getUID(policy);

  console.log('--- PolicyRow, policy: ', policy);
  return (
    <TableRow id={uid} index={index} trKey={key} style={style}>
      <TableData className={dimensify()}>
        <ResourceLink
          kind={referenceForModel(PolicyModel)}
          name={name}
          namespace={namespace}
          title={name}
        />
      </TableData>
      <TableData className={dimensify()}>
        {namespace}
      </TableData>
      <TableData className={dimensify()}>
        {policy.spec.remediationAction || DASH}
        </TableData>
      <TableData className={dimensify()}>
        {getAnnotationlValue(policy, ANNOTATION_STANDARDS) || DASH}
        </TableData>
      <TableData className={dimensify()}>
        {getAnnotationlValue(policy, ANNOTATION_CONTROLS) || DASH}
        </TableData>
      <TableData className={dimensify()}>
        {getAnnotationlValue(policy, ANNOTATION_CATEGORIES) || DASH}
        </TableData>
    </TableRow>
  );
};

const flatten = ({ policies }) => getLoadedData(policies, []);

const PolicyList: React.FC<React.ComponentProps<typeof Table> & PolicyListProps> = (props) => {
  const { resources, ...restProps } = props;

  return (
    <div className="mcm-policy-list">
      <Table
        {...restProps}
        aria-label={ClusterModel.labelPlural}
        Header={ClusterHeader}
        Row={PolicyRow}
        virtualize
      />
    </div>
  );
};
PolicyList.displayName = 'policyList';

export const PoliciesPage: React.FC<PoliciesPageProps> = (props) => {
  const resources = [
    {
      kind: referenceForModel(PolicyModel),
      isList: true,
      prop: 'policies',
      optional: false,
    },
  ];

  return (
    <MultiListPage
      {...props}
      ListComponent={PolicyList}
      title="Cluster Policies"
      resources={resources}
      flatten={flatten}
    />
  );
};

type PolicyRowProps = {
  obj: PolicyKind;
  index: number;
  key: string;
  style: object;
};

type PolicyListProps = {
  data: PolicyKind[];
  resources: {
    policies: FirehoseResult<PolicyKind[]>;
  };
};

type PoliciesPageProps = {};
