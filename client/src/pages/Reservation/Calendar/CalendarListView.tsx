import { Bullet } from "@root/components/Bullet";
import { useFhirContext } from "@root/hooks/useFhirContext";
import { hasUserAccessPage } from "@root/utils/auth";
import dayjs from "dayjs"
import { useEffect } from "react";
import { useNavigate } from "react-router";

interface ICalendarListViewProps {
  events: any;
  onViewEvent: any;
}

export default function CalendarListView({ events, onViewEvent }: ICalendarListViewProps) {
  const { userAccess } = useFhirContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!hasUserAccessPage(userAccess))
      navigate('/splash');
  }, [userAccess]);
  
  return (
    <section className="w-[300px]">
      <h2 className="text-base font-semibold leading-6 text-gray-900">Upcoming events</h2>
      <ol className="mt-2 divide-y divide-gray-200 text-sm leading-6 text-gray-500">
        {events.map((event: any) => (
          <li className="py-4 sm:flex sm:flex-wrap hover:bg-gray-100 cursor-pointer" onClick={() => onViewEvent(event)} key={event.id}>
            <Bullet status={event.type} className="mr-2" />
            <time dateTime={dayjs(event.startDate).format("YYYY-MM-DD")} className="w-28 flex-none">
              {event.startDate.toLocaleDateString('en-US', {
                weekday: 'short', 
                month: 'short',
                day: 'numeric'
              })}
            </time>
            {new Date() > event.startDate && (
              <p className="flex-1 sm:mt-0">{event.name}</p>
            )}
            {new Date() <= event.startDate && (
              <p className="flex-1 font-semibold text-gray-900 sm:mt-0">{event.name}</p>
            )}
            <p className="flex-1">{event.patient}</p>
            <p className="ml-4 flex-auto">
              Tech Only: {event.techonly ? "Yes" : "No"}
              {event.comments && (
                <>
                  <br />
                  Comments: {event.comments}
                </>
              )}
            </p>
          </li>
        ))}
        {!events.length && (
          <div className="text-gray-500 text-md py-4">
            No upcoming event
          </div>
        )}
      </ol>
    </section>
  )
}