import { faArrowLeft } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getDoctors } from '@root/apis/doctors';
import { getProcedures } from '@root/apis/procedures';
import LogoIcon from '@root/assets/images/logo.png';
import { LogoutButton } from '@root/components/LogoutButton';
import Spinner from '@root/components/Spinner';
import { useAuthContext } from '@root/hooks/useAuthContext';
import { useFhirContext } from '@root/hooks/useFhirContext';
import { TimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import ErrorWrapper from '@root/components/ErrorWrapper';
import { combineDate, getMinimumReservationDate } from '@root/utils/date';
import { createReservation } from '@root/apis/reservations';
import { hasUserAccessPage } from '@root/utils/auth';

export interface IReservationRequest {
  FACILITYID: string;
  RESERVEDBY: string;
  RESERVATIONDATE?: Date;
  TECHONLY: boolean;
  COMMENTS: string;
  REQSTART: string;
  REQEND: string;
  CASEDATE: string;
  SCHEDULEREMAIL: string;
  SCHEDULERPHONE: string;
  PROCEDUREID: string;
  DOCTORID: string;
  SCHEDULER: string;
  PATIENT: string;
}

export default function ReservationSubmitPage() {
  const [isProcessing, setProcessing] = useState(false);
  const { username } = useAuthContext();
  const navigate = useNavigate();
  const [procedureOptions, setProcedureOptions] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const { patient } = useFhirContext();
  const { register, getValues, setValue, handleSubmit, formState: { errors }, setError, control, watch } = useForm<IReservationRequest>({
    defaultValues: {
      FACILITYID: '5670',
      RESERVEDBY: username,
      TECHONLY: false,
      COMMENTS: ""
    }
  });
  const { userAccess } = useFhirContext();
  
  useEffect(() => {
    if (!hasUserAccessPage(userAccess))
      navigate('/splash');
  }, [userAccess]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProcessing(true);
        const doctorsData = await getDoctors();
        const proceduresData = await getProcedures();
        const doctorOptions = doctorsData.map((d: any) => ({
          value: d.DOCTORID,
          label: d.NAME
        }));
        const procedureOptions = proceduresData.map((p: any) => ({
          value: p.PROCEDUREID,
          label: p.DESCR,
        }));
        setDoctorOptions(doctorOptions);
        setProcedureOptions(procedureOptions);
        const patientName = patient?.name?.find((n) => n.use === "usual")?.text || '';
        setValue('PATIENT', patientName);
      } catch (err) {
        console.log("Error while fetching doctors/procedures data: ", err);
        alert("Error while fetching doctors/procedures data");
      } finally {
        setProcessing(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async () => {
    const values = getValues();
    const formData = {
      ...values,
      REQSTART: combineDate(values.RESERVATIONDATE!, values.REQSTART),
      REQEND: combineDate(values.RESERVATIONDATE!, values.REQEND),
      CASEDATE: combineDate(values.RESERVATIONDATE!, values.REQEND)
    };
    try {
      await createReservation(formData);
      navigate("/reservation/calendar");
    } catch (err) {
      setError('root.server', {
        message: 'Something went wrong. Please try again some time later'
      });
    }
  };
  
  return (
    <div className="flex flex-col lg:mt-[80px] lg:mb-8 mx-auto w-fit pl-10 lg:pl-6 pr-6 bg-white border rounded-3xl">
      <LogoutButton />
      <div
        className="relative px-4 sm:px-6 lg:px-8 pb-6 max-w-[800px]"
      >
        <div className="text-center mb-6">
          <div className="mb-2">
            <img
              className="mt-4 inline-flex rounded-full"
              src={LogoIcon}
              alt="User"
            />
          </div>
          <h1 className="text-2xl leading-snug text-gray-800 font-semibold mb-2">
            Make New Reservation
          </h1>
          <div className="text-sm text-red-500">
            Note: The system will only accept reservations for cases scheduled 36 hours in advance. Reservation made must be for after {getMinimumReservationDate()}. If you would like to make a reservation within 36 hours, please call our Scheduling Department at 800.660.6162, Option 1.
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} action='#'>
          <div className='font-medium'>
            <div className="space-y-4 text-left mt-8">
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Select Date For New Reservation
                  </label>
                  <Controller
                    control={control}
                    name='RESERVATIONDATE'
                    render={({ field: { onChange, value } }) => (
                      <ReactDatePicker
                        selected={value}
                        onChange={date => onChange(date)}
                        isClearable
                        className='input-field'
                      />
                    )}
                    rules={
                      {
                        required: {
                          value: true,
                          message: 'Please input reservation date!'
                        },
                        validate: () => {
                          const current = dayjs().add(watch('REQSTART') ? 36 : 24, "hours");
                          const startDate = combineDate(watch('RESERVATIONDATE') || new Date(), `${watch('REQSTART') || '2024-01-01 00:00:00'}`);
                          if (current.isBefore(startDate)) {
                            return true;
                          } else {
                            return 'This schedule request is within 36 hours of the requested Case time.';
                          }
                        }
                      }
                    }
                  />
                  <ErrorWrapper>{errors.RESERVATIONDATE?.message}</ErrorWrapper>
                </div>
                <div className='flex flex-1 gap-2'>
                  <div className="max-w-44 flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Preferred Start Time
                    </label>
                    <TimePickerComponent
                      allowEdit={false}
                      className={`input-field !h-6`}
                      step={15}
                      openOnFocus={true}
                      max={new Date(watch('REQEND') || new Date().setHours(23, 44, 59, 0))}
                      {...register('REQSTART', {
                        required: {
                          value: true,
                          message: 'Please input your preferred start time!'
                        }
                      })}
                    />
                    <ErrorWrapper>{errors.REQSTART?.message}</ErrorWrapper>
                  </div>
                  <div className="max-w-44 flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Preferred End Time
                    </label>
                    <TimePickerComponent
                      allowEdit={false}
                      className={`input-field !h-6`}
                      step={15}
                      openOnFocus={true}
                      min={new Date(watch('REQSTART') || new Date().setHours(0, 15, 0, 0))}
                      {...register('REQEND', {
                        required: {
                          value: true,
                          message: 'Please input your preferred end time!'
                        }
                      })}
                    />
                    <ErrorWrapper>{errors.REQEND?.message}</ErrorWrapper>
                  </div>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Select Medical Procedure
                  </label>
                  <select className='input-field' {...register('PROCEDUREID', {
                      required: {
                        value: true,
                        message: 'Please select procedure info!'
                      }
                    })}>
                    <option value={''}>Select an option</option>
                    {procedureOptions.map((proc: any) => (
                      <option key={proc.value} value={proc.value}>{proc.label}</option>
                    ))}
                  </select>
                  <ErrorWrapper>{errors.PROCEDUREID?.message}</ErrorWrapper>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Select Doctor
                  </label>
                  <select className='input-field' {...register('DOCTORID', {
                      required: {
                        value: true,
                        message: 'Please select your doctor!'
                      }
                    })}>
                    <option value={''}>Select an option</option>
                    {doctorOptions.map((doc: any) => (
                      <option key={doc.value} value={doc.value}>{doc.label}</option>
                    ))}
                  </select>
                  <ErrorWrapper>{errors.DOCTORID?.message}</ErrorWrapper>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex gap-2 items-center">
                  <label className="text-sm font-medium">
                    Tech Only
                  </label>
                  <input
                    className={`!bg-gray-50 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600`}
                    type="checkbox"
                    {...register('TECHONLY')}
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Patient Name
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    readOnly={true}
                    {...register('PATIENT', {
                      required: {
                        value: true,
                        message: 'Please input patient name!'
                      }
                    })}
                  />
                  <ErrorWrapper>{errors.PATIENT?.message}</ErrorWrapper>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Scheduler Name
                  </label>
                  <input
                    className={`input-field`}
                    type="text"
                    {...register('SCHEDULER', {
                      required: {
                        value: true,
                        message: 'Please input scheduler name!'
                      }
                    })}
                  />
                  <ErrorWrapper>{errors.SCHEDULER?.message}</ErrorWrapper>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  <input
                    className={`input-field`}
                    type="text"
                    {...register('SCHEDULERPHONE', {
                      required: {
                        value: true,
                        message: 'Please input scheduler phone!'
                      },
                      pattern: {
                        value: /^\d{3}-\d{3}-\d{4}$/,
                        message: 'Phone number should be xxx-xxx-xxxx!'
                      }
                    })}
                  />
                  <ErrorWrapper>{errors.SCHEDULERPHONE?.message}</ErrorWrapper>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    className={`input-field`}
                    type="text"
                    {...register('SCHEDULEREMAIL', {
                      required: {
                        value: true,
                        message: 'Please input scheduler email!'
                      }
                    })}
                  />
                  <ErrorWrapper>{errors.SCHEDULEREMAIL?.message}</ErrorWrapper>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Comment
                  </label>
                  <textarea
                    className={`textarea-field`}
                    {...register('COMMENTS')}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='flex justify-between mt-4'>
            <Link to="/reservation/calendar" className='flex items-center gap-1 text-md'>
              <FontAwesomeIcon icon={faArrowLeft} />
              View List
            </Link>
            <button
              type="submit"
              className="btn-warning w-40"
              disabled={isProcessing}
            >
              {isProcessing && <Spinner />}
              Submit
            </button>
          </div>
          <ErrorWrapper>{errors.root?.server.message}</ErrorWrapper>
        </form>
      </div>
    </div>
  );
}
