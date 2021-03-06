import { PrometheusHealthHandler, ResourceHealthHandler } from '@console/plugin-sdk';
import { HealthState } from '@console/shared/src/components/dashboard/status-card/states';
import { getResiliencyProgress } from '../../../../utils';
import { WatchCephResource } from '../../../../types';

const CephHealthStatus = {
  HEALTH_OK: {
    state: HealthState.OK,
  },
  HEALTH_WARN: {
    state: HealthState.WARNING,
  },
  HEALTH_ERR: {
    state: HealthState.ERROR,
  },
};

export const getCephHealthState: ResourceHealthHandler<WatchCephResource> = ({ ceph }) => {
  const { data, loaded, loadError } = ceph;
  const status = data?.[0]?.status?.ceph?.health;

  if (loadError) {
    return { state: HealthState.NOT_AVAILABLE };
  }
  if (!loaded) {
    return { state: HealthState.LOADING };
  }
  if (data.length === 0) {
    return { state: HealthState.NOT_AVAILABLE };
  }
  return CephHealthStatus[status] || { state: HealthState.UNKNOWN };
};

export const getDataResiliencyState: PrometheusHealthHandler = (responses = [], errors = []) => {
  const progress: number = getResiliencyProgress(responses[0]);
  if (errors[0]) {
    return { state: HealthState.NOT_AVAILABLE };
  }
  if (!responses[0]) {
    return { state: HealthState.LOADING };
  }
  if (Number.isNaN(progress)) {
    return { state: HealthState.UNKNOWN };
  }
  if (progress < 1) {
    return { state: HealthState.PROGRESS };
  }
  return { state: HealthState.OK };
};
