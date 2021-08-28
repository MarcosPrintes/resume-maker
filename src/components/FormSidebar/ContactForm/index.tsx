import { ChangeEvent, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useResume } from '@/contexts/Resume';
import Input from '@/components/base/Input';

const ContactForm: React.FC = () => {
  const intl = useIntl();
  const [state, setState] = useState({
    phoneNumber: '',
    website: '',
    email: '',
  });
  const { state: contextState, updateState } = useResume();

  useEffect(() => {
    updateState({
      ...contextState,
      phoneNumber: state.phoneNumber,
      website: state.website,
      email: state.email,
    });
  }, [state]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    const { value } = event.target;

    setState({
      ...state,
      [name]: value,
    });
  };

  return (
    <>
      <Input
        label={intl.formatMessage({ id: 'sidebar.form.contact.phoneNumber' })}
        name="phoneNumber"
        value={state.phoneNumber}
        onChange={handleChange}
      />
      <Input
        label={intl.formatMessage({ id: 'sidebar.form.contact.website' })}
        name="website"
        value={state.website}
        marginTop="2.6rem"
        onChange={handleChange}
      />
      <Input
        label={intl.formatMessage({ id: 'sidebar.form.contact.email' })}
        type="email"
        name="email"
        value={state.email}
        marginTop="2.6rem"
        onChange={handleChange}
      />
    </>
  );
};

export default ContactForm;