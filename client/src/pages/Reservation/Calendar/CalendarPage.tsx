import { Fragment, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useState } from 'react'
import dayjs from 'dayjs'
import CalendarMonthView from './CalendarMonthView'
import CalendarWeekView from './CalendarWeekView'
import CalendarListView from './CalendarListView'
import { useNavigate } from 'react-router-dom'
import { getYearArray, isFirstDate, isSelectedDate, isToday } from '@root/utils/date'
import { classNames } from '@root/utils/style'
import { extractCustomerComment } from '@root/utils/reservation'
import { DateConst } from '@root/constants/date';
import { getReservations } from '@root/apis/reservations'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons'
import { LoadingOverlay } from '@root/components/LoadingOverlay'

enum VIEW_UNIT {
  DAY,
  WEEK,
  MONTH
}

const VIEW_UNIT_NAMES = ['Week view', 'Month view'];

export default function CalendarPage() {
  const [viewUnit, setViewUnit] = useState(VIEW_UNIT.MONTH);
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth());
  const [day, setDay] = useState(new Date().getDate());
  const [isLoading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<any[]>([]);
  const [reservationRawData, setReservationRawData] = useState<any[]>([]);
  const [isViewAllEvents, setViewAllEvents] = useState(true);
  const navigate = useNavigate();
  
  const [days, setDays] = useState<any[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        let data = await getReservations();
        data.sort((a: any, b: any) => dayjs(a.REQSTART).isAfter(dayjs(b.REQSTART)) ? 1 : -1);
        setReservationRawData(data);
        data = data.map((d: any) => ({ type: convertStatusClass(d.STATUS), startDate: new Date(d.REQSTART), endDate: new Date(d.REQEND), id: d.CASEQCID, patient: d.PATIENT, techonly: d.TECHONLY === 'True', comments: extractCustomerComment(d.COMMENTS) }))
        setReservations(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    fetchReservations();
  }, []);

  useEffect(() => {
    setDays(getDayItemsInMonth(year, month, day));
  }, [year, month, reservations]);

  const convertStatusClass = (status: string) => {
    switch(status) {
      case "Accepted":
        return "success";
      case "Pending":
        return "warning";
      default:
        return "error";
    }
  }

  const getDayItemsInMonth = (year: number, month: number, day: number) => {
    const days = [];
    const daysInMonth = dayjs(new Date(year, month, day)).daysInMonth();
    const startingDayInWeek = dayjs(new Date(year, month, 1)).day();
    // Previous Month
    for (let i = startingDayInWeek - 1; i >= 0; i--) {
      const dayItem = {
        date: dayjs(new Date(year, month, 1)).subtract(i + 1, 'day').toDate(),
        isCurrentMonth: false,
        events: []
      };
      days.push(dayItem);
    }
    // Current Month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayItem = {
        date: dayjs(new Date(year, month, i)).toDate(),
        isCurrentMonth: true,
        events: []
      };
      days.push(dayItem);
    }
    // Next Month
    const endingDayInWeek = dayjs(new Date(year, month, daysInMonth)).day();
    for (let i = endingDayInWeek + 1; i < 7; i++) {
      const dayItem = {
        date: dayjs(new Date(year, month, daysInMonth)).add(i - endingDayInWeek, 'day').toDate(),
        isCurrentMonth: false,
        events: []
      };
      days.push(dayItem);
    }
    // 6th row in the calendar
    if (days.length < 42) {
      for (let i = 0; i < 7; i++) {
        const dayItem: any = {
          date: dayjs(days[days.length - 1].date).add(1, 'day').toDate(),
          isCurrentMonth: false,
          events: []
        };
        days.push(dayItem);
      }
    }
    // Update day items with reservations
    for (const reservation of reservations) {
      const resDateStr = dayjs(reservation.startDate).format("YYYY-MM-DD");
      const resDayItem = days.find(dayItem => dayjs(dayItem.date).format("YYYY-MM-DD") === resDateStr);
      if (resDayItem) {
        resDayItem.events.push({
          id: reservation.id,
          name: `${dayjs(reservation.startDate).format("hh:mm A")} - ${dayjs(reservation.endDate).format("hh:mm A")}`,
          patient: reservation.patient,
          startDate: reservation.startDate,
          endDate: reservation.endDate,
          techonly: reservation.techonly,
          comments:  reservation.comments,
          href: '#',
          type: reservation.type
        })
      }
    }
    return days;
  }

  const getCurrentDate = () => {
    if (viewUnit === VIEW_UNIT.DAY)
      return `${DateConst.monthNames[month]} ${day}, ${year}`;
    else
      return `${DateConst.monthNames[month]} ${year}`;
  };

  const getCurrentWeekDays = () => {
    let selectedDayItem = days.find(dayItem => isSelectedDate(dayItem.date, year, month, day));
    if (!selectedDayItem)
      selectedDayItem = days.find(dayItem => isToday(dayItem.date));
    if (!selectedDayItem)
      selectedDayItem = days.find(dayItem => isFirstDate(dayItem.date));
    if (selectedDayItem) {
      console.log({selectedDayItem});
      const selectedDate = selectedDayItem.date;
      const selectedDayIndex = days.map(day => day.date).indexOf(selectedDate);
      const dayInWeek = selectedDate.getDay();
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        weekDays.push(days[selectedDayIndex - dayInWeek + i]);
      }
      return weekDays;
    }
    return [];
  };

  const onPreviousClick = () => {
    let date;
    if (viewUnit === VIEW_UNIT.MONTH) {
      date = dayjs(new Date(year, month, 1)).subtract(1, 'month');
    } else {
      date = dayjs(new Date(year, month, day)).subtract(1, 'week');
    }
    setYear(date.year());
    setMonth(date.month());
    setDay(date.date());
    setViewAllEvents(true);
  };

  const onNextClick = () => {
    let date;
    if (viewUnit === VIEW_UNIT.MONTH) {
      date = dayjs(new Date(year, month, 1)).add(1, 'month');
    } else {
      date = dayjs(new Date(year, month, day)).add(1, 'week');
    }
    setYear(date.year());
    setMonth(date.month());
    setDay(date.date());
    setViewAllEvents(true);
  };

  const onSelectMonth = (month: number) => {
    setMonth(month);
    setDay(1);
  };

  const getEventList = () => {
    let selectedDays = days;
    if (!isViewAllEvents) {
      selectedDays = days.filter(dayItem => isSelectedDate(dayItem.date, year, month, day));
    }
    if (viewUnit == VIEW_UNIT.WEEK)
      selectedDays = getCurrentWeekDays();
    const events = [];
    for (const dayItem of selectedDays) {
      events.push(...dayItem.events);
    }
    return events;
  };

  const onToday = () => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setDay(now.getDate());
  };

  const onYearChange = (year: number) => {
    setYear(year);
    setViewAllEvents(true);
  };

  const onViewEvent = (event: any) => {
    const item = reservationRawData.find((r) => r.CASEQCID === event.id);
    localStorage.setItem("currentReservation", JSON.stringify(item));
    navigate("/detail");
  }

  const onViewUnitChange = (unit: number) => {
    setViewUnit(unit);
    setViewAllEvents(true);
  }

  return (
    <div>
      {isLoading && <LoadingOverlay />}
      <div className="lg:flex lg:h-full lg:flex-col">
        <header className="block sm:flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
          <h1 className="text-base whitespace-nowrap font-semibold leading-6 text-gray-900">
            <time dateTime="2022-01">{getCurrentDate()}</time>
          </h1>
          <div className="flex items-center flex-wrap gap-2 lg:gap-0 justify-end lg:justify-start">
            <div className="relative flex items-center rounded-md bg-white shadow-sm">
              <button
                type="button"
                className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
                onClick={() => onPreviousClick()}
              >
                <span className="sr-only">Previous year</span>
                <FontAwesomeIcon icon={faChevronLeft} className='h-5 w-5' />
              </button>
              <button
                type="button"
                className="w-14 h-9 border-y border-gray-300 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative block"
                onClick={() => onToday()}
              >
                Today
              </button>
              <button
                type="button"
                className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
                onClick={() => onNextClick()}
              >
                <span className="sr-only">Next year</span>
                <FontAwesomeIcon icon={faChevronLeft} className='h-5 w-5' />
              </button>
            </div>
            <div className="ml-4 flex items-center">
              <Menu as="div" className="relative">
                <Menu.Button
                  type="button"
                  className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  {DateConst.monthNames[month]}
                  <FontAwesomeIcon icon={faChevronLeft} className='-mr-1 h-5 w-5 text-gray-400' />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {DateConst.monthNames.map((monthName: string, index: number) => (
                        <Menu.Item key={monthName}>
                          <div
                            className={classNames(
                              month === index ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm', 'cursor-pointer hover:bg-gray-100'
                            )}
                            onClick={() => onSelectMonth(index)}
                          >
                            {monthName}
                          </div>
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            <div className="md:ml-4 flex items-center gap-2 flex-wrap lg:gap-0 justify-end lg:justify-start">
              <Menu as="div" className="relative">
                <Menu.Button
                  type="button"
                  className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 whitespace-nowrap"
                >
                  {VIEW_UNIT_NAMES[viewUnit]}
                  <FontAwesomeIcon icon={faChevronLeft} className='-mr-1 h-5 w-5 text-gray-400' />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {VIEW_UNIT_NAMES.map((name, index) => (
                        <Menu.Item key={name}>
                          <div
                            className={classNames(
                              index === viewUnit ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm', 'cursor-pointer hover:bg-gray-100'
                            )}
                            onClick={() => onViewUnitChange(index)}
                          >
                            {name}
                          </div>
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
              <div className="ml-6 hidden lg:block h-6 w-px bg-gray-300" />
              <Menu as="div" className="relative ml-2 md:ml-6">
                <Menu.Button
                  type="button"
                  className="flex rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {year}
                  <FontAwesomeIcon icon={faChevronLeft} className='-mr-1 h-5 w-5 text-gray-400' />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {getYearArray().map((yr: number) => (
                        <Menu.Item key={yr}>
                          <div
                            className={classNames(
                              year === yr ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm', 'cursor-pointer hover:bg-gray-100'
                            )}
                            onClick={() => onYearChange(yr)}
                          >
                            {yr}
                          </div>
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
              <div
                className="ml-2 cursor-pointer flex rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 whitespace-nowrap"
                onClick={() => navigate('/reservation')}
              >
                New Reservation
              </div>
            </div>
          </div>
        </header>
        {viewUnit === VIEW_UNIT.MONTH && (
          <div className='flex flex-col-reverse gap-5 sm:flex-row'>
            <div className='p-3 max-h-[378px] lg:max-h-[666px] overflow-auto'>
              <CalendarListView events={getEventList()} onViewEvent={onViewEvent} />
            </div>
            <div className='flex-1'>
              <CalendarMonthView
                days={days}
                year={year} setYear={setYear}
                month={month} setMonth={setMonth}
                day={day} setDay={setDay}
                onViewEvent={onViewEvent}
                setViewAllEvents={setViewAllEvents}
              />
            </div>
          </div>
        )}
        {viewUnit === VIEW_UNIT.WEEK && (
          <div className='flex flex-col-reverse gap-5 sm:flex-row'>
            <div className='p-3 max-h-[1428px] overflow-auto'>
              <CalendarListView events={getEventList()} onViewEvent={onViewEvent} />
            </div>
            <div className='flex-1 pr-3'>
              <CalendarWeekView
                days={getCurrentWeekDays()}
                year={year} setYear={setYear}
                month={month} setMonth={setMonth}
                day={day} setDay={setDay}
                setViewAllEvents={setViewAllEvents}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
