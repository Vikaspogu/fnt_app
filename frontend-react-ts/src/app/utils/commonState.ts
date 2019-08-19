import { useState } from 'react';

export const changeTopic = () => {
  const [topic, setTopic] =useState<string>('');
  return {
    topic,
    setTopic,
    handleTextInputChangeTopic: (topic) => {
      setTopic(topic);
    }
  };
};
export const changePresenter = () => {
  const [presenter, setPresenter] =useState<string>('');
  return {
    presenter,
    setPresenter,
    handleTextInputChangePresenter : (presenter) => {
      setPresenter(presenter);
    }
  };
};
export const changeLocation = () => {
  const [location, setLocation] =useState<string>('');
  return {
    location,
    setLocation,
    handleTextInputChangeLocation: (location) => {
      setLocation(location);
    }
  };
};
export const changeDate = () => {
  const [date, setDate] =useState<any>('');
  return {
    date,
    setDate,
    handleTextInputChangeDate: date => {
      setDate(date);
    }
  };
};
export const changeAddInfo = () => {
  const [addiInfo, setAddiInfo] =useState<string>('');
  return {
    addiInfo,
    setAddiInfo,
    handleTextInputChangeAddInfo: addiInfo => {
      setAddiInfo(addiInfo);
    }
  };
};
export const changeMobNotification = () => {
  const [mobileNotify, setMobileNotify] =useState<boolean>(false);
  return {
    mobileNotify,
    setMobileNotify,
    handleTextInputChangeMobNotification: mobileNotify => {
      setMobileNotify(mobileNotify);
    }
  };
};
export const changePlace = () => {
  const [place, setPlace] =useState<string>('');
  return {
    place,
    setPlace,
    handleTextInputChangePlace: (place) => {
      setPlace(place);
    }
  };
};
export const useIdState = () => {
  const [id, setId] =useState<string>('');
  return {
    id,
    setId
  };
};
export const useVotesState = () => {
  const [votes, setVotes] =useState<number>(0);
  return {
    votes,
    setVotes
  };
};
export const useModalState = () => {
  const [isModalOpen, setIsModalOpen] =useState<boolean>(false);
  return {
    isModalOpen,
    setIsModalOpen
  };
};
