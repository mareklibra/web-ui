import * as React from 'react';
import { Link } from 'react-router-dom';
import { ResourceIcon } from '@console/internal/components/utils';
import { TemplateModel } from '@console/internal/models';

export const VMTemplateLink: React.FC<VMTemplateLinkProps> = ({ name, namespace, uid }) => {
  // const name = template && (template.name || getName(template));
  // const namespace = template && (template.namespace || getNamespace(template));

  return (
    <>
      <ResourceIcon kind={TemplateModel.kind} />
      <Link
        to={`/k8s/ns/${namespace}/vmtemplates/${name}`}
        title={uid}
        className="co-resource-item__resource-name"
      >
        {name}
      </Link>
    </>
  );
};

type VMTemplateLinkProps = {
  name: string;
  namespace: string;
  uid?: string;
};
