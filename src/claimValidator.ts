export enum ClaimType {
  TopLine = 0,
  MiddleLine = 1,
  BottomLine = 2,
  FullHouse,
  EarlyFive,
}

export type Ticket = number[][]; // A 3x5 matrix representing the ticket, each row containing 5 numbers

export function validateClaim(
  numbersAnnounced: number[],
  ticket: Ticket,
  claimType: ClaimType
): "Accepted" | "Rejected" {
  // Validate ticket dimensions
  if (ticket.length !== 3 || !ticket.every((row) => row.length === 5)) {
    throw new Error("Invalid ticket dimensions. Ticket must be 3x5.");
  }

  // Check that at least 5 numbers have been announced before any claim
  if (numbersAnnounced.length < 5) {
    return "Rejected";
  }

  const announcedSet = new Set(numbersAnnounced);
  const lastAnnouncedNumber = numbersAnnounced[numbersAnnounced.length - 1];

  switch (claimType) {
    case ClaimType.TopLine:
    case ClaimType.MiddleLine:
    case ClaimType.BottomLine:
      // Directly use claimType as the row index
      const rowNumbers = ticket[claimType];
      if (
        rowNumbers.every((num) => announcedSet.has(num)) &&
        rowNumbers.includes(lastAnnouncedNumber)
      ) {
        return "Accepted";
      }
      break;

    case ClaimType.FullHouse:
      // Check if at least 15 numbers have been announced
      if (numbersAnnounced.length < 15) {
        return "Rejected";
      }
      // Check if all numbers in the ticket are in the announced numbers
      const ticketNumbers = ticket.flat();
      if (
        ticketNumbers.every((num) => announcedSet.has(num)) &&
        ticketNumbers.includes(lastAnnouncedNumber)
      ) {
        return "Accepted";
      }
      break;

    case ClaimType.EarlyFive:
      // Check if at least five numbers on the ticket are in the announced numbers
      const crossedNumbers = ticket
        .flat()
        .filter((num) => announcedSet.has(num));
      if (
        crossedNumbers.length >= 5 &&
        crossedNumbers.includes(lastAnnouncedNumber)
      ) {
        return "Accepted";
      }
      break;
  }

  return "Rejected";
}
