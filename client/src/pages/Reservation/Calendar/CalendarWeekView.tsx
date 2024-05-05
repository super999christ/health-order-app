import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import { useMediaQuery } from "@uidotdev/usehooks";
import { isSelectedDate } from "@root/utils/date";
import { classNames } from "@root/utils/style";
import { DateConst } from "@root/constants/date";
import { useFhirContext } from "@root/hooks/useFhirContext";
import { useNavigate } from "react-router";
import { hasUserAccessPage } from "@root/utils/auth";

interface ICalendarWeekViewProps {
  days: any;
  year: any;
  month: any;
  day: any;
  setYear: any;
  setMonth: any;
  setDay: any;
  setViewAllEvents: any;
}

export default function CalendarWeekView({ days, year, month, day, setYear, setMonth, setDay, setViewAllEvents }: ICalendarWeekViewProps) {
  const container = useRef(null);
  const containerNav = useRef(null);
  const containerOffset = useRef(null);

  const isMobileDevice = useMediaQuery("only screen and (max-width : 640px)");

  const { userAccess } = useFhirContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!hasUserAccessPage(userAccess))
      navigate('/splash');
  }, [userAccess]);

  const onSelectDay = (dayItem: any) => {
    setYear(dayItem.date.getFullYear());
    setMonth(dayItem.date.getMonth());
    setDay(dayItem.date.getDate());
    setViewAllEvents(false);
  };

  const getEvents = () => {
    let dayItems = days;
    if (isMobileDevice) {
      dayItems = days.filter((dayItem: any) => isSelectedDate(dayItem.date, year, month, day));
    }
    const events = [];
    for (const dayItem of dayItems) {
      events.push(...dayItem.events);
    }
    for (const event of events) {
      if (isMobileDevice)
        event.colStart = 1;
      else
        event.colStart = event.startDate.getDay() + 1;
    }
    return events;
  }

  const getSpanSize = (event: any) => {
    return Math.ceil((event.endDate.getTime() - event.startDate.getTime()) / 1000 / 60 * 0.2);
  };

  const getSpanStartingPosition = (event: any) => {
    return 2 + 12 * (event.startDate.getHours() + Math.ceil(event.startDate.getMinutes() / 15) * 15 / 60);
  };

  return (
    <div ref={container} className="isolate flex flex-auto flex-col overflow-auto bg-white min-w-[320px]">
      <div style={{ width: '165%' }} className="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full">
        <div
          ref={containerNav}
          className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8 border-l border-gray-100"
        >
          <div className="grid grid-cols-7 text-sm leading-6 text-gray-500 sm:hidden">
            {DateConst.dayLetterNames.map((dayName: string, i: number) => (
              <button
                type="button" className="flex flex-col items-center pb-3 pt-2 hover:bg-gray-100 cursor-pointer"
                key={dayName}
                onClick={() => onSelectDay(days[i])}
              >
                {dayName}{" "}
                <span
                  className={classNames("mt-1 flex h-8 w-8 items-center justify-center", !isSelectedDate(days[i].date, year, month, day) ? "font-semibold text-gray-900" : "rounded-full bg-indigo-600 font-semibold text-white")}
                >
                  {days[i].date.getDate()}
                </span>
              </button>  
            ))}
          </div>

          <div className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-500 sm:grid">
            <div className="col-end-1 w-14" />
            {DateConst.dayShortNames.map((dayName: string, i: number) => (
              <div
                className="flex items-center justify-center py-3 hover:bg-gray-100 cursor-pointer"
                key={dayName}
                onClick={() => onSelectDay(days[i])}
              >
                <span className="flex items-baseline">
                  {dayName}&nbsp;
                  <span className={classNames(!isSelectedDate(days[i].date, year, month, day) ? "items-center justify-center font-semibold text-gray-900" : "ml-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white")}>
                    {days[i].date.getDate()}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-auto">
          <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100 border-l border-l-gray-100" />
          <div className="grid flex-auto grid-cols-1 grid-rows-1">
            {/* Horizontal lines */}
            <div
              className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
              style={{ gridTemplateRows: 'repeat(24, minmax(3.5rem, 1fr))' }}
            >
              <div ref={containerOffset} className="row-end-1 h-7"></div>
              {DateConst.hourNames.map((hourName: string) => (
                <div key={hourName}>
                  <div>
                    <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      {hourName}
                    </div>
                  </div>
                  <div />
                </div> 
              ))}
            </div>

            {/* Vertical lines */}
            <div className="col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x divide-gray-100 sm:grid sm:grid-cols-7">
              <div className="col-start-1 row-span-full" />
              <div className="col-start-2 row-span-full" />
              <div className="col-start-3 row-span-full" />
              <div className="col-start-4 row-span-full" />
              <div className="col-start-5 row-span-full" />
              <div className="col-start-6 row-span-full" />
              <div className="col-start-7 row-span-full" />
              <div className="col-start-8 row-span-full w-8" />
            </div>

            {/* Events */}
            <ol
              className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
              style={{ gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto' }}
            >
              {getEvents().map(event => (
                  <li
                    className={`relative mt-px flex col-start-${event.colStart}`}
                    style={{ gridRow: `${getSpanStartingPosition(event)} / span ${getSpanSize(event)}` }}
                    key={event.id}
                  >
                    <div
                      className={classNames(
                        "group absolute inset-1 flex flex-col rounded-lg bg-blue-50 text-xs leading-5 hover:bg-blue-100 cursor-pointer",
                        getSpanSize(event) < 12 ? "p-2" : "p-0"
                      )}
                    >
                      <p className="order-1 font-semibold text-blue-700">{event.name}</p>
                      <p className="text-blue-500 group-hover:text-blue-700">
                        <time dateTime="2022-01-12T06:00">{dayjs(event.startDate).format("hh:mm A")}</time>
                      </p>
                    </div>
                  </li>
                ))
              }
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}