const calculateAge = (fechaNacimiento: Date): number => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  const dia = hoy.getDate() - nacimiento.getDate();

  if (mes < 0 || (mes === 0 && dia < 0)) {
    edad--;
  }

  return edad;
}

export default calculateAge;
