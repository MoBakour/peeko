export const formatTime = (input: Date | string | number) => {
    const date = new Date(input);
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
        date
    );

    return formattedDate;
};

export const generateActivationCode = (): string => {
    const max = 999999;
    const min = 100000;
    const code = Math.floor(Math.random() * (max - min + 1)) + min;
    return code.toString();
};
