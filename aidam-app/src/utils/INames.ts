export const createINames = (person: User | Patient): INames => {
  let Inames = {
    firstName1: '',
    firstName2: '',
    lastName1: '',
    lastName2: '',
  };

  if (person.firstName.includes(' ')) {
    [Inames.firstName1, Inames.firstName2] = person.firstName.split(' ');
  } else Inames.firstName1 = person.firstName;

  if (person.lastName.includes(' ')) {
    [Inames.lastName1, Inames.lastName2] = person.lastName.split(' ');
  } else Inames.lastName1 = person.lastName;

  return Inames;
};
