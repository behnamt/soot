import React, { useState, useEffect, PropsWithChildren, useContext } from 'react';
import reportStorage from '../lib/services/storage/ReportStorage';
import { useSoot } from './Soot';
import { useWeb3 } from './Web3';
import { useToast } from './ToastContext';
import { IRepeatedEvent } from '../@types/Event.types';

interface EventsContextInterface {
  events: string[];
  proposedNotifications: {
    [name: string]: string[];
  };
  addReportEvent: Function;
}
const eventsContext = React.createContext<EventsContextInterface>({
  events: null,
  proposedNotifications: null,
  addReportEvent: () => null,
});

const useEvents = () => useContext(eventsContext);

const useEventsprovider = (): EventsContextInterface => {
  const [events, setEvents] = useState<string[]>([]);

  const [proposedNotifications, setProposedNotifications] = useState({});

  const { sootRegistryFacade } = useSoot();
  const { account } = useWeb3();
  const { add } = useToast();

  const fetchMyReports = async () => {
    const myReports = await sootRegistryFacade.getAllIncidentsForVictim(account.address);
    const reportedNames = myReports.map((item) => item.name);
    setEvents(reportedNames);
  };

  const addReportEvent = (name: string) => {
    setEvents([...events, name]);
  };

  useEffect(() => {
    if (events.length) {
      reportStorage.setReports(events);
    }
  }, [events]);

  useEffect((): void => {
    (async (): Promise<void> => {
      if (sootRegistryFacade && events.length) {
        let newProposedNotifications = {...proposedNotifications};
        const allRepeatedEvents = await sootRegistryFacade.getAllRepeatedEvents();
        allRepeatedEvents.forEach((event: IRepeatedEvent)=>{
          const temp = newProposedNotifications[event.name] || [];
          if (!temp.some((item) => item === event.author)){
            add(`There is another incident regarding ${event.name}`);
            temp.push(event.author);
            newProposedNotifications[event.name] = temp;
          }

        });
        setProposedNotifications(newProposedNotifications);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, sootRegistryFacade]);

  useEffect(() => {
    (async () => {
      if (sootRegistryFacade && account) {
        if (await reportStorage.isReportStorageEmpty()) {
          await fetchMyReports();
        } else {
          setEvents(await reportStorage.getAllReports());
        }
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sootRegistryFacade, account]);

  return { events, proposedNotifications, addReportEvent };
};

const EventsProvider = ({ children }: PropsWithChildren<any>) => {
  const events = useEventsprovider();

  return <eventsContext.Provider value={events}>{children}</eventsContext.Provider>;
};

export { EventsProvider, useEvents };
