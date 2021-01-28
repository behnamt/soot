import React, { useState, useEffect, useContext } from 'react';
import reportStorage from '@services/storage/ReportStorage';
import { useSoot } from './Soot';
import { useWeb3 } from './Web3';
import { useToast } from './Toast';
import { IRepeatedEvent } from '@interfaces/Event.types';

interface EventsContextInterface {
  events: string[];
  proposedNotifications: {
    [name: string]: string[];
  };
  addReportEvent: (name: string) => void;
}
const eventsContext = React.createContext<EventsContextInterface>({
  events: null,
  proposedNotifications: null,
  addReportEvent: () => null,
});

const useEvents = (): EventsContextInterface => useContext(eventsContext);

const useEventsprovider = (): EventsContextInterface => {
  const [events, setEvents] = useState<string[]>([]);

  const [proposedNotifications, setProposedNotifications] = useState({});

  const { sootRegistryFacade } = useSoot();
  const { account } = useWeb3();
  const { add } = useToast();

  const fetchMyReports = async (): Promise<void> => {
    const myReports = await sootRegistryFacade.getAllIncidentsForVictim();
    const reportedNames = myReports.map((item) => item.name);
    setEvents(reportedNames);
  };

  const addReportEvent = (name: string): void => {
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
        const newProposedNotifications = { ...proposedNotifications };
        const allRepeatedEvents = await sootRegistryFacade.getAllRepeatedEvents();
        allRepeatedEvents.forEach((event: IRepeatedEvent) => {
          const temp = newProposedNotifications[event.name] || [];
          if (!temp.some((item) => item === event.author)) {
            add(`There is another incident regarding ${event.name}`);
            temp.push(event.author);
            newProposedNotifications[event.name] = temp;
          }
        });
        setProposedNotifications(newProposedNotifications);
      }
    })();
  }, [events, sootRegistryFacade]);

  useEffect(() => {
    (async (): Promise<void> => {
      if (sootRegistryFacade && account) {
        if (await reportStorage.isReportStorageEmpty()) {
          await fetchMyReports();
        } else {
          setEvents(await reportStorage.getAllReports());
        }
      }
    })();
  }, [sootRegistryFacade, account]);

  return { events, proposedNotifications, addReportEvent };
};

const EventsProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const events = useEventsprovider();

  return <eventsContext.Provider value={events}>{children}</eventsContext.Provider>;
};

export { EventsProvider, useEvents };
