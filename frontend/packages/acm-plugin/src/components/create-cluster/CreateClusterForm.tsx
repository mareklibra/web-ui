import * as React from 'react';
import * as _ from 'lodash';
import { history } from '@console/internal/components/utils';
import { FormikProps } from 'formik';
import { Form, TextInputTypes } from '@patternfly/react-core';
import { InputField, FormFooter, DropdownField, TextAreaField } from '@console/shared/src';
import { CreateClusterFormValues } from '../../types/cluster-deployment';

type CreateClusterFormProps = FormikProps<CreateClusterFormValues> & {
  isEditing: boolean;
  showUpdated: boolean;
};

const CreateClusterForm: React.FC<CreateClusterFormProps> = ({
  errors,
  handleSubmit,
  handleReset,
  status,
  isSubmitting,
  dirty,
  isEditing,
  showUpdated,
}) => (
  <Form onSubmit={handleSubmit}>
    <InputField
      type={TextInputTypes.text}
      data-test-id="deploy-cluster-form-cluster-name-input"
      name="clusterName"
      label="Cluster Name"
      placeholder="mycluster"
      helpText="Provide unique name for the new Cluster."
      required
      isDisabled={isEditing}
    />
    <InputField
      type={TextInputTypes.text}
      data-test-id="deploy-cluster-form-base-domain-input"
      name="baseDomain"
      label="Base DNS Domain"
      placeholder="base.domain"
      helpText="Provide unique name for the new Cluster."
      required
      isDisabled={isEditing}
    />
    <DropdownField
      data-test-id="deploy-cluster-form-platform-dropdown"
      name="platform"
      label="Infrastructure Platform"
      items={{
        bareMetal: 'Bare Metal',
        aws: 'Amazon Web Services',
      }}
      required
      disabled
    />
    <TextAreaField
      data-test-id="deploy-cluster-form-pull-secret-textarea"
      name="pullSecret"
      label="Pull Secret"
      required
    />
    <TextAreaField
      data-test-id="deploy-cluster-form-ssh-private-key-textarea"
      name="sshPrivateKey"
      label="SSH Private Key"
      required
    />
    <TextAreaField
      data-test-id="deploy-cluster-form-ssh-public-key-textarea"
      name="sshPublicKey"
      label="SSH Public Key"
      required
    />
    <InputField
      type={TextInputTypes.text}
      data-test-id="deploy-cluster-form-libvirt-uri-input"
      name="libvirtURI"
      label="Libvirt URI"
      placeholder=""
      required
    />
    <InputField
      type={TextInputTypes.text}
      data-test-id="deploy-cluster-form-api-vip-input"
      name="apiVIP"
      label="API Virtual IP"
      placeholder=""
      required
    />
    <InputField
      type={TextInputTypes.text}
      data-test-id="deploy-cluster-form-dns-vip-input"
      name="dnsVIP"
      label="Internal DNS Virtual IP"
      placeholder=""
      required
    />
    <InputField
      type={TextInputTypes.text}
      data-test-id="deploy-cluster-form-ingress-vip-input"
      name="ingressVIP"
      label="Ingress Virtual IP"
      placeholder=""
      required
    />
    <InputField
      type={TextInputTypes.text}
      data-test-id="deploy-cluster-form-machine-cidr-input"
      name="machineCIDR"
      label="Machine CIDR"
      placeholder=""
      required
    />
    <FormFooter
      isSubmitting={isSubmitting}
      handleReset={showUpdated && handleReset}
      handleCancel={history.goBack}
      submitLabel={isEditing ? 'Save' : 'Create'}
      errorMessage={status && status.submitError}
      disableSubmit={isSubmitting || !dirty || !_.isEmpty(errors)}
      infoTitle={'Resources have been updated'}
      infoMessage={'Click reload to see the recent changes'}
      showAlert={showUpdated}
    />
  </Form>
);

export default CreateClusterForm;
