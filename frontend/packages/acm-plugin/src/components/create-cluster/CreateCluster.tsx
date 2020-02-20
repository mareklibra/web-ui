import * as React from 'react';
import * as Yup from 'yup';
import * as _ from 'lodash';
import { Formik } from 'formik';
import { history, resourcePathFromModel, FirehoseResult } from '@console/internal/components/utils';
import { nameValidationSchema } from '@console/dev-console/src/components/import/validation-schema';
import { getName } from '@console/shared/src';
import { K8sResourceKind } from '@console/internal/module/k8s';
import {
  createClusterDeployment,
  updateClusterDeployment,
} from '../../k8s/requests/cluster-deployment';
import { getLoadedData } from '@console/shared/src/utils';
import { usePrevious } from '@console/shared/src/hooks';
import CreateClusterForm from './CreateClusterForm';
import { CreateClusterFormValues } from '../../types/cluster-deployment';
import { ClusterDeploymentModel } from '../../models';
import {
  getPlatformLabel,
  getBaseDomain,
  getPullSecret,
  getSSHPrivateKey,
  getInstallConfigFromSecret,
  getApiVIP,
  getDnsVIP,
  getIngressVIP,
  getMachineCIDR,
  getLibvirtURI,
  getSSHPublicKey,
} from '../../selectors/cluster-deployment';
// import { MAC_REGEX, BMC_ADDRESS_REGEX } from './utils';

const getInitialValues = (
  clusterDeployment: K8sResourceKind,
  pullSecret: K8sResourceKind,
  sshPrivateKeySecret: K8sResourceKind,
  installConfigSecret: K8sResourceKind,
): CreateClusterFormValues => {
  const installConfig = getInstallConfigFromSecret(installConfigSecret);
  return {
    clusterName: getName(clusterDeployment) || '',
    platform: getPlatformLabel(clusterDeployment) || 'bareMetal',
    baseDomain: getBaseDomain(clusterDeployment) || '',
    pullSecret: getPullSecret(pullSecret) || '',
    sshPrivateKey: getSSHPrivateKey(sshPrivateKeySecret) || '',
    sshPublicKey: getSSHPublicKey(installConfig) || '',
    libvirtURI: getLibvirtURI(installConfig) || '',
    apiVIP: getApiVIP(installConfig) || '',
    dnsVIP: getDnsVIP(installConfig) || '',
    ingressVIP: getIngressVIP(installConfig) || '',
    machineCIDR: getMachineCIDR(installConfig) || '',
  };
};

type CreateClusterProps = {
  namespace: string;
  isEditing: boolean;
  loaded?: boolean;
  clusterDeployments?: FirehoseResult<K8sResourceKind[]>;
  clusterDeployment?: FirehoseResult<K8sResourceKind>;
  pullSecret?: FirehoseResult<K8sResourceKind>;
  sshPrivateKeySecret?: FirehoseResult<K8sResourceKind>;
  machinePool?: FirehoseResult<K8sResourceKind>;
  installConfigSecret?: FirehoseResult<K8sResourceKind>;
  installManifestsConfigMap?: FirehoseResult<K8sResourceKind>;
};

const CreateCluster: React.FC<CreateClusterProps> = ({
  namespace,
  isEditing,
  clusterDeployments,
  clusterDeployment: clusterDeploymentResult,
  pullSecret: pullSecretResult,
  sshPrivateKeySecret: sshPrivateKeyResult,
  machinePool: machinePoolResult,
  installConfigSecret: installConfigResult,
  installManifestsConfigMap: installManifestsResult,
}) => {
  const [reload, setReload] = React.useState<boolean>(false);
  const clusterDeploymentNames = _.flatMap(getLoadedData(clusterDeployments, []), (cd) =>
    getName(cd),
  );
  const clusterDeployment = getLoadedData(clusterDeploymentResult);
  const prevClusterDeployment = usePrevious(clusterDeployment);

  const pullSecret = getLoadedData(pullSecretResult);
  const prevPullSecret = usePrevious(pullSecret);

  const sshPrivateKeySecret = getLoadedData(sshPrivateKeyResult);
  const prevSshPrivateKeySecret = usePrevious(sshPrivateKeySecret);

  const installConfigSecret = getLoadedData(installConfigResult);
  const prevInstallConfigSecret = usePrevious(installConfigSecret);

  // TODO(jtomasek): remove these if it is not needed to track/update for editting
  const machinePool = getLoadedData(machinePoolResult);
  const installManifestsConfigMap = getLoadedData(installManifestsResult);

  const initialValues = getInitialValues(
    clusterDeployment,
    pullSecret,
    sshPrivateKeySecret,
    installConfigSecret,
  );
  const prevInitialValues = getInitialValues(
    prevClusterDeployment,
    prevPullSecret,
    prevSshPrivateKeySecret,
    prevInstallConfigSecret,
  );

  React.useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload, setReload]);

  const showUpdated =
    isEditing && prevClusterDeployment && !_.isEqual(prevInitialValues, initialValues);

  const validationSchema = Yup.object().shape({
    clusterName: Yup.mixed()
      .test(
        'unique-name',
        'Cluster name "${value}" is already taken.', // eslint-disable-line no-template-curly-in-string
        (value) => !clusterDeploymentNames.includes(value),
      )
      .concat(nameValidationSchema),
  });

  const handleSubmit = (values, actions) => {
    const params = { ...values, namespace };
    const promise = isEditing
      ? updateClusterDeployment(clusterDeployment, pullSecret, sshPrivateKeySecret, params)
      : createClusterDeployment(params);

    promise
      .then(() => {
        actions.setSubmitting(false);
        history.push(resourcePathFromModel(ClusterDeploymentModel, values.name, namespace));
      })
      .catch((error) => {
        actions.setSubmitting(false);
        actions.setStatus({ submitError: error.message });
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={isEditing && (reload || !prevClusterDeployment)}
      onSubmit={handleSubmit}
      onReset={() => setReload(true)}
      validationSchema={validationSchema}
    >
      {(props) => <CreateClusterForm {...props} isEditing={isEditing} showUpdated={showUpdated} />}
    </Formik>
  );
};

export default CreateCluster;
