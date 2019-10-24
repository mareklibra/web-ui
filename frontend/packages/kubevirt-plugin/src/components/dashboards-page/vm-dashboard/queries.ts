import * as _ from 'lodash';

export enum VMQueries {
  CPU_USAGE = 'CPU_USAGE',
  MEMORY_USAGE = 'MEMORY_USAGE',
  FILESYSTEM_USAGE = 'FILESYSTEM_USAGE',
  NETWORK_IN_USAGE = 'NETWORK_IN_USAGE',
  NETWORK_OUT_USAGE = 'NETWORK_OUT_USAGE',
}

const queries = {
  [VMQueries.CPU_USAGE]: _.template(
    // TODO verify; use seconds or milicores?
    `kubevirt_vmi_vcpu_seconds{exported_namespace='<%= namespace %>',name='<%= vmName %>'}<%= duration %>`,
  ),
  [VMQueries.MEMORY_USAGE]: _.template(
    `kubevirt_vmi_memory_resident_bytes{exported_namespace='<%= namespace %>',name='<%= vmName %>'}<%= duration %>`,
  ),
  [VMQueries.FILESYSTEM_USAGE]: _.template(
    `sum(kubevirt_vmi_storage_traffic_bytes_total{exported_namespace='<%= namespace %>',name='<%= vmName %>'})<%= duration %>`,
  ),
  [VMQueries.NETWORK_IN_USAGE]: _.template(
    `sum(kubevirt_vmi_network_traffic_bytes_total{type='rx',exported_namespace='<%= namespace %>',name='<%= vmName %>'})<%= duration %>`,
  ),
  [VMQueries.NETWORK_OUT_USAGE]: _.template(
    `sum(kubevirt_vmi_network_traffic_bytes_total{type='tx',exported_namespace='<%= namespace %>',name='<%= vmName %>'})<%= duration %>`,
  ),
};

export const getUtilizationQueries = (props: {
  vmName: string;
  namespace: string;
  duration: string;
}) => ({
  [VMQueries.CPU_USAGE]: queries[VMQueries.CPU_USAGE](props),
  [VMQueries.MEMORY_USAGE]: queries[VMQueries.MEMORY_USAGE](props),
  [VMQueries.FILESYSTEM_USAGE]: queries[VMQueries.FILESYSTEM_USAGE](props),
  [VMQueries.NETWORK_IN_USAGE]: queries[VMQueries.NETWORK_IN_USAGE](props),
  [VMQueries.NETWORK_OUT_USAGE]: queries[VMQueries.NETWORK_OUT_USAGE](props),
});
