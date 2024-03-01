import { Bullet } from "@root/components/Bullet";
import { isSelectedDate, isToday } from "@root/utils/date";
import { classNames } from "@root/utils/style";

interface ICalendarMonthViewProps {
  days: any[];
  year: any;
  month: any;
  day: any;
  setYear: any;
  setMonth: any;
  setDay: any;
  onViewEvent: any;
  setViewAllEvents: any;
}

export default function CalendarMonthView({ days, year, month, day, setYear, setMonth, setDay, onViewEvent, setViewAllEvents }: ICalendarMonthViewProps) {
  const onSelectDay = (dayItem: any) => {
    setYear(dayItem.date.getFullYear());
    setMonth(dayItem.date.getMonth());
    setDay(dayItem.date.getDate());
    setViewAllEvents(false);
  };

  return (
    <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
      <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-5 text-gray-700 lg:flex-none">
        <div className="bg-white py-2">
          S<span className="sr-only sm:not-sr-only">un</span>
        </div>
        <div className="bg-white py-2">
          M<span className="sr-only sm:not-sr-only">on</span>
        </div>
        <div className="bg-white py-2">
          T<span className="sr-only sm:not-sr-only">ue</span>
        </div>
        <div className="bg-white py-2">
          W<span className="sr-only sm:not-sr-only">ed</span>
        </div>
        <div className="bg-white py-2">
          T<span className="sr-only sm:not-sr-only">hu</span>
        </div>
        <div className="bg-white py-2">
          F<span className="sr-only sm:not-sr-only">ri</span>
        </div>
        <div className="bg-white py-2">
          S<span className="sr-only sm:not-sr-only">at</span>
        </div>
      </div>
      <div className="flex bg-gray-200 text-xs leading-5 text-gray-700 lg:flex-auto">
        <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
          {days.map((dayItem) => (
            <div
              key={dayItem.date.toString()}
              className={classNames(
                dayItem.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-500',
                'relative px-3 py-2 hover:bg-gray-100 cursor-pointer h-[104px]'
              )}
              onClick={() => onSelectDay(dayItem)}
            >
              <time
                dateTime={dayItem.date.toString()}
                className={
                  classNames(
                    isSelectedDate(dayItem.date, year, month, day)
                      ? 'flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white'
                      : undefined
                  )
                }
              >
                {dayItem.date.getDate()}
              </time>
              {dayItem.events.length > 0 && (
                <ol className="mt-2">
                  {dayItem.events.slice(0, 2).map((event: any) => (
                    <li key={event.id} onClick={() => onViewEvent(event)}>
                      <div className="group flex">
                        <p className="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600">
                          <Bullet status={event.type} /> {event.name}
                        </p>
                        <time
                          dateTime={event.startDate}
                          className="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                        >
                          {event.time}
                        </time>
                      </div>
                    </li>
                  ))}
                  {dayItem.events.length > 2 && <li className="text-gray-500">+ {dayItem.events.length - 2} more</li>}
                </ol>
              )}
            </div>
          ))}
        </div>
        <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
          {days.map((dayItem) => (
            <button
              key={dayItem.date.toString()}
              type="button"
              className={classNames(
                dayItem.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                (isSelectedDate(dayItem.date, year, month, day) || isToday(dayItem.date)) && 'font-semibold',
                isSelectedDate(dayItem.date, year, month, day) && 'text-white',
                !isSelectedDate(dayItem.date, year, month, day) && isToday(dayItem.date) && 'text-indigo-600',
                !isSelectedDate(dayItem.date, year, month, day) && dayItem.isCurrentMonth && !isToday(dayItem.date) && 'text-gray-900',
                !isSelectedDate(dayItem.date, year, month, day) && !dayItem.isCurrentMonth && !isToday(dayItem.date) && 'text-gray-500',
                'flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10'
              )}
              onClick={() => onSelectDay(dayItem)}
            >
              <time
                dateTime={dayItem.date.toString()}
                className={classNames(
                  isSelectedDate(dayItem.date, year, month, day) && 'flex h-6 w-6 items-center justify-center rounded-full',
                  isSelectedDate(dayItem.date, year, month, day) && isToday(dayItem.date) && 'bg-indigo-600',
                  isSelectedDate(dayItem.date, year, month, day) && !isToday(dayItem.date) && 'bg-gray-900',
                  'ml-auto'
                )}
              >
                {dayItem.date.getDate()}
              </time>
              <span className="sr-only">{dayItem.events.length} events</span>
              {dayItem.events.length > 0 && (
                <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                  {dayItem.events.map((event: any) => (
                    <span key={event.id} className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400" />
                  ))}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}