import Observation,{ ObservationAttrs, ObservationDoc } from './observations.model';

const postObservation = async (data: ObservationAttrs): Promise<ObservationDoc> => {
  const obs = Observation.build(data);
  await obs.save();
  return obs;
}

export default { postObservation };