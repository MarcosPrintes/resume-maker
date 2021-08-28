import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { v4 as uuid } from 'uuid';

import { Certification, useResume } from '@/contexts/Resume';
import Input from '@/components/base/Input';
import Modal from '@/components/base/Modal';
import Button from '@/components/base/Button';
import { Grid } from '@/style/global';
import Textarea from '@/components/base/Textarea';
import CrudList from '../CrudList';

const schema = yup.object().shape({
  title: yup.string().required('Campo obrigatório'),
  issuer: yup.string().required('Campo obrigatório'),
  date: yup.string().required('Campo obrigatório'),
});

type FormData = {
  title: string;
  issuer: string;
  date: string;
  summary: string;
};

const AwardsForm: React.FC = () => {
  const intl = useIntl();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const { state: contextState, updateState } = useResume();
  const emptyMessage = intl.formatMessage(
    { id: 'sidebar.crudList.emptyMessage' },
    {
      gender: 'female',
      name: intl.formatMessage({ id: 'global.certification' }).toLowerCase(),
    },
  );

  useEffect(() => {
    updateState({
      ...contextState,
      certifications,
    });
  }, [certifications]);

  const handleFormSubmit = (data: FormData) => {
    if (currentId) {
      const updatedItems = certifications.map((award) => {
        if (award.id === currentId) {
          return { id: award.id, ...data };
        }
        return award;
      });
      setCertifications(updatedItems);
      setCurrentId('');
    } else {
      setCertifications([...certifications, { id: uuid(), ...data }]);
    }
    reset();
    setShowModal(false);
  };

  const onEdit = (id: string) => {
    const award = certifications.find((sn) => sn.id === id);
    if (award) {
      setCurrentId(award.id);
      setValue('title', award.title);
      setValue('issuer', award.issuer);
      setValue('date', award.date);
      setValue('summary', award.summary);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    reset();
  };

  const handleDelete = (id: string) => {
    setCertifications(certifications.filter((project) => project.id !== id));
  };

  return (
    <>
      <CrudList
        items={certifications}
        propertyToShow="title"
        emptyMessage={emptyMessage}
        onAdd={() => setShowModal(true)}
        onEdit={onEdit}
        onDelete={handleDelete}
      />

      <Modal show={showModal} close onCloseModal={closeModal}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Modal.Header>
            <FormattedMessage id="global.certifications" />
          </Modal.Header>
          <Modal.Content>
            <Input
              label={intl.formatMessage({ id: 'sidebar.form.certifications.title' })}
              error={errors.title?.message}
              {...register('title')}
            />
            <Grid columns="1fr 1fr">
              <Input
                marginTop="2.6rem"
                label={intl.formatMessage({ id: 'sidebar.form.certifications.issuer' })}
                error={errors.issuer?.message}
                {...register('issuer')}
              />
              <Input
                type="date"
                label={intl.formatMessage({ id: 'sidebar.form.certifications.date' })}
                marginTop="2.6rem"
                error={errors.date?.message}
                {...register('date')}
              />
            </Grid>
            <Textarea
              label={intl.formatMessage({ id: 'sidebar.form.certifications.summary' })}
              marginTop="2.6rem"
              {...register('summary')}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button type="button" small outline onClick={() => closeModal()}>
              <FormattedMessage id="global.close" />
            </Button>
            <Button type="submit" small>
              <FormattedMessage id={currentId ? 'global.update' : 'global.add'} />
            </Button>
          </Modal.Actions>
        </form>
      </Modal>
    </>
  );
};

export default AwardsForm;