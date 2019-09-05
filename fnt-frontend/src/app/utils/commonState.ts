import { useState } from 'react';

interface ITechTalk {
  id?: string;
  location?: string;
  topic: string;
  presenter: string;
  date: any;
  addiInfo: string;
  mobileNotify: boolean;
}

interface ISocialEvent {
  id?: string;
  location?: string;
  place: string;
  date: any;
  addiInfo: string;
  mobileNotify: boolean;
}

const initialTechTalkData = {
  topic: '',
  presenter: '',
  date: '',
  addiInfo: '',
  mobileNotify: false
};

const initialSocialEventData = {
  place: '',
  location: '',
  date: '',
  addiInfo: '',
  mobileNotify: false
};

export const useStateTechTalk = () => {
  const [techTalk, setTechTalk] = useState<ITechTalk>(initialTechTalkData);
  return {
    techTalk,
    setTechTalk,
    handleTextInputChangeTopic: (topic: string) => {
      setTechTalk({ ...techTalk, topic });
    },
    handleTextInputChangePresenter: (presenter: string) => {
      setTechTalk({ ...techTalk, presenter });
    },
    handleTextInputChangeDate: date => {
      setTechTalk({ ...techTalk, date });
    },
    handleTextInputChangeAddInfo: (addiInfo: string) => {
      setTechTalk({ ...techTalk, addiInfo });
    },
    handleTextInputChangeMobNotification: (mobileNotify: boolean) => {
      setTechTalk({ ...techTalk, mobileNotify });
    },
    handleTextInputChangeLocation: (location: string) => {
      setTechTalk({ ...techTalk, location });
    }
  };
};

export const useStateSocialEvent = () => {
  const [socialEvent, setSocialEvent] = useState<ISocialEvent>(initialSocialEventData);
  return {
    socialEvent,
    setSocialEvent,
    handleTextInputChangePlace: (place: string) => {
      setSocialEvent({ ...socialEvent, place });
    },
    handleTextInputChangeDate: date => {
      setSocialEvent({ ...socialEvent, date });
    },
    handleTextInputChangeAddInfo: (addiInfo: string) => {
      setSocialEvent({ ...socialEvent, addiInfo });
    },
    handleTextInputChangeMobNotification: (mobileNotify: boolean) => {
      setSocialEvent({ ...socialEvent, mobileNotify });
    },
    handleTextInputChangeLocation: (location: string) => {
      setSocialEvent({ ...socialEvent, location });
    }
  };
};
export const useVotesState = () => {
  const [votes, setVotes] = useState<number>(0);
  return {
    votes,
    setVotes
  };
};
export const useModalState = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return {
    isModalOpen,
    setIsModalOpen
  };
};
