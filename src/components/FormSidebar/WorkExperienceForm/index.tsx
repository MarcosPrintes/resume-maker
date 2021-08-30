import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { v4 as uuid } from 'uuid';

import { useResume, WorkExperience } from '@/contexts/Resume';
import Input from '@/components/base/Input';
import Modal from '@/components/base/Modal';
import Button from '@/components/base/Button';
import { Grid } from '@/style/global';
import Textarea from '@/components/base/Textarea';
import CrudList from '../CrudList';

const schema = yup.object().shape({
  company: yup.string().required('Campo obrigatório'),
  position: yup.string().required('Campo obrigatório'),
  startDate: yup.string().required('Campo obrigatório'),
  endDate: yup.string().required('Campo obrigatório'),
});

type FormData = {
  company: string;
  position: string;
  website: string;
  startDate: string;
  endDate: string;
  summary: string;
};

const WorkExperienceForm: React.FC = () => {
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
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const { state: contextState, updateState } = useResume();
  const emptyMessage = intl.formatMessage(
    { id: 'sidebar.crudList.emptyMessage' },
    {
      gender: 'female',
      name: intl.formatMessage({ id: 'global.experience' }).toLowerCase(),
    },
  );

  useEffect(() => {
    updateState({
      ...contextState,
      workExperience: experiences,
    });
  }, [experiences]);

  const onSubmit = (data: FormData) => {
    if (currentId) {
      const updatedExperiences = experiences.map((experience) => {
        if (experience.id === currentId) {
          return { id: experience.id, ...data };
        }
        return experience;
      });
      setExperiences(updatedExperiences);
      setCurrentId('');
    } else {
      setExperiences([...experiences, { id: uuid(), ...data }]);
    }
    reset();
    setShowModal(false);
  };

  const onEdit = (id: string) => {
    const experience = experiences.find((sn) => sn.id === id);
    if (experience) {
      setCurrentId(experience.id);
      setValue('company', experience.company);
      setValue('position', experience.position);
      setValue('website', experience.website);
      setValue('startDate', experience.startDate);
      setValue('endDate', experience.endDate);
      setValue('summary', experience.summary);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    reset();
  };

  const deleteNetwork = (id: string) => {
    setExperiences(experiences.filter((experience) => experience.id !== id));
  };

  return (
    <>
      <CrudList
        items={experiences}
        propertyToShow="company"
        emptyMessage={emptyMessage}
        onAdd={() => setShowModal(true)}
        onEdit={onEdit}
        onDelete={deleteNetwork}
      />

      <Modal show={showModal} close onCloseModal={closeModal}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header>
            <FormattedMessage id={currentId ? 'global.update' : 'global.add'} />{' '}
            <FormattedMessage id="global.experience" />
          </Modal.Header>
          <Modal.Content>
            <Grid columns="1fr 1fr">
              <Input
                label={intl.formatMessage({ id: 'sidebar.form.workExperience.company' })}
                error={errors.company?.message}
                {...register('company')}
              />
              <Input
                label={intl.formatMessage({ id: 'sidebar.form.workExperience.position' })}
                error={errors.position?.message}
                {...register('position')}
              />
            </Grid>
            <Input
              label={intl.formatMessage({ id: 'sidebar.form.workExperience.website' })}
              marginTop="2.6rem"
              error={errors.website?.message}
              {...register('website')}
            />
            <Grid columns="1fr 1fr">
              <Input
                type="date"
                label={intl.formatMessage({ id: 'sidebar.form.workExperience.startDate' })}
                marginTop="2.6rem"
                error={errors.startDate?.message}
                {...register('startDate')}
              />
              <Input
                type="date"
                label={intl.formatMessage({ id: 'sidebar.form.workExperience.endDate' })}
                marginTop="2.6rem"
                error={errors.endDate?.message}
                {...register('endDate')}
              />
            </Grid>
            <Textarea
              marginTop="2.6rem"
              label={intl.formatMessage({ id: 'sidebar.form.workExperience.summary' })}
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

export default WorkExperienceForm;
