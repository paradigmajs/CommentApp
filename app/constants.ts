export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  USERNAME: /^[a-zA-Z0-9!@#$%^&*()_+=[\]{};':"\\|,.<>/?]+$/,
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };

  if (date.toDateString() === now.toDateString()) {
    return `Today ${date.toLocaleTimeString([], options)}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday в ${date.toLocaleTimeString([], options)}`;
  }

  return date.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
    ...options,
  });
};
