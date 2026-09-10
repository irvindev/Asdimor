import moment from 'moment';

export const isFridayToSaturdayRange = () => {
  const now = moment();

  const fridayStart = moment()
    .day(5)            // Viernes
    .hour(17)
    .minute(30)
    .second(0);

  const saturdayEnd = moment()
    .day(6)            // Sábado
    .hour(19)
    .minute(0)
    .second(0);

  // Si hoy es domingo (0), ajustamos al viernes anterior
  if (now.day() === 0) {
    fridayStart.subtract(7, 'days');
    saturdayEnd.subtract(7, 'days');
  }

  return now.isBetween(fridayStart, saturdayEnd);
};