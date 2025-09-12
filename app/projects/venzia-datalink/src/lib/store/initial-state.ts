import { VenziaDatalinkState, INITIAL_VENZIA_DATALINK_STATE } from './states/venzia-datalink.state';

export interface VenziaDatalinkStore {
  datalink: VenziaDatalinkState;
}

export const INITIAL_STATE: VenziaDatalinkStore = {
  datalink: INITIAL_VENZIA_DATALINK_STATE
};
