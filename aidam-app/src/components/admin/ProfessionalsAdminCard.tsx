interface ProfessionalsAdminCardProps {
  firstName: string;
  lastName: string;
  profession: string;
  lastConnection: Date;
  lastActions: string[];
}

const ProfessionalsAdminCard: React.FC<ProfessionalsAdminCardProps> = ({
  firstName,
  lastName,
  profession,
  lastConnection,
  lastActions,
}) => {
  let lastConnectionString: string;
  if (!lastConnection) {
    lastConnectionString = 'No se ha conectado aún';
  } else {
    lastConnectionString = new Date(lastConnection).toLocaleString();
  }

  return (
    <div className='flex py-5 px-7 rounded-xl border border-[#F0F0F0] mb-4'>
      <div className='w-[20%]'>
        <div className='mb-4 text-sm text-[#505050]'>Nombre y Apellido</div>
        <div className='font-semibold'>{firstName + ' ' + lastName}</div>
      </div>
      <div className='w-[20%]'>
        <div className='mb-4 text-sm text-[#505050]'>Profesión</div>
        <div className='font-semibold'>{profession}</div>
      </div>
      <div className='w-[20%]'>
        <div className='mb-4 text-sm text-[#505050]'>Última conexión</div>
        <div className='font-semibold'>{lastConnectionString}</div>
      </div>
      <div className='w-[40%]'>
        <div className='mb-4 text-sm text-[#505050]'>Últimas Acciones</div>
        <div className='font-semibold'>
          {lastActions.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalsAdminCard;
