import React from 'react';

import { CheckboxInput, TextInput } from '../Inputs';
import { socialSecurity } from '@/utils/socialReport/dataCheckbox';

interface Props {
  breakpoint: boolean;
  socialFormData: SocialFormData;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSocialSecurity: (e: React.ChangeEvent<HTMLInputElement>, assignation: string) => void;
}

const SocialSecurity: React.FC<Props> = ({
  breakpoint,
  socialFormData,
  handleCheckboxChange,
  handleSocialSecurity,
}) => {
  return (
    <>
      <h3 className='font-medium text-ln my-2'>Seguridad Social:</h3>
      <div className='flex lgMax:flex-col lg:gap-4'>
        <CheckboxInput
          optionsArray={socialSecurity}
          divclass={breakpoint ? 'flex gap-2 flex-wrap justify-between mb-4' : 'w-[7%]'}
          internalDivClass={breakpoint ? '' : 'flex flex-col mt-10'}
          labelclass='mr-0'
          optionsClass={breakpoint ? '' : 'mb-4'}
          name='socialSecurity'
          value={socialFormData.socialSecurity}
          onChange={handleCheckboxChange}
        />
        <div className='flex flex-col mb-4 lg:gap-4 w-full lg:w-[93%]'>
          {!breakpoint && (
            <div className='flex gap-3 w-full'>
              <h4 className='text-ln lgMax:text-lb font-medium w-[25%]'>¿Quién la cobra?</h4>
              <h4 className='text-ln lgMax:text-lb font-medium w-[50%]'>Observaciones:</h4>
              <h4 className='text-ln lgMax:text-lb font-medium w-[25%]'>Monto:</h4>
            </div>
          )}
          {socialSecurity.map(data => (
            <div key={data} className={`w-full lg:h-5 lgMax:mb-4 `}>
              <div className={`flex lgMax:flex-col lgMax:gap-1 gap-3 ${socialFormData.socialSecurity[data].checked ? '' : 'hidden'}`}>
                {breakpoint && <h4 className='font-semibold underline'>{data}</h4>}
                <div className='lg:w-[25%] w-full'>
                  <TextInput
                    label={breakpoint ? '¿Quién la cobra?' : ''}
                    divclass='block'
                    name='whoCollectsIt'
                    labelclass=''
                    inputclass=''
                    value={socialFormData.socialSecurity[data].whoCollectsIt}
                    onChange={e => handleSocialSecurity(e, data)}
                  />
                </div>
                <div className='lg:w-[50%] w-full'>
                  <TextInput
                    label={breakpoint ? 'Observaciones:' : ''}
                    divclass='block'
                    name='obs'
                    labelclass=''
                    inputclass=''
                    value={socialFormData.socialSecurity[data].obs}
                    onChange={e => handleSocialSecurity(e, data)}
                  />
                </div>
                <div className='lg:w-[25%] w-full'>
                  <TextInput
                    label={breakpoint ? 'Monto:' : ''}
                    divclass='block'
                    name='amount'
                    labelclass=''
                    inputclass=''
                    value={socialFormData.socialSecurity[data].amount}
                    onChange={e => handleSocialSecurity(e, data)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SocialSecurity;
