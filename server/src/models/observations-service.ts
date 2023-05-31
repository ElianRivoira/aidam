import Observation, {
  ObservationAttrs,
  ObservationDoc,
} from './observations.model';

const postObservation = async (
  data: ObservationAttrs
): Promise<ObservationDoc> => {
  const obs = Observation.build(data);
  await obs.save();
  return obs;
};

const getObservation = async (id: string): Promise<ObservationDoc | null> => {
  const obs = await Observation.findById(id).populate('professional');
  return obs;
};

const putObservation = async (
  id: string,
  text: string
): Promise<ObservationDoc | null> => {
  const obs = await Observation.findByIdAndUpdate(
    id,
    { observation: text },
    { new: true }
  ).populate('professional');
  return obs;
};

const deleteObservation = async (
  id: string
): Promise<ObservationDoc | null> => {
  const obs = await Observation.findByIdAndDelete(id);
  return obs;
};

export default {
  postObservation,
  getObservation,
  putObservation,
  deleteObservation,
};
